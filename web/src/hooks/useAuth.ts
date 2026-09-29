import { useState, useEffect } from "react";
import { User } from "../interfaces/User";
import {
  fetchMe,
  loginRequest,
  logoutRequest,
  registerRequest,
} from "../api/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function login(email: string, password: string) {
    const loggedUser = await loginRequest(email, password);
    setUser(loggedUser);
  }

  async function register(name: string, email: string, password: string) {
    await registerRequest(name, email, password);
    await login(email, password);
  }

  async function logout() {
    await logoutRequest();
    setUser(null);
  }

  useEffect(() => {
    async function getUser() {
      try {
        const data = await fetchMe();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    getUser();
  }, []);
  return { user, loading, login, register, logout };
}
