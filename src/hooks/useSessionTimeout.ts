"use client";

import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

export function useSessionTimeout(timeoutMinutes: number) {
  useEffect(() => {
    const timer = setTimeout(() => {
      signOut(auth);
    }, timeoutMinutes * 60 * 1000);

    return () => clearTimeout(timer);
  }, [timeoutMinutes]);
}
