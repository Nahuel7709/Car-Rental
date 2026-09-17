Car rental — process of thought

Inspiration website I used as a guide: https://www.sixt.com/

# 01-Challenge

- First of all I created a project with npm create vite and selected React +
  TypeScript + SWC.
- I cleaned the boilerplate code and files, leaving only App.tsx and main.tsx.
- I created the interfaces, types and data folders. Inside interfaces I created
  Car.ts with the corresponding interface. Inside types I created CarTypes with
  several types related to cars that I used in the Car interface. Inside data I
  created cars.ts with all the mock data of the cars, using an array of type Car
  (the interface I created).
- I created the components folder in src with the components CarCard, which
  represents the card of each car, and CarList, which is the list of all the cars
  (no styles yet). Here I did a lot of studying of React and props, because some
  things weren't clear to me, like how to type props. I decided to pass car to
  CarCard as a whole object, since the object had many properties and I felt that
  destructuring it would make the code messy.
- I created the GitHub repo and made the first commit.
- Added Tailwind and applied styles.
- Created a UI folder to make a component called Badge, because I thought it was
  necessary since I was using the same code for the badges several times.
- Added images to public and used a conditional to render either the image of each
  car or a placeholder if it doesn't have one.
- Did the same thing with the button (created a component in UI) that I did with
  the Badge.
- Wrote the README.md and pushed the last changes to main.

### Comments on how I felt about this challenge:

Starting the project by creating the interface and some types first was, I think,
a good decision, and I had no problem with that. When I had to start creating all
the components in React I got a bit stuck and had to review a lot of material.
What cost me the most was props: I didn't remember well how to handle them, and
also how to type them. I didn't understand the logic that when you pass a prop an
object is created, and that I can't type that object directly but instead have to
type the property or properties that are inside it. That took me a while to
understand. After that I could keep going without problems; rendering the list of
cars with map and one card per car wasn't much of a problem, I remembered that
beyond having to check the syntax a bit. Then I also created the Badge and Button
components, because I felt Badge was repeating a lot of code and the same would
happen with Button, and it also helped me practise children props a bit. I felt
very out of practice on some things that I know are basic, but I feel I pick the
rhythm back up quickly. By the way, I tried to do the styles myself but I relied
quite a bit on AI so as not to lose too much time there. I also used AI to
explain concepts I didn't understand well, like props, and to review my code and
point out my mistakes. It generated the mock car data and most of the Tailwind
classes. The component structure, the types and the decisions are mine.

### DECISION about CarList importing the mock cars directly:

It makes more sense for a purely presentational component like
CarList not to handle getting the data, and to receive it from its parent
instead, without knowing where it came from.

If the data comes from an API later, CarList would receive it the same way,
through the same prop, without changing anything inside it. The only thing
that changes is how App obtains the data.

I put that responsibility in App because it's the root of the application:
the place where everything is assembled. The components at the edges display,
the root knows where things come from.

There is a second benefit. If several components need the same data, doing the
import or the API call inside each one would mean repeating the same request in
several places, with the risk of them showing different things. Doing it once
at the top and passing it down as props keeps a single source of truth.

# 02-Challenge

Before starting challenge 2, I first reviewed useState and practised it with a
few exercises to get it fresh again. After that I spent a lot of time practising
how to capture inputs and use them with state (this is where I studied the most).

Now, how the challenge went:

I decided to start with the search bar, so I began by adding a text input with a
"Search" placeholder. I created the `search` state, where I'm going to store
whatever the user types in the search bar, capturing it in the input through an
`onChange` and saving the value with `setSearch` (the state I created). I tested
that it worked by creating a paragraph with the content of `search`, to see if
that paragraph changed with what I was typing in the search bar. For now I
didn't create a separate component for this search/filters section, I'll do that
once it works.

With what the user types now captured in state, I can filter the cars that are
displayed based on that state. But I already know I'm going to have more than one
filtering condition, so I decided to create a `filteredCars` constant, and inside
it several constants, one for each filtering condition. I started with
`searchFilter`, which is the one for the search bar and filters by whether the
car's brand or model contains what the user typed. I return `searchFilter`, which
for now is my only condition, and the map that renders one CarCard per car now
runs over `filteredCars` instead of `cars`.

