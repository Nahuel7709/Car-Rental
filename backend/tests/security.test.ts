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
