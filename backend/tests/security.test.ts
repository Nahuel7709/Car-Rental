import { describe, expect, it, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { app } from "../app.ts";
import { prisma } from "../db/prisma.ts";
import { createTestUser, loginAs } from "./helpers.ts";

beforeEach(async () => {
  await prisma.booking.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Body size limit", () => {
  it("returns 413 when the body is too large", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "a".repeat(11 * 1024), password: "x" });
    expect(res.status).toBe(413);
    expect(res.body).toMatchObject({ message: "Request body too large" });
  });
});

describe("Security headers", () => {
  it("adds helmet headers and hides X-Powered-By", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.headers["x-powered-by"]).toBeUndefined();
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    expect(res.headers["strict-transport-security"]).toBeDefined();
  });
});

describe("Login rate limit", () => {
  it("returns 429 after 10 failed logins from the same IP", async () => {
    for (let i = 0; i < 10; i++) {
      const res = await request(app)
        .post("/auth/login")
        .send({ email: `user${i}@mail.com`, password: "wrong-password" });
      expect(res.status).toBe(401);
    }

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "another@mail.com", password: "wrong-password" });

    expect(res.status).toBe(429);
    expect(res.body).toMatchObject({
      message: "Too many login attempts, please try again later",
    });
    expect(res.headers["retry-after"]).toBeDefined();
  });

  it("does not count successful logins", async () => {
    const customer = await createTestUser("CUSTOMER");

    for (let i = 0; i < 12; i++) {
      const res = await request(app).post("/auth/login").send(customer);
      expect(res.status).toBe(200);
    }
  });
});

describe("Register rate limit", () => {
  it("returns 429 after 5 registrations from the same IP", async () => {
    for (let i = 0; i < 5; i++) {
      const res = await request(app)
        .post("/auth/register")
        .send({ name: "User", email: `new${i}@mail.com`, password: "securepassword123" });
      expect(res.status).toBe(201);
    }

    const res = await request(app)
      .post("/auth/register")
      .send({ name: "User", email: "new5@mail.com", password: "securepassword123" });

    expect(res.status).toBe(429);
    expect(res.body).toMatchObject({
      message: "Too many accounts created, please try again later",
    });
  });
});

describe("Bookings rate limit", () => {
  it("limits booking attempts per user, not per IP", async () => {
    const customer = await loginAs(await createTestUser("CUSTOMER"));
    const other = await loginAs(await createTestUser("CUSTOMER", "other@mail.com"));

    // Invalid bodies are enough: every attempt counts, valid or not
    for (let i = 0; i < 20; i++) {
      const res = await customer.post("/bookings").send({});
      expect(res.status).toBe(400);
    }

    const blocked = await customer.post("/bookings").send({});
    expect(blocked.status).toBe(429);

    // Same IP, different user: not blocked
    const allowed = await other.post("/bookings").send({});
    expect(allowed.status).toBe(400);
  });
});