As the next filter I created a button that works as a toggle, so I can filter the
cars by whether they're automatic or not. So I created another state to hold
whether that button is true or false. Then, inside `filteredCars`, I created a new
constant `automaticFilter` where I filter each car by either of these options: if
the value of `onlyAutomatic` is false (`!onlyAutomatic`), or if the car is
automatic (`car.gearbox === "Automatic"`). I return that constant together with
`searchFilter`.

The next filter I created was the vehicle type one. I created a select with 5
options: one for all of them, and then one per car type. I created a state to
handle which filter is selected, which is "All" by default. Then I use that state
to filter car by car: if the state is "All" it lets every car through, otherwise
it checks whether the car's type is equal to the state of the select. I also
created a new type, which is `VehicleType` plus the "All" option added through a
union type, so I could type the select's state correctly.

Then I did the same thing with the categories — luxury, economy, premium in a
select.

I added the conditional to render either the grid of cars or the message saying
none were found.

I created a `pages` folder with `CarsPage`, which owns the filter state and computes the filtered list, and a new `CarFilters` component with the controls.
The reason the state ended up in the page is structural. Once I pulled the controls out of `CarList` into their own component, `CarFilters` and `CarList`
became siblings, and both need the same values: the filters to display what the
user selected, and the list to show the result of filtering. In React data only
flows down, so two siblings can't share a value between them it has to live in
their closest common parent. That's the page.

Applied styles and change de "All" option in both select to "All categories" and "All types" to describe better what each select does.

### Comments about this challenge:

The part I felt most comfortable with was using state for the filters and
building the controls (the search input, the selects, the Automatic button),
creating a piece of state for each one. I had practised that before starting
the challenge, so when I got there it wasn't a problem. Maybe wiring the filter
conditions together made me stop and think about the syntax for combining them
all at once, but it was ok.

Where the state should live did make me think. I won't lie, at the time CarsPage
felt redundant to me when I already had CarList. But I remembered what we
discussed in the first challenge, that CarList should only be responsible for
rendering the list of cars. And once I split CarList and CarFilters they ended
up as siblings, so lifting the state was necessary. Lifting it all the way up to
App.tsx didn't feel right either, since it would have cluttered App, so that was
a clear reason to create CarsPage.

Going back to the moment I split the components: passing all the functions down
as props was the hardest part of the whole challenge. I struggled with knowing
when to invoke a handler and when to just pass it, with how to type each
function, and things like that. I learned a lot there about handling state
through props. I won't lie, I still find it a bit difficult, but I understood it
well enough.

### DECISION about CarsPage and button to clear filters

A user who has set a search, a toggle and two selects has no
way back to the full list other than undoing each control one by one, so a button to clear filters was neccesary

The reset function lives in CarsPage, because that's where the four pieces of
state live. CarFilters couldn't clear them even if it wanted to, they aren't
its own. It gets the reset as a prop, onClearFilters, a notification with no
data attached, exactly like onToggleAutomatic.

The button only shows when at least one filter is active. A control that does
nothing is noise. Knowing whether there is anything to clear means comparing
each filter against its initial value, which is derived data again, calculated
on each render like filteredCars rather than stored in state.

# Challenge 3

### Comments about this challenge:

Before starting challenge 3 I reviewed client, server, http, express, async, await and useEffect. I had no problem with express, I understood it easily and the official documentation is quite easy to follow to do the setup. What I spent the most time on was useEffect, to understand it well and why it is used. What I learned is that React re renders a component every time its state changes or one of its parent components re renders. What is a re render? Executing the function that is that component. Why does it do this? Because through this it updates its virtual DOM so it can compare it with the previous one and see exactly what changed. Once it identifies what changed it does the commit, which is applying those changes to the (real) DOM. Up to here, all things I had already seen when we reviewed useState. But why does this matter? Because now that we are going to get the data from an api, where do we store that data so we can use it in our React interface? In a constant? If we store it in a constant, React would never find out that there is something new to render, since it only does that when state changes. Ok so I store it in state, a useState of cars and setCars, but the problem is that if I create a function that fetches the cars and then stores them in the cars state I am going to create an infinite loop, since that function would run every time the component renders, and the component, as we said before, renders every time its state changes, which is going to happen every time that function runs, we can see the problem. So that is where useEffect comes in. An effect in React is something that runs after the first render or every time something specific updates. And in our case this solves the infinite loop problem, we store our cars data only the first time we render the component. I hope I managed to make myself understood and did not tangle myself up too much.

