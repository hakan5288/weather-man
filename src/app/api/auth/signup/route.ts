import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";


export async function POST(request: Request) {
  try {
    const { email, password, confirmPassword, name } = await request.json();

    if (!email || !password || !name || !confirmPassword) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "An account already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
      path: "/",
    });

    return NextResponse.json({
      data: {
        access_token: token,
        user: { id: user.id, name: user.name, email: user.email },
      },
    });
  } catch (error) {
    return NextResponse.json({ message: "Sign Up failed" }, { status: 500 });
  }
}
