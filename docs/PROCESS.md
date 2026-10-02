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

# Challenge 6

## Before coding questions:

1. How is a database different from the current TypeScript file?
   They are very different. The TypeScript file we have today lets us display a set of
   cars that are already in it, but it does not let us store cars so that they persist.
   To add, edit or delete a car you have to change code: edit the file, push it and
   restart the server. It does not persist because it lives in the process memory, so
   anything written there is lost on restart. Two backend instances would be two
   separate arrays with nothing keeping them in sync. Queries have to be written in
   TS/JS, and it is all or nothing: even if only a few cars end up being shown, you
   first have to load all of them and then filter in JavaScript. Another problem is
   that there is no way to relate things to each other — how would I link a car to its
   bookings? A database handles all of this much better. It lets the user add, delete
   and edit records (as long as their credentials allow it, which is a separate topic)
   and have those changes persist, and it lets us query for exactly what we need.

2. What belongs in environment variables?
   Environment variables hold values that change depending on where the project runs
   (local machine, staging, production) — for example the base URL or the server port.
   They also hold secrets: values that must not live in the code for security reasons,
   such as an API key or the database URL. These variables go in a `.env` file which is
   not committed to Git, because the information is sensitive: anyone who gets hold of
   our API key or database URL could reach our database or backend and do whatever they
   want. That is why we commit a `.env.example` with empty values instead, and the real
   values are requested separately and handed to you depending on the job. In our case,
   since this is a practice project, they are explained in the README.md.

3. What is a migration and why is it needed?
   A migration is a file containing the changes to the structure of the database, saved
   with a timestamp and kept in order. The problem it solves is this: we have the schema,
   which describes how the structure of the database should look TODAY, but the database
   already exists, with data in it and possibly an older structure. So suppose we change
   something in that structure. What do we do — drop the database and recreate it from
   the schema? We would lose all the data, and in production that is a disaster. A
   migration lets us get the table to how it should look today without dropping and
   recreating the database. It lets us change the structure of a database that already
   exists.

4. What is seed data and how is it different from a migration?
   Seed data is a script that loads the initial data; a migration is a file containing
   changes to the structure of the database.

5. What should the API do if the database is unavailable?
   It should return a 5xx error stating that something went wrong on the server side,
   and give the user the option to retry (since this is the kind of problem that will
   eventually be resolved). Be careful not to give the user too much information — just
   the status and the fact that a server-side error occurred. The precise details have
   to be logged internally, for the developers or whoever needs them.

6. Should the frontend know that the backend now uses a database? Why?
   No, because the frontend still receives the information the same way as before: it
   calls the backend API endpoint and gets JSON back. The backend is the one talking to
   the database, not the frontend.

### How I designed the Car model

I tried to keep the Car model as close as possible to the existing Car interface.
The id is now auto-incrementing and assigned by the database, the image stayed as an
optional String, and I kept pricePerDay as an Int rather than a Decimal because the
values are whole numbers.

I created the three enums because those properties can only hold certain values, not
any arbitrary String. The values are written in SCREAMING_CASE, following the
convention used in the Prisma documentation. To avoid making the frontend change
because of those new values, the backend uses a mapper that translates them into the
values the frontend already works with.

For now I did not add any index. The queries the backend currently makes are: fetching
all the cars, where an index would not help at all since we need to return every row
anyway; and fetching a single car by its id, which is already indexed automatically by
the primary key. If a larger query shows up in the future and turns out to be slow, we
can evaluate adding one then.

### Seed

For the seed I created a `seed.ts` file inside the `prisma` folder, which imports the
Prisma client I set up in `db/prisma.ts`. When the seed runs it first empties the `Car`
table and then inserts all the seed cars. The reason for emptying it first is so the
seed can be run as many times as you want and always end up with the same cars, instead
of duplicating them.

At first I did this with `deleteMany`, but that only removes the rows: the
auto-increment sequence is a separate object that only moves forward, so it had no way
of knowing the rows were gone. The first run used ids 1 to 14, and the second one
carried on from 15. I replaced it with a `TRUNCATE ... RESTART IDENTITY`, which empties
the table and resets the counter, so every run produces the same ids.

