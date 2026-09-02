import { Layout } from "./components/Layout";
import { cars } from "./data/cars";
import { CarsPage } from "./pages/CarsPage";

function App() {
  return (
    <Layout>
      <CarsPage cars={cars} />
    </Layout>
  );
}

export default App;
