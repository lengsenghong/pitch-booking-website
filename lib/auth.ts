import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

// Simple password hashing (in production, use bcrypt)
export function hashPassword(password: string): string {
  // This is a simple hash for demo purposes
  // In production, use bcrypt or similar
  return Buffer.from(password + "fieldplay_salt").toString("base64");
}

export function verifyPassword(
  password: string,
  hashedPassword: string
): boolean {
  return hashPassword(password) === hashedPassword;
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return null;
    }

    if (verifyPassword(password, user.password)) {
      return user;
    }

    return null;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

export async function createUser(userData: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: "USER" | "OWNER" | "ADMIN";
  phone?: string;
}) {
  const hashedPassword = hashPassword(userData.password);

  return await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
      verified: true, // Auto-verify for demo
    },
  });
}
