import { Navigate, Route, Routes } from "react-router";
import { Layout } from "./components/Layout";
import { CarsProvider } from "./context/cars";
import { CarsPage } from "./pages/CarsPage";
import { CarDetailsPage } from "./pages/CarDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";
import { AuthProvider } from "./context/auth";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { RequireAdmin } from "./components/RequireAdmin";
import { AdminPage } from "./pages/AdminPage";

function App() {
  return (
    <AuthProvider>
      <CarsProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to={"/cars"} replace />} />
            <Route path="/cars" element={<CarsPage />} />
            <Route path="/cars/:id" element={<CarDetailsPage />} />
            <Route path="/*" element={<NotFoundPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<RequireAdmin />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>
        </Routes>
      </CarsProvider>
    </AuthProvider>
  );
}

export default App;
