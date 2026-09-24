import "dotenv/config";
import { prisma } from "../db/prisma.ts";
import argon2 from "argon2";

async function createUser() {
  const userName = process.env.ADMIN_NAME;
  const userEmail = process.env.ADMIN_EMAIL;
  const userPassword = process.env.ADMIN_PASSWORD;

  if (!userName || !userEmail || !userPassword) {
    throw new Error("User seed is missing name, email or password variable");
  }

  const normalizedEmail = userEmail.toLowerCase().trim();

  const hashPassword = await argon2.hash(userPassword);

  await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: { passwordHash: hashPassword },
    create: {
      email: normalizedEmail,
      name: userName,
      passwordHash: hashPassword,
      role: "ADMIN",
    },
  });

  console.log(`Admin user has been seeded`);
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
