import { config } from "dotenv";

config({ path: ".env.test" });

if (!process.env.DATABASE_URL?.includes("car_rental_test")) {
  throw new Error("Tests must run against the test database. Check .env.test");
}
