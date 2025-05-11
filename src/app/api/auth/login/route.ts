import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import prisma from "@/lib/prisma";


   export async function POST(request: Request) {
     try {
       // Parse JSON safely
       let body;
       try {
         body = await request.json();
       } catch (jsonError) {
         return NextResponse.json(
           { message: "Invalid JSON input" },
           { status: 400 }
         );
       }

       const { email, password } = body;
       if (!email || !password) {
         return NextResponse.json(
           { message: "Email and password are required" },
           { status: 400 }
         );
       }

       // Find user
       const user = await prisma.user.findUnique({
         where: { email },
       });

       if (!user || !(await bcrypt.compare(password, user.password))) {
         return NextResponse.json(
           { message: "Invalid credentials" },
           { status: 401 }
         );
       }

       // Validate JWT_SECRET
       if (!process.env.JWT_SECRET) {
         throw new Error("JWT_SECRET is not defined");
       }

       // Generate JWT
       const token = jwt.sign(
         { userId: user.id, email: user.email },
         process.env.JWT_SECRET,
         { expiresIn: "1h" }
       );

       // Set cookie
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
     } catch (error: any) {
       console.error("Login API Error:", error.message, error.stack);
       return NextResponse.json(
         {
           message: "Internal Server Error",
           error: error.message,
           stack: error.stack, // Include stack trace for debugging
         },
         { status: 500 }
       );
     }
   }
