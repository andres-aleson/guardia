"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`bg-surface fixed top-0 z-50 w-full transition-shadow ${
        scrolled ? "shadow-sm" : "border-outline-variant border-b"
      }`}
    >
      <nav className="max-w-container-max mx-auto flex w-full items-center justify-between px-margin-desktop py-4">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-primary text-[28px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            shield_with_heart
          </span>
          <span className="font-headline-md text-headline-md text-primary font-bold">
            Guardia
          </span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <a
            className="font-label-md text-label-md text-primary border-primary border-b-2 pb-1 font-bold"
            href="#"
          >
            How it Works
          </a>
          <a
            className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            Security Tips
          </a>
          <a
            className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            Support
          </a>
        </div>
        <Link
          href="/check"
          className="bg-primary text-on-primary hover:bg-primary-container soft-shadow rounded-full px-6 py-2.5 font-label-md text-label-md transition-all duration-150 ease-in-out active:scale-95"
        >
          Check Message
        </Link>
      </nav>
    </header>
  );
}
