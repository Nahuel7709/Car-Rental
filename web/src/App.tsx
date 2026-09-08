import { Layout } from "./components/Layout";
import { CarsProvider } from "./context/CarsContext";
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
