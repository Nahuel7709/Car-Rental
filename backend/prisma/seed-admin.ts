import "dotenv/config";
import { prisma } from "../db/prisma.ts";
import argon2 from "argon2";
import { createUserSchema } from "../auth/authSchemas.ts";

async function createUser() {
  const userName = process.env.ADMIN_NAME;
  const userEmail = process.env.ADMIN_EMAIL;
  const userPassword = process.env.ADMIN_PASSWORD;

  if (!userName || !userEmail || !userPassword) {
    throw new Error("User seed is missing name, email or password variable");
  }

  const result = createUserSchema.safeParse({
    name: userName,
    email: userEmail,
    password: userPassword,
  });

  if (!result.success) {
    throw new Error(
      `Invalid ADMIN_* variables: ${result.error.issues[0].message}. Nothing was changed.`,
    );
  }

  const { name, email, password } = result.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  });

  if (user && user.role !== "ADMIN") {
    throw new Error("A user with this email already exists");
  }

  const hashPassword = await argon2.hash(password);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash: hashPassword },
    create: {
      email,
      name,
      passwordHash: hashPassword,
      role: "ADMIN",
    },
  });

  if (user === null) {
    console.log("Admin user created");
  } else {
    console.log("Admin user updated");
  }
}

createUser()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
