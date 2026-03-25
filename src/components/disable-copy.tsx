"use client";

import { useEffect } from "react";

export function DisableCopy() {
  useEffect(() => {
    function preventCopy(e: Event) {
      e.preventDefault();
    }

    document.addEventListener("copy", preventCopy);
    document.addEventListener("cut", preventCopy);
    document.addEventListener("paste", preventCopy);
    document.addEventListener("contextmenu", preventCopy);

    return () => {
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("cut", preventCopy);
      document.removeEventListener("paste", preventCopy);
      document.removeEventListener("contextmenu", preventCopy);
    };
  }, []);

  return null;
}
