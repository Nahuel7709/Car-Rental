import { User } from "../interfaces/User";

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchMe(): Promise<User | null> {
  const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });

  if (res.status === 401) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Error ${res.status}`);
  }

  const data = await res.json();

  return data;
}

export async function loginRequest(
  email: string,
  password: string,
): Promise<User> {
  const res = await fetch(`${API_URL}/auth/login`, {
    credentials: "include",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message);
  }
  const user = await res.json();
  return user;
}

export async function registerRequest(
  name: string,
  email: string,
  password: string,
): Promise<void> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message);
  }
}

export async function logoutRequest(): Promise<void> {
  const res = await fetch(`${API_URL}/auth/logout`, {
    credentials: "include",
    method: "POST",
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message);
  }
}
