"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const footerLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/#experience", label: "Experience" },
  { href: "/#contact", label: "Contact" },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-[var(--border-light)] bg-[var(--bg-primary)] px-6 py-8 sm:px-8">
      <div className="mx-auto flex max-w-[1100px] flex-col items-center gap-5 md:flex-row md:justify-between">
        <nav className="flex flex-wrap justify-center gap-5">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[0.8rem] text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-[0.8rem] text-[var(--text-muted)]">
          © {new Date().getFullYear()} Josua Pane. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
