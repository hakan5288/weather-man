import type React from "react";
import AppSidebar from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";
import Header from "@/components/header";
import { UserProvider } from "@/context/user-context";

export const metadata: Metadata = {
  title: "Weather App | Dashboard",
  description: "Weather App",
};

export default function LayoutWithSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className=" w-full h-screen overflow-y-auto">
          <Header />
          <div className=" p-5">{children}</div>
        </main>
      </SidebarProvider>
    </UserProvider>
  );
}