The seed does not use the mapper: it writes directly using the database enum values.

### Explain what changed in each backend route.

GET /cars, instead of returning the array of cars, does a findMany on the whole
Car table through the Prisma client where we set up the connection, so it brings
everything in that table.

GET /cars/:id, instead of getting a car out of the array with find, goes to the
Car table through Prisma and uses findUnique with a where saying that the id from
the params has to match the id of the car in the table. findUnique only accepts
unique fields, and the id is the primary key, so it works.

The validation stayed the same. Both routes are async now, since we await Prisma.
They do not have a try/catch because Express 5 forwards rejected promises to the
error middleware by itself.

Both return the result passed through the mapper, so the frontend gets the enums
in a better shape.

### Explain how you handled database errors.

Through the middleware, which goes at the end, after the routes, because Express
goes through them in the order they are declared. It takes four parameters, and
that is how Express knows it is the error middleware. The full error goes to the
log, with the method and the URL; the client gets a 500 with a generic message.
The reason is the one I gave in question 5 before starting: if I sent err.message,
when the connection fails the client would receive the Supabase host, the port and
the user. The expected errors, 400 and 404, do not go through here, they are
answered in the route.

### Describe any problems you found and how you solved them.

The enums broke the contract with the frontend, for example SEDAN vs "Sedan". I
decided the best way was to keep the SCREAMING_CASE and solve it in the backend
with a mapper. Since I did not know exactly how to do this, I asked Claude to help
me with that function and to explain it to me in detail.

Another problem was that findUnique returns null and not undefined, which is what
I had before with the array. I changed it and that was it. The route was answering 200 with a null body, and the app still looked fine in the browser because the frontend showed the not found screen anyway. I only caught it with curl.

### Explain where you used AI and what you needed it to explain.

AI helped me with the structure of the seed and how to code it, because honestly I
could not work out how to do it from the documentation.

The car mapper, as I said above, was written by AI, and I asked it to explain it
to me since I had never done one before. I decided to do it because it seemed like
the right thing for this case.

I also needed AI to explain the initial Prisma setup to me, and I did it myself as
it went, because I found that a bit confusing too.

Also help me with the config to do the lint typecheck and build.

# Challenge 7

## Before coding

### Explain the difference between authentication and authorization.

Authentication is the page knowing who you are and your necessary data. Authorization is the page knowing if you have permission or not to do a certain action based on who you are.

### Explain why passwords must never be stored directly.

Because if we store a password directly in plain text, we run the risk that if our database leaks, all the users' passwords leak too, and this would be very serious because anyone who had access to our database has access to the users. And not only that, users often use the same password for several applications, banks, whatever, and because of our page we could end up giving attackers access to users' banks or other things.

### Explain what password hashing is.

Password hashing is when, instead of storing the password in plain text in our db, before storing it we convert it into a more complex text that is equivalent to the password. But it doesn't end here, because if we leave it like that, the attacker can find out the hash equivalent of a password, and if more users have that password they get access to more and more. In fact, nowadays there are ways to know the hash equivalents of a lot of passwords, so all it takes is for the db to leak, the attacker reads the hashes and looks them up to get access to each one. That's why, besides hashing, what we do is add a salt. A salt is a random piece that is added to the password before the hash, so a hash is never equal to another one even if they have the same password. It also helps a lot for the algorithm to be slower, like bcrypt or argon2 and not SHA-256, because if it's slower it costs the attacker much more time and resources to check those of millions of users, while for a user it's instant. To log in, the password the user entered in the login is hashed and the new hash is compared against the stored hash, if they are equal the user gets in.

### Explain the difference between 401 and 403.

401 is Unauthorized, which means you are not authenticated and you need to authenticate for that request. On the other hand, 403 is Forbidden, which means that based on your credentials you don't have permission to make that request.

### Explain why the backend must check permissions.

Because otherwise anyone who creates an account in the application would have a free pass to make any request, and many times we don't want this. For example, here in car-rental we don't want just anyone to be able to create a car, so what we do is check their credentials, and if they meet certain requirements they can make that request or not. It's important that the back does it because it's not enough to just do it from the front, since people can make requests through Postman, curl, etc, and if our back isn't prepared to handle permissions, anyone could do whatever they want.

