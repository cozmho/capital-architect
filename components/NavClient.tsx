"use client";

import { useState, useEffect } from "react";

function TriangleLogo() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon
        points="12,3 22,21 2,21"
        fill="none"
        stroke="var(--gold)"
        strokeWidth="1.5"
      />
      <line
        x1="12"
        y1="9"
        x2="12"
        y2="17"
        stroke="var(--gold)"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function NavClient() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      const nav = document.querySelector(".nav");
      const mobileMenu = document.querySelector(".mobile-menu");
      if (
        nav &&
        mobileMenu &&
        !nav.contains(e.target as Node) &&
        !mobileMenu.contains(e.target as Node)
      ) {
        closeMenu();
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [menuOpen]);

  return (
    <>
      <nav className="nav">
        <a href="/" className="nav-logo">
          <div className="nav-logo-mark">
            <TriangleLogo />
          </div>
          <span className="nav-brand">Capital Architect</span>
        </a>

        <ul className="nav-links">
          <li>
            <a href="#services">Services</a>
          </li>
          <li>
            <a href="#verdic">How It Works</a>
          </li>
          <li>
            <a href="#results">Results</a>
          </li>
          <li>
            <a href="#resources">Resources</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
          <li>
            <a href="/intake" className="btn-nav-cta">
              Get Your Verdic Score
            </a>
          </li>
        </ul>

        <button
          className={`nav-hamburger${menuOpen ? " open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <a href="#services" onClick={closeMenu}>
          Services
        </a>
        <a href="#verdic" onClick={closeMenu}>
          How It Works
        </a>
        <a href="#results" onClick={closeMenu}>
          Results
        </a>
        <a href="#resources" onClick={closeMenu}>
          Resources
        </a>
        <a href="/contact" onClick={closeMenu}>
          Contact
        </a>
        <div className="mobile-menu-ctas">
          <a
            href="/intake"
            className="btn-primary"
            style={{ justifyContent: "center" }}
            onClick={closeMenu}
          >
            Get Your Verdic Score
          </a>
          <a
            href="/contact"
            className="btn-ghost"
            style={{ justifyContent: "center" }}
            onClick={closeMenu}
          >
            Contact Us
          </a>
        </div>
      </div>
    </>
  );
}
