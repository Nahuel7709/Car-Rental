import { CarList } from "./components/CarList";
import { Layout } from "./components/Layout";
import { cars } from "./data/cars";

function App() {
  return (
    <Layout>
      <CarList cars={cars}/>
    </Layout>
  );
}

export default App;