### Decide what belongs inside the authentication token.

Inside the token payload there will be the sub, which is the user id, iat, when the token was issued, and exp, when it expires. I saw that some people put the role, but I thought it was better to leave it out, because if we change the user's role, the user would keep that role until the token expires, and I don't think that's correct. I know that in exchange I have the cost of making a query to the database per protected request, but it's a trade-off that I think is right in exchange for security and practicality.

### Explain why an HTTP only cookie is safer than exposing the token to JavaScript.

Because if I expose the token to JavaScript, I run the risk that, if I suffer an XSS attack, in which an attacker manages to inject code into my page, they can get the token, read it and do whatever they want with it until it expires. On the other hand, with an HTTP only cookie, the one that provides the token is the browser, it will never be found in the front's code and it is attached to the requests. This is much safer, but we also have to be careful with CSRF attacks, which is an attack in which another malicious site makes the victim's browser send a request to our page where the user is already logged in, and since the browser attaches cookies automatically, the request goes out with the victim's identity. But this can be solved easily by setting the cookie to Strict so the cookie is never sent in requests that originate from another site, or Lax for requests that only navigate to our site.

### Decide how the current user is restored after a page refresh.

When the user state is lost, the front makes the request to GET auth/me again, in which the browser provides the available cookie again, which survives the refresh. The backend verifies the JWT that the cookie contains, looks for the user and responds with a JSON in the body, ready for the front to know the logged in user.

### Explain why registration must not allow someone to select ADMIN.

Because this way any user could be ADMIN, even users we don't want to be. By default all users should be created as normal users, because it's not enough to just hide this option in the front, someone can select admin through Postman or a curl, so we let the role always be created by the back and it never reads it from the request. The main admin user can be created by hand through a seed in a safe way and without committing it. Then users with specific roles can be made through invitations or be assigned later in the app by someone with permissions.

## Process:

- I started by adding to the Prisma schema the Role enum that contains ADMIN and CUSTOMER, and I created the user table with its columns, in which the email is unique and the role defaults to CUSTOMER, for the reasons I explained before in Before coding. I ran the migration and we can see that it created the User table, the enum and the index for email, since it's unique and it will have to compare it with all the existing values every time a new one is inserted.
- I installed argon2. I used this library because I looked it up and it's the one currently recommended by OWASP. I installed it before creating the seed for the admin user, since the seed is going to use it to hash the password. I created seed-admin, which inserts a user with the admin role into the db. This made me rename the existing seed to seed-cars so I could tell them apart. I decided to keep them separate so that if you only need to insert the admin user, you don't have to delete all the cars and seed them again, which is what our seed-cars does. To make the admin seed safe, the admin's "body" is taken from the environment variables, the password is hashed, the email is normalized and it's inserted with an upsert so there is idempotency, meaning that no matter how many times I run the seed, the result is the same. Also, if a variable is missing, it throws an error.

Up to this point I think I did a good job. I was able to rely a lot on the Prisma documentation to update the schema and run the migration. What was hardest for me was making the seed, I had a hard time understanding where to put it in relation to the cars seed, but after separating them I understood the syntax much better. In general I got a bit tangled up in this part of the seed. I wrote it using the documentation and asked Claude to point out what was wrong, and I had the idea of separating the 2 seeds into different files, not only for the practical reason I mentioned but because it helped me understand it much better.

Continuing the challenge, the next thing I did before starting to create the backend routes for auth was to organize the backend folder structure a bit better, since I'm going to implement Routes and Controllers. First I created a cars folder, where I put its interface and the mapper function, and there I created carsController and carsRouter. The cars router is the file where, based on a prefix, the different routes that can exist with that prefix are defined, and each one points to the function that handles it. The logic of each route lives in the controller. In the index there is only each prefix with its router (a group of routes).

