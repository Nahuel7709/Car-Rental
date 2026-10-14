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

  it("returns 200 with the user data when logged in", async () => {
    const user = {
      name: "Ana",
      email: "ana@mail.com",
      password: "securepassword3324",
    };
    await request(app).post("/auth/register").send(user);

    const agent = request.agent(app);
    await agent
      .post("/auth/login")
      .send({ email: user.email, password: user.password });
    const res = await agent.get("/auth/me");

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      name: "Ana",
      email: "ana@mail.com",
      role: "CUSTOMER",
    });
    expect(res.body).not.toHaveProperty("passwordHash");
  });

  it("returns 401 with a modified token", async () => {
    const user = {
      name: "Ana",
      email: "ana@mail.com",
      password: "securepassword3324",
    };
    await request(app).post("/auth/register").send(user);

    const login = await request(app)
      .post("/auth/login")
      .send({ email: user.email, password: user.password });
    const cookie = login.headers["set-cookie"][0];
    const token = cookie.split(";")[0];
    const modifiedToken = token + "x";
    const res = await request(app).get("/auth/me").set("Cookie", modifiedToken);

    expect(res.status).toBe(401);
  });

  it("returns 401 after logout", async () => {
    const user = {
      name: "Ana",
      email: "ana@mail.com",
      password: "securepassword3324",
    };
    await request(app).post("/auth/register").send(user);

    const agent = request.agent(app);
    await agent
      .post("/auth/login")
      .send({ email: user.email, password: user.password });

    await agent.post("/auth/logout");

    const res = await agent.get("/auth/me");

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

  it("ignores the role sent in the body", async () => {
    const user = {
      name: "Ana",
      email: "ana@mail.com",
      password: "securepassword3324",
      role: "ADMIN",
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

  it("returns 409 if the email is already used, with different case", async () => {
    const user = {
      name: "Ana",
      email: "ana@mail.com",
      password: "securepassword3324",
    };
    const user2 = {
      name: "Ana",
      email: "ANA@mail.com",
      password: "securepassword3324",
    };
    await request(app).post("/auth/register").send(user);
    const res = await request(app).post("/auth/register").send(user2);

    expect(res.status).toBe(409);
  });

  it("returns 400 with invalid data", async () => {
    const user = {
      name: "Ana",
      email: "ana",
      password: "securepassword3324",
    };
    const res = await request(app).post("/auth/register").send(user);

    expect(res.status).toBe(400);
  });
});

describe("POST /auth/login", () => {
  it("returns 200 and an httpOnly cookie with valid credentials", async () => {
    const user = {
      name: "Ana",
      email: "ana@mail.com",
      password: "securepassword3324",
    };
    await request(app).post("/auth/register").send(user);

    const res = await request(app)
      .post("/auth/login")
      .send({ email: user.email, password: user.password });

    expect(res.status).toBe(200);
    const cookie = res.headers["set-cookie"][0];
    expect(cookie).toContain("token=");
    expect(cookie).toContain("HttpOnly");
  });

  it("“returns 401 with a wrong password", async () => {
    const user = {
      name: "Ana",
      email: "ana@mail.com",
      password: "securepassword3324",
    };
    await request(app).post("/auth/register").send(user);

    const res = await request(app)
      .post("/auth/login")
      .send({ email: user.email, password: "anotherpassword" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("returns the same 401 for an email that does not exist", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "anotheremail@mail.com", password: "password123" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });
});
