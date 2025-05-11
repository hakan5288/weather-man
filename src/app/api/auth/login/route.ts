import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import prisma from "@/prisma";



export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "37f494fc27bb48398599edb2a2893a4c8077a6c49451dfb450192d47a907ec878b9",
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
  } catch (e) {}
}