It helped me to imagine it like when you call a bank, a hospital or some other service. An operator answers (the index) and asks what you need help with: press 1 for payments, press 2 for cards, press 3 for loans (the index with the different prefixes). Inside each option there is another menu (the router). For example, if you press 1 for payments: press 1 to learn how to make a payment, press 2 if your payment was rejected. And when you choose one of those options, you finally talk to the person who actually solves your problem (the controller). The operator and the menus only send you to the right place, but the one who does the work is the person at the end.

Now I created the auth route with its own folder that contains authController and authRouter. Inside authRouter I created the first route, POST /register. In the controller for this route I use Zod to validate the body that the client sends. I installed Zod and validate the body with a Zod schema using safeParse. safeParse always returns an object, so if its success property is false, I return a 400 with the message of the first issue in result.error.issues.

The schema checks that the name has at least 3 characters (after trimming it), that the email is a valid email, and that the password has between 8 and 64 characters. I didn't add composition rules (uppercase, numbers, symbols) because OWASP currently recommend focusing on length instead, since those rules push people to predictable passwords like "Password1!". The maximum is there so nobody can send a huge text and make argon2 spend a lot of time hashing it.

Then I take the validated data from result.data (never from req.body) in 3 variables: the password to hash it with argon2 and the email to normalize it (lowercase and trim). I never read the role from the body, so every new user gets the default CUSTOMER role. Also, Zod removes any field that is not in the schema, so if someone sends "role": "ADMIN" from Postman, it doesn't even reach result.data. I tested it and the user was created as CUSTOMER.

Then, inside a try/catch, I create the user in the db with that data and return a 201 with only id, name, email and role, using select, so the passwordHash is never sent to the front. In the catch, if the error is a P2002 (unique email already exists) I return a 409 saying the email is already in use. If it's any other error I throw it again, so it reaches the error handler and becomes a 500. This difference is needed because if I don't catch the P2002 separately it would be treated as a 500, as if it were a server error, and it isn't. And if I caught every error as a 409, a real problem like the database being down would be hidden behind an "email already in use" message.

The next thing I do is create the route and the controller for login. In the controller I create a Zod schema to check that the user sent an email that is a valid email and a password that is a string (here it isn't necessary to check the length, since what matters is whether it matches or not). Then I create the controller function, where I get the req.body with the schema I created and destructure it. After that I normalize the email for the comparison. I look for the user by the email they sent with findUnique and store it in a constant. If it doesn't exist I return an error. To compare them I use argon2.verify, not argon2.hash. The saved hash already contains the salt that was used to create it, so verify takes that same salt, hashes the password the user entered with it and checks if the result matches. If I created a new hash instead, argon2 would use a new random salt and the result would be different even with the right password. If they don't match I return the same generic error (this is on purpose, since we want to give as little information as possible about why the login wasn't successful). If they match, for now I return a 200 status and a json with the id, name, email and role.

The next thing I have to do is that, when the credentials are valid, besides returning the json I have to return a cookie with a token, so we know at all times who the user is, since HTTP is stateless. So I install jwt, create a token that expires in 12h and then return a cookie with the token inside, with all its configuration.

As a next step I'm going to create an authentication middleware to verify who the user is, so we know whether they can make a given request or not. The first thing I do is install cookie-parser and add it as a middleware in index.ts; this lets us read cookies, which is how we get each user's token.
Then I create a config.ts file inside auth, where I move the jwt_secret validation and create the cookie options, so instead of copying those things in several places we import them from that file.

In the authMiddleware, what we do is read the cookie. First we get it with req.cookies.token; if it's not a string we return a 401 saying invalid cookie. Then, inside a try/catch with jwt.verify, we access the payload of the token stored in that cookie. If it has no payload.sub or it's a string, we return 401; otherwise we store the sub converted to a number in a variable, which is the user's id. With that id we do a findUnique to look for the user with that id. If it doesn't find one, I return a 401 with user not found; if it does, it stores everything we put in the select ({ id: true, name: true, email: true, role: true }) in res.locals.user, and after that it calls next() to hand control to the next function in the route.

With the middleware ready, I add the GET /auth/me route, which first goes through the authMiddleware, and then the me controller returns whatever was stored in res.locals.user.