### Process of doing this challenge

To start this challenge the first thing I did was change the folder structure. I created a backend folder where all the back logic is going to be, like the routes, the resources each route provides and the (simulated) db for now. And another folder web where everything from the front is going to be. In the backend folder I did the express setup. I checked the setup was correct by going to / and seeing Hello World. Since the challenge asks to create a route that provides the cars, I created a get /cars that returns a json of the simulated data we have in db/cars.ts. Here, since in the future this data is going to come from a database and that configuration is probably going to be inside the backend folder, it seemed right to me to move the data folder from web to backend, since it is more related. For now I had to copy and paste the interfaces folder into backend as well because it is used both in the front and in the back. I install cors, import it and use app.use(cors()) because otherwise my front would not be able to communicate with my back.

Then, with the backend already providing the get /cars endpoint with the json with the data, I am going to connect that endpoint to the frontend. For that the first thing I do is create an api folder inside web, where I am going to make the call to the api to this single endpoint we have for now which is cars, I do it with an async function and a fetch of this endpoint, and I also type the function with a return that is going to be a promise of an array of cars. With that promise ready that is going to fetch the cars I go to my App.tsx to replace the old data with this new data the back is giving us (App.tsx still passes the data to its children through props, only now it comes from an api). The first thing I do is create a cars state where we are going to store the cars data, initialized with an empty array and typed as an array of Car. Together with this state we create 2 more, 1 to know when it is loading and another to know when an error occurred (the 3 possible states of a promise). Now we are going to use a useEffect to get the cars and store them in the cars state, the dependencies of this useEffect we leave as [] so it only runs once on the first render, we are not going to have a second return since we do not need to clean anything up. The useEffect calls an async function getCars, which is the one that runs on the first render. This function getCars has a try/catch/finally, where in the try we await the fetch of the cars data with our fetchCars function that we created in api/cars, and once that promise is successful we store the data it brought in the cars state with setCars. If an error happens in this process with the promise we catch it with the catch and update our error state. We use finally to set the loading state to false, which I forgot to mention starts as true because that is always the first stage, a promise always starts pending, and once this process finishes and we have a fulfilled or rejected promise that loading state becomes false, until we run the process again.

Having done this we now have to pass these states through props to be able to use them in our other components. At this point the app is like before and shows the cars without problems, only now that data comes from the backend. The next thing that seems right to me is to use our error and loading states, and instead of showing the list of cars if they are still loading, show a loading component, and if there was an error show a component that describes the error.

For loading I chose a skeleton instead of a spinner, because it keeps the shape of what is about to appear and the layout does not jump when the cars arrive. I created CarCardSkeleton, which is one card with the same structure as CarCard but with grey blocks, and CarListSkeleton, which repeats it in the same grid as CarList. For the error I created an ErrorMessage component in ui, since it is generic and not tied to cars. The three cases are exclusive, either it is loading, or there was an error, or we have the list, so in CarsPage I used early returns instead of conditions in the JSX. I had it with && first and the problem was that the "No cars were found" message appeared next to the skeleton and next to the error, because at that point cars is still an empty array.

Showing the error is not much use if the only way out is reloading the page, so ErrorMessage receives an onRetry prop with a button that runs the fetch again. To be able to do that I took getCars out of the useEffect and defined it in App.tsx, so the useEffect only calls it and the same function can go down as a prop to CarsPage and from there to ErrorMessage. I also had to fix something: at first getCars did not reset the states, so when the user pressed retry the error was still there and loading was already false, and nothing would have changed on screen. So now getCars sets error back to null and loading back to true before doing the fetch.

About AI: same as in the previous challenges, I used it to explain concepts I was not sure about. Here it also generated the Tailwind markup for the skeleton and the ErrorMessage

### Changes after the review

The API URL was hard coded in api/cars.ts. I moved it to a Vite environment variable, VITE_API_URL, with a .env.example committed. Something I learned here: the front .env is not a secret, Vite replaces the variable with its literal value at build time, so it ends up inside the bundle that anyone can read.

I also took the port out of the backend code, reading process.env.PORT with 3000 as a fallback, because hosting platforms assign the port themselves and expect the app to listen there.

