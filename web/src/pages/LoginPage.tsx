import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthContext } from "../context/auth";
import { Button } from "../ui/Button";
import { FormAlert } from "../ui/FormAlert";
import { FormField } from "../ui/FormField";

type LoginFieldErrors = {
  email?: string;
  password?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateLogin(email: string, password: string): LoginFieldErrors {
  const errors: LoginFieldErrors = {};
  if (email.trim() === "") {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = "Enter a valid email";
  }
  if (password === "") {
    errors.password = "Password is required";
  }
  return errors;
}

export const LoginPage = () => {
  const navigate = useNavigate();

  const { login } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const errors = validateLogin(email, password);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/cars");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md py-10">
      <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-ink-900">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Log in to your account to continue.
        </p>

        {error && <FormAlert message={error} />}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 flex flex-col gap-4"
        >
          <FormField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="example@gmail.com"
            value={email}
            error={fieldErrors.email}
            disabled={submitting}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors((prev) => ({ ...prev, email: undefined }));
            }}
          />

          <FormField
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            error={fieldErrors.password}
            disabled={submitting}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldErrors((prev) => ({ ...prev, password: undefined }));
            }}
          />

          <Button
            type="submit"
            disabled={submitting}
            className="mt-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Log in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-brand-700 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
