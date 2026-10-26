import { Router } from "express";
import { login, logout, me, register } from "./authController.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";
import { loginLimiter, registerLimiter } from "../middlewares/rateLimiters.ts";

export const authRouter = Router();

//Register
authRouter.post("/register", registerLimiter, register);

//Login
authRouter.post("/login", loginLimiter, login);

authRouter.get("/me", authMiddleware, me);

authRouter.post("/logout", logout);