cors() with no arguments sends Access-Control-Allow-Origin: \*, which means any site can read the responses from a browser. Now it takes an origin option read from process.env.CORS_ORIGIN, with the Vite port as a fallback. I checked the header in the Network tab and also set a wrong origin on purpose to see it fail, otherwise I could not tell if the config was doing anything.

I did not create a .env in the backend. Both values have a safe default that is already correct locally, so the file would only repeat the fallback. It becomes necessary with the first value that cannot have a default in the code, like an api key. That is the difference: configuration changes per environment but nobody cares if you see it, a secret must never be seen, and only the second one forces the file.

About fetchCars returning Promise<Car[]>: it does not verify anything. TypeScript does not exist at runtime, the types are stripped before the code runs, so no type can check data coming from the network. res.json() returns any for that reason, and my return type is a claim the compiler accepts. It protects everything downstream but not the entry point. The real fix is runtime validation, left for later.

I added a typecheck script to the backend. I had not realised that tsx strips the types without checking them, so until now nothing verified them at all.

Smaller things: removed Request and Response, imported but unused, and the Express annotation on app, since express() already tells the compiler what it returns. That connects with the any above: inference is enough for my own code, and the border with the outside world is where I actually have to write the type. Removed VehicleTypeFilter and CategoryFilter from the backend copy of Car, since "All" is a UI control state and not part of the domain.

# Challenge 4

### Process of doing this challenge

I created a CarsContext with a CarsProvider, but I did not put the fetching logic inside the provider. I moved it to a useCars hook with the three states, the getCars function and the useEffect, and the provider only calls that hook and passes the result as the value. That way the provider is three lines and has no logic of its own.

I did the same with the filters, in a useFilters hook that takes the cars and returns the four states, their setters, clearFilters, areFiltered and filteredCars. CarsPage now reads the cars from the context and calls useFilters with them.

CarList did not change at all. It still receives the cars it has to render through a prop and does not know where they came from, which is the decision from challenge 1 still holding.

### DECISION about the default value of the context

The default value of createContext is only used when a component consumes the context without being inside the provider, so it is what happens when I make a mistake. My first version was a fake object with cars empty and loading true. The problem is that this is indistinguishable from reality: a correctly placed component gets exactly the same thing on the first render. So if the screen stayed on the skeleton forever I would have no way of knowing whether it was loading or whether I forgot the provider. The bug disguises itself as normal behaviour.

I changed it to undefined, because the provider can never give undefined, so receiving it has only one possible explanation. That broke the typecheck, which was the point: TypeScript started forcing me to handle a case that was already there and nobody was telling me about. I solved it with a useCarsContext hook that throws with a message if the value is undefined, and returns it otherwise. After the throw TypeScript already knows the value cannot be undefined, so the type narrows on its own, the same as with the early returns in CarsPage.

### DECISION about where the provider lives

I left the provider inside Layout, wrapping only CarsPage, instead of wrapping the whole app. Today nothing outside CarsPage consumes the cars, so putting it higher would be solving a problem I do not have. The day the Header or anything else needs the data, moving it up is one line.

### DECISION about the filter state

The filter state did not go into the context. It went to the useFilters hook, called from the page. The cars are data that several pages could need, and that is what the context is for. The filters are the state of one screen, and no other page has any use for them, so putting them in the context would make global something that belongs to one page.

I know this leaves open what I answered in the third question: with the filters living in the hook that CarsPage calls, they still die when CarsPage unmounts, so they will be lost when the router arrives. I decided not to solve that yet because there is no router, so I cannot even test the problem. When there is one I will have to decide whether the filters go up or whether they live in the URL, which is the other option I can think of.

### Challenge 4 corrections

Since getCars is an async function it always returns a promise, so I changed its type in CarsContext to () => Promise<void>. In the onRetry prop that goes to ErrorMessage I left it as () => void, because void as a return type does not mean the function returns nothing, it means the caller ignores whatever comes back, and that button does not use the promise. That is also why passing getCars there still compiles.

About the lint warnings in CarsContext: I like having everything related together because I find it easier to read, so to keep that I created a cars subfolder inside context, where I split the context from the provider and export both from a barrel file. I did not put CarsContext itself in the index. Only the provider and the hook are public. useCarsContext exists to be the only door in, the one that checks you are inside the provider, so exporting the raw context would leave a back door that skips that check.

# Challenge 5

## Before coding

**Should the details page use cars from Context or request one by ID?**

