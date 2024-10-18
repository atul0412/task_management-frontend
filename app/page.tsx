"use client";

import LoginForm from "@/app/components/LoginForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getSecureJsonValueFromLocalStorage } from "./Services/core.services";
import { GetUIcookie } from "./utils/utils";



export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = getSecureJsonValueFromLocalStorage("user");
    const isAuthenticated = GetUIcookie('isAuthenticated')
    const token = user?.token; 

    if (token && isAuthenticated) {
      router.push("/dashboard"); 
    }
  }, [router]);
  return <LoginForm />;
}
