import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { app } from "../app.ts";
import { prisma } from "../db/prisma.ts";
import {
  createTestCar,
  createTestUser,
  loginAs,
  validCarData,
} from "./helpers.ts";

beforeEach(async () => {
  await prisma.car.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("GET /cars", () => {
  it("returns all the cars", async () => {
    await createTestCar();
    await createTestCar();

    const res = await request(app).get("/cars");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toMatchObject({
      brand: "Toyota",
      vehicleType: "Sedan",
    });
  });
});

describe("GET /cars/:id", () => {
  it("returns the car when it exists", async () => {
    const car = await createTestCar();

    const res = await request(app).get(`/cars/${car.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: car.id, brand: "Toyota" });
  });

  it("returns 404 when the car does not exist", async () => {
    const res = await request(app).get("/cars/999999");

    expect(res.status).toBe(404);
  });

  it("returns 400 with an id that is not a number", async () => {
    const res = await request(app).get("/cars/abc");

    expect(res.status).toBe(400);
  });

  it("returns 400 with an id bigger than the database limit", async () => {
    const res = await request(app).get("/cars/99999999999");

    expect(res.status).toBe(400);
  });
});

describe("POST /cars", () => {
  it("lets an admin create a car with valid data", async () => {
    const admin = await createTestUser("ADMIN");
    const agent = await loginAs(admin);

    const res = await agent.post("/cars").send(validCarData);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ brand: "Toyota", model: "Corolla" });
    expect(await prisma.car.count()).toBe(1);
  });

  it("returns 403 for a customer and does not create the car", async () => {
    const customer = await createTestUser("CUSTOMER");
    const agent = await loginAs(customer);

    const res = await agent.post("/cars").send(validCarData);

    expect(res.status).toBe(403);
    expect(await prisma.car.count()).toBe(0);
  });

  it("returns 401 without a session", async () => {
    const res = await request(app).post("/cars").send(validCarData);

    expect(res.status).toBe(401);
    expect(await prisma.car.count()).toBe(0);
  });

  it("returns 400 with invalid data", async () => {
    const admin = await createTestUser("ADMIN");
    const agent = await loginAs(admin);

    const res = await agent.post("/cars").send({ ...validCarData, year: 1800 });

    expect(res.status).toBe(400);
    expect(await prisma.car.count()).toBe(0);
  });
});
