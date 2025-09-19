import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, userType } =
      await request.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Create new user
    const user = await createUser({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role:
        userType === "owner"
          ? "OWNER"
          : userType === "admin"
          ? "ADMIN"
          : "USER",
    });

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