I would request it by ID from the corresponding endpoint, reading the ID from the
URL with `req.params`. If the details page read from the Context instead, someone
opening `/cars/3` directly — from a shared link or after a refresh — would have to
download every car with all of its data just to show one.

**What should happen for a car URL that does not exist?**

The backend should return a 404 saying that car was not found: the route is valid
but the car is not. On the frontend that is a state of `CarDetailsPage`, not the
wildcard route, and it gives the user a way back to the car list. There is no
retry button, because retrying cannot change the answer.

**Should the page have its own loading and error states?**

Yes, because it is a different request with a different lifecycle — they can be at
different stages. The list can be loaded while the detail is still fetching. It
also needs a state the list does not have: not found.

**What should happen to active filters when returning to the list?**

For now they are lost, because they do not persist in state or in the URL. I could
make them persist in state, but that would still be the wrong approach: if someone
shares the link it goes without the filters, if you go back you lose everything,
and the same happens on F5.

The right place for them is the URL, as query parameters
(`/cars?search=toyota&category=Luxury`). React Router exposes `useSearchParams`,
which has almost the same API as `useState`, so `useFilters` would barely change.
That also means the back button would undo filters one at a time, which is what a
user expects. I did not implement it because this challenge only asks me to
explain it.

**Where should CarsProvider live now that there is more than one page?**

I would leave it where it is, adding another page (`CarDetailsPage`) and the
router. The provider goes outside `Routes` — because if the provider lives inside
a route `element`, it unmounts on navigation and fetches everything again. `Layout`
becomes the parent route holding the other routes, and instead of taking `children`
it uses `Outlet`, the React Router component that renders whichever child route
matches.

Note that this does not save the filters: they live in `CarsPage`, and that page
does unmount when you navigate away.

## Process

### Routing

I installed React Router and set the routes up in `App.tsx`, leaving `CarsProvider`
outside `Routes`. `Layout` became the parent route, with `CarsPage` and
`CarDetailsPage` as siblings under it. The details route takes the ID as a
parameter, and `CarDetailsPage` reads it with `useParams()`.

I also added the wildcard route — anything that does not match the other routes
renders `NotFoundPage` — and a redirect so that entering `/` sends you to `/cars`.

### Linking to the detail

I replaced the button in `CarCard` with a `Link` pointing to `/cars/<id>`. At this
point the detail page could not show the car yet, because the backend had no
endpoint returning a single car by ID. That was the next step.

### Backend: GET /cars/:id

I read the ID from the params and convert it to a number, since everything coming
from a URL is a string and I need a number for the comparison.

My contract is that a valid ID is a whole number. If it is not — someone typing
something like `banana` — I return **400 Bad Request**, because the request itself
is malformed. If the ID is valid but no car matches it, I return **404**: the
request was fine, the car simply does not exist. Otherwise I return the car.

### Frontend: fetching one car

In `api/cars.ts` I added the function that fetches a single car. If the response
status is 400 or 404 it returns `null`: there is nothing to return, and it is not
a server failure — the client either malformed the request or asked for something
that does not exist. From the user's point of view both mean the same thing, so
they get the same screen.

Anything else that is not `ok` — a 500, for example — throws, because that is a
real error and retrying can help. If the response is fine, I return the data.

### The hook: useCar

I do the fetch inside a `useEffect`, because storing the data in state during the
render would cause an infinite loop.

The difference with the list is the dependency array. Going from `/cars/1` to
`/cars/2` does **not** unmount `CarDetailsPage` — it is the same route and the same
component, so nothing would trigger a new fetch and we would be stuck looking at
car 1 forever. The effect has to re-run when the ID changes.

`getCar` lives outside the effect because the retry button in `ErrorMessage` also
needs it. That means the effect depends on `getCar`, and `getCar` in turn depends
on the ID — React cannot know that on its own.

Without `useCallback`, `getCar` would be a brand new function on every render, the
effect would see it as changed every time, and it would run in a loop. `useCallback`
keeps it as the same function while the ID does not change, so declaring
`[getCar]` in the effect is equivalent to depending on the ID, but in a way the
linter can verify.

### The page

`CarDetailsPage` uses the state the hook gives it and renders one of **four**
things: the skeleton while loading, the error screen with a retry button, the "car
not found" screen, or the car. The order matters — loading has to be checked first,
otherwise the page would show "not found" during the very first render, when
nothing has arrived yet.

