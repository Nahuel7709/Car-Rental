import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../app.ts";
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