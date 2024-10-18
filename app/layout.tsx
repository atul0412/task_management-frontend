"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/app/components/Sidebar";
import { usePathname } from "next/navigation";
import './styles/app.scss';
import './styles/globals.css';
import Header from "./components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Get the current route

  const shouldShowSidebar = pathname !== "/" && pathname !== "/register";

  return (
    <html lang="en">
      <body className="antialiased">
      { shouldShowSidebar && <Header /> }
        <div className="min-h-screen flex">
          {/* Sidebar only shows if the user is logged in and not on the login page */}
          {shouldShowSidebar && <Sidebar />}

          {/* Main content */}
          <main className={`flex-1 bg-gray-100`}>{children}</main>
        </div>
      </body>
    </html>
  );
}
