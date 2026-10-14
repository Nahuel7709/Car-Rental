import request from "supertest";
import argon2 from "argon2";
import { app } from "../app.ts";
import { prisma } from "../db/prisma.ts";

const TEST_PASSWORD = "securepassword3324";

export async function createTestUser(role: "ADMIN" | "CUSTOMER") {
  const email = `${role.toLowerCase()}@mail.com`;
  const passwordHash = await argon2.hash(TEST_PASSWORD);

  await prisma.user.create({
    data: {
      name: role === "ADMIN" ? "Admin" : "Customer",
      email,
      passwordHash,
      role,
    },
  });

  return { email, password: TEST_PASSWORD };
}

export async function loginAs(credentials: {
  email: string;
  password: string;
}) {
  const agent = request.agent(app);
  await agent.post("/auth/login").send(credentials);
  return agent;
}
