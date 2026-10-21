import "dotenv/config";
import { runSeed, seedUser } from "./seedUser.ts";

runSeed(() => seedUser("ADMIN", "ADMIN"));
