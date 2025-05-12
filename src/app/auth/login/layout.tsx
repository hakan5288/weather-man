import { Metadata } from "next"
import React from "react"


export const metadata: Metadata = {
  title: "Weather App | Login",
  description: "Login to your account",
  keywords: ["login", "authentication", "access"],
  openGraph: {
    title: "Login",
    description: "Login to your account",
    url: "/auth/login",
    type: "website",
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Left side - Shadcn-like section */}
      <div className="hidden bg-muted p-10 md:flex md:flex-col md:justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 rounded-full bg-primary" />
          <span className="text-xl font-bold">Weather Man</span>
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">
            Login to your account to access your dashboard and get to know your weather data.
          </p>
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-gray-200" />
            <div>
              <p className="font-medium">Hassan Sheikh</p>
              <p className="text-sm text-muted-foreground">CTO, Weather App</p>
            </div>
          </div>
          <blockquote className="border-l-2 pl-4 italic">
            "This platform has transformed how we manage our projects. Highly recommended!"
          </blockquote>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Weather Man Inc. All rights reserved.
        </p>
      </div>

      {/* Right side - Form */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="mx-auto w-full max-w-md space-y-6">
          {children}
        </div>
      </div>
    </div>
  )
}
