import { Layout } from "./components/Layout";
import { CarsProvider } from "./context/cars";
import { CarsPage } from "./pages/CarsPage";

function App() {
  return (
    <Layout>
      <CarsProvider>
        <CarsPage />
      </CarsProvider>
    </Layout>
  );
}

export default App;
