"use client";

import { useEffect, useState } from "react";
import { navItems } from "@/components/sections/content";

type SiteHeaderProps = {
  mode?: "home" | "blog";
};

export default function SiteHeader({ mode = "home" }: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const getHref = (id: string) => (mode === "home" ? `#${id}` : `/#${id}`);

  return (
    <header className={`site-header ${isScrolled ? "is-scrolled" : ""} ${mode === "blog" ? "is-blog-mode" : ""}`.trim()}>
      <a className="brand-mark" href={mode === "home" ? "#home" : "/#home"} aria-label="BOSTON Home">
        <span>BOSTON</span>
        <small>GANGNAM</small>
      </a>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a key={item.id} href={getHref(item.id)}>
            {item.label}
          </a>
        ))}
        <a className={mode === "blog" ? "is-active" : ""} href="/blog">
          Blog
        </a>
      </nav>

      <a className="header-call" href="tel:010-8288-8854">
        예약문의
      </a>

      <button
        className="menu-toggle"
        type="button"
        aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        <span />
        <span />
      </button>

      <div className={`mobile-drawer ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
        <nav aria-label="Mobile navigation">
          {navItems.map((item) => (
            <a key={item.id} href={getHref(item.id)} onClick={() => setIsOpen(false)}>
              {item.label}
            </a>
          ))}
          <a className={mode === "blog" ? "is-active" : ""} href="/blog" onClick={() => setIsOpen(false)}>
            Blog
          </a>
          <a className="drawer-call" href="tel:010-8288-8854" onClick={() => setIsOpen(false)}>
            전화예약 010-8288-8854
          </a>
        </nav>
      </div>
    </header>
  );
}
