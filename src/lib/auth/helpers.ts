import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getUserByEmail(email: string) {
  return db.user.findUnique({
    where: { email },
    include: {
      staff: {
        include: {
          services: {
            include: {
              service: true,
            },
          },
          schedules: true,
        },
      },
      client: true,
    },
  });
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  role: "ADMIN" | "STAFF" | "CLIENT" = "CLIENT"
) {
  const passwordHash = await hashPassword(password);

  return db.user.create({
    data: {
      email,
      passwordHash,
      name,
      role,
    },
  });
}
