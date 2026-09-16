"use client";
import { useEffect } from "react";

export default function ThemeScript() {
  useEffect(() => {
    try {
      if (localStorage.getItem("senest-theme") === "dark") {
        document.documentElement.classList.add("dark");
      }
    } catch (e) {
      // ignore
    }
  }, []);
  return null;
}
