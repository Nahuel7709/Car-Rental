import { describe, it, expect, beforeEach, afterAll } from "vitest";
import request from "supertest";
import { app } from "../app.ts";
import { prisma } from "../db/prisma.ts";
import { todayInBuenosAires } from "../bookings/dates.ts";
import { createTestCar, createTestUser, loginAs } from "./helpers.ts";

// Dates relative to today, so the tests never become "in the past"
function daysFromToday(days: number) {
  const date = new Date(todayInBuenosAires());
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

async function loggedInCustomer(email = "customer@mail.com") {
  const credentials = await createTestUser("CUSTOMER", email);
  return loginAs(credentials);
}

async function userIdByEmail(email: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { email } });
  return user.id;
}

beforeEach(async () => {
  await prisma.booking.deleteMany();
  await prisma.car.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("POST /bookings", () => {
  it("creates a booking with the price calculated by the server", async () => {
    const car = await createTestCar();
    const customer = await loggedInCustomer();

    const res = await customer.post("/bookings").send({
      carId: car.id,
      startDate: daysFromToday(10),
      endDate: daysFromToday(15),
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      status: "CONFIRMED",
      totalPrice: 5 * car.pricePerDay,
      startDate: daysFromToday(10),
      endDate: daysFromToday(15),
      car: { id: car.id, brand: "Toyota", model: "Corolla" },
    });
    expect(res.body).not.toHaveProperty("userId");
  });

  it("returns 401 without a session", async () => {
    const car = await createTestCar();

    const res = await request(app)
      .post("/bookings")
      .send({
        carId: car.id,
        startDate: daysFromToday(10),
        endDate: daysFromToday(15),
      });

    expect(res.status).toBe(401);
  });

  it("ignores totalPrice and userId sent in the body", async () => {
    const car = await createTestCar();
    const customer = await loggedInCustomer();
    await createTestUser("CUSTOMER", "other@mail.com");
    const otherUserId = await userIdByEmail("other@mail.com");

    const res = await customer.post("/bookings").send({
      carId: car.id,
      startDate: daysFromToday(10),
      endDate: daysFromToday(15),
      totalPrice: 1,
      userId: otherUserId,
    });

    expect(res.status).toBe(201);
    expect(res.body.totalPrice).toBe(5 * car.pricePerDay);
    const saved = await prisma.booking.findUniqueOrThrow({
      where: { id: res.body.id },
    });
    expect(saved.userId).toBe(await userIdByEmail("customer@mail.com"));
  });

  it("returns 400 when the end date is the same as the start date", async () => {
    const car = await createTestCar();
    const customer = await loggedInCustomer();

    const res = await customer.post("/bookings").send({
      carId: car.id,
      startDate: daysFromToday(10),
      endDate: daysFromToday(10),
    });

    expect(res.status).toBe(400);
  });

  it("returns 400 when the start date is in the past", async () => {
    const car = await createTestCar();
    const customer = await loggedInCustomer();

    const res = await customer.post("/bookings").send({
      carId: car.id,
      startDate: daysFromToday(-1),
      endDate: daysFromToday(3),
    });

    expect(res.status).toBe(400);
  });

  it("returns 404 when the car does not exist", async () => {
    const customer = await loggedInCustomer();

    const res = await customer.post("/bookings").send({
      carId: "00000000-0000-7000-8000-000000000000",
      startDate: daysFromToday(10),
      endDate: daysFromToday(15),
    });

    expect(res.status).toBe(404);
  });

  it("returns 409 when the dates overlap a confirmed booking", async () => {
    const car = await createTestCar();
    const customer = await loggedInCustomer();
    await customer.post("/bookings").send({
      carId: car.id,
      startDate: daysFromToday(10),
      endDate: daysFromToday(15),
    });

    const res = await customer.post("/bookings").send({
      carId: car.id,
      startDate: daysFromToday(12),
      endDate: daysFromToday(20),
    });

    expect(res.status).toBe(409);
  });

  it("allows a booking that starts the day another one ends", async () => {
    const car = await createTestCar();
    const customer = await loggedInCustomer();
    await customer.post("/bookings").send({
      carId: car.id,
      startDate: daysFromToday(10),
      endDate: daysFromToday(15),
    });

    const res = await customer.post("/bookings").send({
      carId: car.id,
      startDate: daysFromToday(15),
      endDate: daysFromToday(18),
    });

    expect(res.status).toBe(201);
  });

  it("allows booking the same dates again after a cancellation", async () => {
    const car = await createTestCar();
    const customer = await loggedInCustomer();
    const dates = {
      carId: car.id,
      startDate: daysFromToday(10),
      endDate: daysFromToday(15),
    };
    const first = await customer.post("/bookings").send(dates);
    await customer.patch(`/bookings/${first.body.id}/cancel`);

    const res = await customer.post("/bookings").send(dates);

    expect(res.status).toBe(201);
  });

  it("lets only one of two simultaneous requests for the same dates succeed", async () => {
    const car = await createTestCar();
    const ana = await loggedInCustomer("ana@mail.com");
    const juan = await loggedInCustomer("juan@mail.com");
    const dates = {
      carId: car.id,
      startDate: daysFromToday(10),
      endDate: daysFromToday(15),
    };

    const responses = await Promise.all([
      ana.post("/bookings").send(dates),
      juan.post("/bookings").send(dates),
    ]);

    const statuses = responses.map((res) => res.status).sort();
    expect(statuses).toEqual([201, 409]);
    expect(await prisma.booking.count()).toBe(1);
  });
});

describe("GET /bookings", () => {
  it("shows a customer only their own bookings, and the admin all of them", async () => {
    const car = await createTestCar();
    const ana = await loggedInCustomer("ana@mail.com");
    const juan = await loggedInCustomer("juan@mail.com");
    const admin = await loginAs(await createTestUser("ADMIN"));
    await ana.post("/bookings").send({
      carId: car.id,
      startDate: daysFromToday(1),
      endDate: daysFromToday(3),
    });
    await juan.post("/bookings").send({
      carId: car.id,
      startDate: daysFromToday(5),
      endDate: daysFromToday(7),
    });

    const anaRes = await ana.get("/bookings");
    const adminRes = await admin.get("/bookings");

    expect(anaRes.status).toBe(200);
    expect(anaRes.body).toHaveLength(1);
    expect(anaRes.body[0].startDate).toBe(daysFromToday(1));
    expect(adminRes.status).toBe(200);
    expect(adminRes.body).toHaveLength(2);
  });
});

describe("GET /bookings/:id", () => {
  it("returns the booking to its owner and 404 to another customer", async () => {
    const car = await createTestCar();
    const ana = await loggedInCustomer("ana@mail.com");
    const juan = await loggedInCustomer("juan@mail.com");
    const created = await ana.post("/bookings").send({
      carId: car.id,
      startDate: daysFromToday(10),
      endDate: daysFromToday(15),
    });

    const ownerRes = await ana.get(`/bookings/${created.body.id}`);
    const otherRes = await juan.get(`/bookings/${created.body.id}`);

    expect(ownerRes.status).toBe(200);
    expect(ownerRes.body.id).toBe(created.body.id);
    expect(otherRes.status).toBe(404);
  });
});

describe("PATCH /bookings/:id/cancel", () => {
  it("returns 404 when cancelling another customer's booking", async () => {
    const car = await createTestCar();
    const ana = await loggedInCustomer("ana@mail.com");
    const juan = await loggedInCustomer("juan@mail.com");
    const created = await ana.post("/bookings").send({
      carId: car.id,
      startDate: daysFromToday(10),
      endDate: daysFromToday(15),
    });

    const res = await juan.patch(`/bookings/${created.body.id}/cancel`);

    expect(res.status).toBe(404);
    const saved = await prisma.booking.findUniqueOrThrow({
      where: { id: created.body.id },
    });
    expect(saved.status).toBe("CONFIRMED");
  });

  it("returns 409 when cancelling a booking twice", async () => {
    const car = await createTestCar();
    const customer = await loggedInCustomer();
    const created = await customer.post("/bookings").send({
      carId: car.id,
      startDate: daysFromToday(10),
      endDate: daysFromToday(15),
    });
    const first = await customer.patch(`/bookings/${created.body.id}/cancel`);

    const res = await customer.patch(`/bookings/${created.body.id}/cancel`);

    expect(first.status).toBe(200);
    expect(first.body.status).toBe("CANCELLED");
    expect(res.status).toBe(409);
  });

  it("returns 409 when the booking already started", async () => {
    const car = await createTestCar();
    const customer = await loggedInCustomer();
    // Created directly in the database, because the API does not allow past dates
    const booking = await prisma.booking.create({
      data: {
        userId: await userIdByEmail("customer@mail.com"),
        carId: car.id,
        startDate: new Date(daysFromToday(-2)),
        endDate: new Date(daysFromToday(3)),
        totalPrice: 5 * car.pricePerDay,
      },
    });

    const res = await customer.patch(`/bookings/${booking.id}/cancel`);

    expect(res.status).toBe(409);
  });
});
