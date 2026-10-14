import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { app } from "../app.ts";
import { prisma } from "../db/prisma.ts";

beforeEach(async () => {
  await prisma.user.deleteMany();
});
afterAll(async () => {
  await prisma.$disconnect();
});

describe("GET /auth/me", () => {
  it("returns 401 without cookie", async () => {
    const res = await request(app).get("/auth/me");
    expect(res.status).toBe(401);
  });
});

describe("POST /auth/register", () => {
  it("creates a CUSTOMER with valid data", async () => {
    const user = {
      name: "Ana",
      email: "ana@mail.com",
      password: "securepassword3324",
    };
    const res = await request(app).post("/auth/register").send(user);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      name: "Ana",
      email: "ana@mail.com",
      role: "CUSTOMER",
    });
    expect(res.body).not.toHaveProperty("passwordHash");
  });
});