After this I add the logout route. The logic in its controller is a simple res.clearCookie("token", cookieOptions) to delete the cookie, using the same config it was created with, and a res.status(204).end() to indicate it was successful and there's nothing to return.

Now I create another middleware, requireAdmin, which checks whether the role of the user in locals is ADMIN. If it isn't, it returns a 403 not allowed; if it is, it lets the request continue.

The next thing I do is start working on the create a car route. I create the createCar controller, where I validate the body with the schema I created for this. If it's not a success, it responds with a 400 and the first error's message; if it is, it inserts the car into the db and returns it using the toApiCar function. I add the route with the controller and, in between, the previously created requireAdmin middleware, which verifies the user is an admin before they can access this route. But to use requireAdmin you need the authMiddleware, which gets the user's info and stores it in locals, so I also place it before requireAdmin.

Ok, now with the backend ready I move on to the frontend. First, I create the User interface, which describes what the backend returns. In the api folder I create auth.ts, with an async function whose return type is User or null. Inside this function I do the fetch to auth/me to get the user's data. If the status is 401 I stop with a return null; otherwise I return the data. The next thing I do is create the AuthContext, which is the channel to share the state; the AuthProvider, which is what puts the state into the channel; then useAuth, which holds the state and decides when to request the data; and index.ts, which is the barrel file. Finally I wrap the app with the provider, all following the same logic we had used for the cars provider.
The next thing I do is create the fetch to the login POST for when the user logs in. I do it in api/auth with a loginRequest function. Then, in the useAuth hook that manages the user state, I create a login function that calls loginRequest and sets the user in the state if it succeeds.

Going back to fetchMe, there are two details that matter. The fetch has credentials: "include", because the frontend and the backend are on different origins (5173 and 3000), and without it the browser doesn't send the cookie. And the 401 is handled before the !res.ok check: a 401 on /auth/me isn't an error, it just means there's no session, so I return null. Any other failed status does throw an error, because that one is something actually broken.

In useAuth, loading starts as true, not false. On the first render /auth/me hasn't been called yet, because the useEffect runs after the render, so the honest answer at that moment is "I don't know yet". If loading started as false, the app would think there's no session and could send a logged-in user to the login page. The useEffect has an empty dependency array so it runs only once, when the app mounts, and setLoading(false) is in the finally so it runs even if the backend is down. The context starts as undefined and the useAuthContext hook throws an error if it receives it. That way, if someone uses it outside the provider, they get a clear error instead of a silent bug.

For loginRequest it was my first POST from the frontend. It needs method POST, the Content-Type header so express.json() can read the body, the body with JSON.stringify, and credentials: "include", because without it the browser ignores the Set-Cookie and the session never starts. If the response isn't ok, I read the message that my backend sends (for example "Invalid credentials") and throw an error with it. In the hook, login has no try/catch on purpose, so the error goes up to the form, which is where it can be shown.

In the LoginPage I made a mistake that TypeScript didn't catch: I called useAuth() instead of useAuthContext(). useAuth creates a new, independent copy of the state, so the login was updating a copy that only existed in that page, and the rest of the app never found out. The rule I took from this is that only the AuthProvider calls useAuth, and everything else reads the context. The form uses e.preventDefault() so the page doesn't reload, a try/catch to show the error message, and navigates to /cars if the login succeeds.

For the registration I decided to log the user in automatically after signing up, for the user's convenience. registerRequest returns Promise<void>: the backend does return the created user, but I don't use it, because right after that I call login, which already returns the user and also sets the cookie. In the hook, register awaits registerRequest and then awaits login. At first I forgot the second await, and that meant the form considered the registration finished before the login ended, and if the login failed nobody would catch the error.

For the logout I created logoutRequest, a POST to /auth/logout with credentials so the cookie is sent and can be deleted. It doesn't read the body because the backend answers 204 with no content. In the hook, logout calls it and then does setUser(null), so the frontend also forgets the user. In the Header I show different things for the three states: nothing while loading (so "Log in" doesn't flash before we know), Log in and Sign up links when there's no user, and the user's name with a Log out button when there is one. Here I learned that <Navigate /> is a component that only works when it's rendered, so inside an event handler I have to use the useNavigate hook.

