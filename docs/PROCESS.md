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
