import argon2 from "argon2";
import { prisma } from "../db/prisma.ts";
import { createUserSchema } from "../auth/authSchemas.ts";
import type { Role } from "../generated/prisma/enums.ts";

/**
 * Creates or updates a user from environment variables.
 * The variables are read with a prefix: ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD,
 * or CUSTOMER_NAME, CUSTOMER_EMAIL, CUSTOMER_PASSWORD.
 * It is safe to run more than once: if the user exists, only the password is updated.
 */
export async function seedUser(role: Role, envPrefix: string) {
  const userName = process.env[`${envPrefix}_NAME`];
  const userEmail = process.env[`${envPrefix}_EMAIL`];
  const userPassword = process.env[`${envPrefix}_PASSWORD`];

  if (!userName || !userEmail || !userPassword) {
    throw new Error(
      `User seed is missing ${envPrefix}_NAME, ${envPrefix}_EMAIL or ${envPrefix}_PASSWORD`,
    );
  }

  const result = createUserSchema.safeParse({
    name: userName,
    email: userEmail,
    password: userPassword,
  });

  if (!result.success) {
    throw new Error(
      `Invalid ${envPrefix}_* variables: ${result.error.issues[0].message}. Nothing was changed.`,
    );
  }

  const { name, email, password } = result.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  });

  if (user && user.role !== role) {
    throw new Error(
      `A user with this email already exists with the ${user.role} role`,
    );
  }

  const passwordHash = await argon2.hash(password);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, name, passwordHash, role },
  });

  const label = role === "ADMIN" ? "Admin" : "Customer";
  console.log(user === null ? `${label} user created` : `${label} user updated`);
}

/** Runs a seed and always disconnects Prisma, also when it fails. */
export function runSeed(seed: () => Promise<void>) {
  seed()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