For the forms, I wrote the logic and Claude helped me with the styling so it matches the rest of the app. We also replaced the browser's native validation popup with our own validation, which shows the errors in red under each field. That validation is only for convenience: the real validation is still Zod in the backend, because anyone can skip the frontend with Postman. The downside is that the rules are duplicated, so if I change them in Zod I also have to change them in the frontend.

To protect the admin page I created a RequireAdmin component, used as a layout route that renders an <Outlet />. It works like the backend middlewares but in React, with early returns: while loading it shows a loading message, if there's no user it returns <Navigate to="/login" replace />, if the user isn't an ADMIN it redirects to /cars, and only if everything passes it renders the <Outlet />. The order matters: if I checked the user before loading, an admin who reloads /admin would be sent to the login page, because on the first render the user is still null. Here I use <Navigate /> and not navigate() because I'm returning JSX during the render, which is the opposite case from the Header. I also made two mistakes here: I wrote !user.role === "ADMIN", which compares a boolean with a string and is always false (TypeScript caught it, the right operator is !==), and I left "/signin" copied from an example, a route that doesn't exist in my app. This protected route is only for convenience: if it had a bug and a CUSTOMER reached the form, the backend would still answer 403.

For creating cars I realized that what the frontend sends isn't a Car. The Car type has the display values that toApiCar returns ("Sedan"), but the backend's Zod schema expects the Prisma enum values ("SEDAN"). So I created a separate CreateCarInput type, without the id, with the enums in uppercase (VehicleTypeValue, CategoryValue and GearboxValue, named differently so they don't get confused with the ones in Car.ts). Then I created createCarRequest, a POST to /cars with credentials so the cookie is sent. The first version had JSON.stringify({ car }), which wrapped the car inside another object, so Zod couldn't find any of the fields and always answered 400. It also threw "Error 400" instead of reading the message the backend sends.

It has one state object with the 12 fields as strings, because inputs always return strings, and a single handleChange that uses [e.target.name] to update the field that changed. When submitting, it converts the numbers with Number(), sends imageUrl as undefined if it's empty (Zod accepts the field not being there, but an empty string isn't a valid URL), and uses "as" for the enums, which is safe because those values can only come from the select options. It has the same kind of frontend validation as the other forms, with the same rules as the backend schema. If the car is created it shows a success message and resets the form, and the new car appears in /cars because CarsPage requests the list again every time it mounts. Finally, the Header shows an "Add car" link only when the user is an ADMIN, which again is just UI: the real protection is in the backend.

## After review corrections:

### 1. Admin seed with an email that already exists

**What was wrong:** if a customer registered with an email and then the admin seed was run with that same email, the script said the admin was created, but the account stayed a customer and its password was replaced.

**Why it happened:** the seed used an upsert, which only decides based on whether the email exists or not. It can't check the role before updating, so when the email existed it went straight to the update and replaced the passwordHash, without changing the role. And the log message was always the same, so the script said everything went fine even when it didn't.

**What I decided:** there are three cases. If the email doesn't exist, the admin is created. If it exists and is already an ADMIN, the password is updated with the one from the .env, because the .env is the source of truth for the admin and if someone changed ADMIN_PASSWORD it's because they want to rotate it. If it exists and is not an ADMIN, the script stops with an error and doesn't change anything, because promoting that account could give admin permissions to someone who registered with that email first, and changing its password would break that person's account.

**How I fixed it:** before the upsert I look for the user with findUnique, selecting only the role. If the user exists and its role is not ADMIN, I throw an error before touching the database. I check "not ADMIN" instead of "is CUSTOMER" so that if a new role is added in the future it's protected too. I also moved the argon2 hash after that check, so it's only calculated when it's going to be used, and the final log now says "created" or "updated" depending on whether the user existed. While fixing it I made a mistake worth writing down: I first wrote user?.role !== "ADMIN", but when the user doesn't exist that gives undefined !== "ADMIN", which is true, so the seed couldn't create the admin at all. The condition needs both parts: user && user.role !== "ADMIN".

### 2. Spaces around the email