I asked the IA to do the visual design of the
app: the Tailwind theme, the layout of the cards and the detail page, the
skeletons and the empty and not-found screens.

## Corrections

### Where the provider lives and when the list is requested

The CarsProvider had a useEffect inside it that ran getCars. Since the provider wraps all the routes, it mounts once when the app starts and never unmounts, so the full car list was requested no matter which route the user opened. Opening /cars/1 directly requested the whole list and car 1, which is the opposite of the reason I gave for fetching a single car by id.

What I did was take the useEffect out of the provider. The provider still gives access to cars, loading, error and getCars, but now it is up to each component that needs the list to request it with a useEffect of its own. For now that is only CarsPage, which is the one component that exists only while the user is looking at the list.

The way I would put it: before, where the state lives and when the request happens were the same decision, because the effect was inside the provider. Now they are two separate decisions. The provider decides where the state lives, and each consumer decides when it needs the data.

That change also made getCars need useCallback. Once the function travels through the context and becomes a dependency of an effect, its identity matters: a function declared inside a component is a new object on every render, so the effect would see a changed dependency every time and run again, which is the infinite loop I was trying to avoid in the first place. Its dependency array is empty because the function only uses the useState setters and a module import, and none of those change between renders.

### What this trade cost me

This is not a clean win and I want to write down what it cost, because I only saw it when I opened the Network tab.

Fetching the list from CarsPage fixed the direct entry case, but it introduced a different one. If the user opens the list, clicks a car and presses Back, CarsPage mounts again, the effect runs again, and the list is requested again with the skeleton showing, even though the provider never unmounted and still has the cars in its state. Before this change that did not happen, because the provider had fetched them once at startup.

### Validating the id on the backend

The handler was converting first and validating afterwards:

    const id = Number(req.params.id);
    if (!Number.isInteger(id)) { ... }

That let things through that I did not expect. /cars/1e0 returned car 1, and so did /cars/1.0, /cars/0x1 and /cars/+1. It is not a bug in Number: Number is a general purpose numeric parser and it accepts scientific notation, hexadecimal, whitespace and signs, which is exactly its job. It was the wrong tool for the question I was actually asking, which is whether this string is a plain whole number.

The real problem was the order. Converting first destroys the evidence I needed to validate: once "1e0" has become 1, there is no way to tell it was written oddly. So the rule I took from this is to validate the value in the shape it arrived in, and only convert after it has passed.

Now the handler tests req.params.id as a string, before touching it, against a regular expression that only accepts digits from beginning to end. The two anchors are the important part: without them the expression would look for digits anywhere in the text, so something like "abc123" would pass. With them it means digits end to end and nothing else.

I decided to let "0" and ids with leading zeros like "007" pass the validation and fall through to the 404 instead of rejecting them with a 400. They are well formed ids that simply do not exist, so 404 describes the situation better than 400.

### Error messages

"Bad request" and "Not found" only repeated what the HTTP status code already said, so they added nothing for whoever reads them.

A useful error message says what went wrong and what was expected instead, so the 400 now says that the car id must be a whole number, and the 404 includes the id that was asked for, which is the part that actually helps when someone is debugging.

Both keep the same { message } shape. An API that returns errors in different shapes depending on the case is painful to consume, because the client has to guess how to read each one.

One decision that goes with this: on the frontend, fetchCar returns null for both a 400 and a 404, so both end up showing the not found screen. The backend does distinguish them, because anyone integrating with the API needs to know whether the request was malformed or whether the resource is missing. But for the user the two mean the same thing, since a person only lands on one of those URLs through a broken link or by typing something into the address bar themselves, never through the UI. In both cases there is no car at that address and nothing to retry.

### A note on filters in the URL and browser history

Something I had not thought about when I said the filters could live in the URL: not every URL change should become a browser history entry.

Changing the URL can push a new entry onto the history or replace the current one. If every letter typed into the search box pushed a new entry, typing "toyota" would leave six entries behind it, and the user pressing Back would delete the search one letter at a time before getting out of it. Nobody wants to go back letter by letter.

So the two kinds of navigation are not the same. Typing in a filter should replace the current entry, because the user is refining the same view and not moving to a different one. Clicking a car should push a new entry, because that is a real navigation somewhere else.
