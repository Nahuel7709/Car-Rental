import { Navigate, Route, Routes } from "react-router";
import { Layout } from "./components/Layout";
import { CarsProvider } from "./context/cars";
import { CarsPage } from "./pages/CarsPage";
import { CarDetailsPage } from "./pages/CarDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <CarsProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to={"/cars"} replace />} />
          <Route path="/cars" element={<CarsPage />} />
          <Route path="/cars/:id" element={<CarDetailsPage />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </CarsProvider>
  );
}

export default App;
