import { fetchCars } from "./api/cars";
import { Layout } from "./components/Layout";
import { Car } from "./interfaces/Car";
import { CarsPage } from "./pages/CarsPage";
import { useEffect, useState } from "react";

function App() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getCars() {
    try {
      setError(null);
      setLoading(true);
      const data = await fetchCars();
      setCars(data);
    } catch (error) {
      setError("Error trying to load the cars");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCars();
  }, []);

  return (
    <Layout>
      <CarsPage cars={cars} loading={loading} error={error} getCars={getCars} />
    </Layout>
  );
}

export default App;
