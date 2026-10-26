import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../app.ts";
describe("GET /health", () => {
  it("responds 200 OK", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: "ok" });
  });
});