**What was wrong:** the frontend form accepted an email with spaces around it, but the backend rejected it with a 400, both in signup and login. The two sides weren't consistent.

**Why it happened:** the order. Zod validated the email with z.email() first, and the normalization (toLowerCase and trim) happened afterwards, in the controller. So " myemail@mail.com " was rejected as an invalid email before the code could remove the spaces. Meanwhile, the frontend validation trims the email before checking it, so it let it through.

**How I fixed it:** I moved the normalization inside the Zod schemas, before the validation, using .pipe(). The email is first a string, then it's trimmed and lowercased, and only then the clean value is passed to z.email() to be validated. I did it in both schemas, register and login, so they behave the same. Since result.data.email now comes already normalized, I removed the normalizedEmail lines from the controllers, because normalizing twice would be dead code and could make someone think it's still needed. The frontend keeps sending the email as the user typed it, and that's fine: the backend is the one that has to clean it, because it can't trust that the frontend did.

### 3. Very large numbers in the car form and in car IDs

**What was wrong:** some very large numbers passed both the car form and the backend validation, but couldn't be saved in the database. For example, a price of 2147483648 gave a 500 error. Large car IDs in GET /cars/:id had the same problem.

**Why it happened:** the Int columns in Prisma are INTEGER in PostgreSQL, which uses 4 bytes, so the biggest value it can store is 2147483647. But z.int() in Zod only checks that the number is a safe integer in JavaScript, which goes much higher. So there was a gap: numbers between those two limits passed Zod and then the database rejected them. For the IDs, the regex only checked that the id had digits, without any limit on how many.

**What I decided:** I added realistic maximums to every number in the car schema, leaving some room for outliers: price per day up to 200000 (the most expensive car in the seed is 18900), up to 30 seats, up to 20 bags and 20 suitcases, and a minimum age between 18 and 50. Besides fixing the database error, these limits also catch typos, like an admin adding an extra zero to a price. For a car ID that is too big I return a 400 and not a 404, because the problem is that the id is badly formed, not that the car doesn't exist.

**How I fixed it:** in the backend I added a .max() to each number in the Zod schema, and in getCarById I check the id against a MAX_INT constant (2147483647) and return a 400 before calling the database. In the frontend I added the same limits to the admin form validation, so each field shows "X is required" if it's empty and "X must be between A and B" if it's out of range. Since the rules are duplicated, if I change a limit in Zod I also have to change it in the form.

### 4. When the backend is unavailable

**What was wrong:** with the backend down, refreshing the admin page sent me to the login page without telling me that the app couldn't check my account. Clicking Log out did nothing, with no error on the page.

**Why it happened:** my app had three session states: loading ("I don't know yet"), user is null ("I know there's no session") and user with data ("I know there is a session"). But there's a fourth case: "I couldn't find out". fetchMe already told them apart (it returns null on a 401 and throws on anything else), but the catch in useAuth did setUser(null) in both cases, so "the server is down" ended up looking exactly like "you're not logged in". RequireAdmin saw a null user and redirected to the login. For the logout, the hook let the error go up on purpose, but the Header didn't catch it, so nobody handled it.

**What I decided:** a failed check is not the same as having no session, so it needs its own state and its own message, plus a way to try again. When the logout fails, the user is still logged in (the cookie wasn't deleted), so I keep them logged in and show an error; trying again is just clicking Log out again.

**How I fixed it:**

- In useAuth I added an authError state. I moved the session check out of the useEffect into its own function, checkSession, so it can be called again from a "Try again" button. It clears the previous error and sets loading to true before checking, and in the catch it saves an error message. I wrapped it in useCallback so it's always the same function and can go in the useEffect dependencies without creating an infinite loop, the same as getCars in useCars. I added authError and checkSession to the context type.
- In RequireAdmin I added a check for authError after loading and before checking the user. If I put it after the user check, a null user would still redirect to the login before the error is seen. When there's an error it shows my ErrorMessage component with checkSession as the retry action.
- In the Header, handleLogout now has a try/catch: if the logout fails it saves a message in a logoutError state instead of letting the error go unhandled. Claude designed the red banner under the header that shows it, with a button to dismiss it.
