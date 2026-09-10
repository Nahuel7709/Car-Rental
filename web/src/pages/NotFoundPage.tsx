import { Link } from "react-router";
import { buttonClass } from "../ui/buttonStyles";

const NotFoundPage = () => {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-20 text-center">
      <p className="text-6xl font-black tracking-tight text-brand-600">404</p>

      <h2 className="mt-4 text-xl font-bold text-ink-900">
        This page does not exist
      </h2>

      <p className="mt-2 text-sm text-ink-500">
        Check the address bar, or go back to the car list.
      </p>

      <Link to="/cars" className={buttonClass("primary", "mt-6")}>
        Go back
      </Link>
    </div>
  );
};

export default NotFoundPage;
