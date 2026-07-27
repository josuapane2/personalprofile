"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PublicMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    const hash = window.location.hash;
    if (!isAdmin && hash.includes("type=recovery")) {
      window.location.replace(`/admin/login${hash}`);
    }
  }, [isAdmin]);

  return (
    <main className={`flex-1 ${isAdmin ? "" : "pt-[72px]"}`}>{children}</main>
  );
}
