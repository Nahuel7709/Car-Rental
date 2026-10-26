import { beforeEach } from "vitest";
import { config } from "dotenv";
import { rateLimitStores } from "../middlewares/rateLimiters.ts";

config({ path: ".env.test" });

if (!process.env.DATABASE_URL?.includes("car_rental_test")) {
  throw new Error("Tests must run against the test database. Check .env.test");
}

// Every test starts with empty rate limit counters, with the same limits as production.
beforeEach(() => {
  for (const store of Object.values(rateLimitStores)) {
    store.resetAll();
  }
});
