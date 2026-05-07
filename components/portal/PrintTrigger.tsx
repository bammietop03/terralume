"use client";

import { useEffect } from "react";

export default function PrintTrigger() {
  useEffect(() => {
    // Small delay so the page renders completely before the print dialog opens
    const timer = setTimeout(() => window.print(), 500);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
