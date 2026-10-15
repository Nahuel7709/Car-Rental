import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthContext } from "../context/auth";
import { Button } from "../ui/Button";
import { FormAlert } from "../ui/FormAlert";
import { FormField } from "../ui/FormField";

type RegisterFieldErrors = {
  name?: string;
  email?: string;
  password?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegister(
  name: string,
  email: string,
  password: string,
): RegisterFieldErrors {
  const errors: RegisterFieldErrors = {};
  if (name.trim() === "") {
    errors.name = "Name is required";
  } else if (name.trim().length < 3) {
    errors.name = "Name has a minimum of 3 characters";
  }
  if (email.trim() === "") {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = "Enter a valid email";
  }
  if (password === "") {
    errors.password = "Password is required";
  } else if (password.length < 8 || password.length > 64) {
    errors.password = "Password must be between 8 and 64 characters";
  }
  return errors;
}

export const RegisterPage = () => {
  const navigate = useNavigate();

  const { register } = useAuthContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const errors = validateRegister(name, email, password);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      await register(name, email, password);
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
          Create your account
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Sign up to start renting cars.
        </p>

        {error && <FormAlert message={error} />}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 flex flex-col gap-4"
        >
          <FormField
            id="name"
            label="Name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={name}
            error={fieldErrors.name}
            disabled={submitting}
            onChange={(e) => {
              setName(e.target.value);
              setFieldErrors((prev) => ({ ...prev, name: undefined }));
            }}
          />

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
            autoComplete="new-password"
            placeholder="Your password"
            hint="Between 8 and 64 characters."
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
            {submitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-brand-700 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};
