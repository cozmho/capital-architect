"use client";

import { useEffect } from "react";

export default function ScrollEffects() {
  useEffect(() => {
    // ----------------------------------------------------------------
    // 1. Reveal animation observer
    // ----------------------------------------------------------------
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            revealObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

    // ----------------------------------------------------------------
    // 2. Nav scroll state
    // ----------------------------------------------------------------
    const nav = document.querySelector(".nav") as HTMLElement | null;
    const handleScroll = () => {
      if (nav) {
        if (window.scrollY > 60) {
          nav.classList.add("scrolled");
        } else {
          nav.classList.remove("scrolled");
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // ----------------------------------------------------------------
    // 3. Active nav section highlighting
    // ----------------------------------------------------------------
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a[href^='#']");

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.remove("active");
              if (link.getAttribute("href") === `#${id}`) {
                link.classList.add("active");
              }
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: "-68px 0px -40% 0px" }
    );

    sections.forEach((section) => sectionObserver.observe(section));

    // ----------------------------------------------------------------
    // 4. Counter animation
    // ----------------------------------------------------------------
    const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const animateCounter = (el: HTMLElement) => {
      const originalText = el.getAttribute("data-value") || el.textContent || "";
      const prefix = originalText.match(/^[^0-9]*/)?.[0] || "";
      const suffix = originalText.match(/[^0-9]*$/)?.[0] || "";
      const numericStr = originalText.replace(/[^0-9.]/g, "");
      const target = parseFloat(numericStr);

      if (isNaN(target)) return;

      const duration = 1200;
      const startTime = performance.now();

      const update = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);
        const current = Math.round(easedProgress * target);

        el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = originalText;
        }
      };

      requestAnimationFrame(update);
    };

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            if (!el.dataset.animated) {
              el.dataset.animated = "true";
              el.setAttribute("data-value", el.textContent || "");
              animateCounter(el);
            }
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    document
      .querySelectorAll(".stat-number, .result-amount")
      .forEach((el) => counterObserver.observe(el));

    // ----------------------------------------------------------------
    // 5. Mobile hamburger toggle
    // ----------------------------------------------------------------
    const hamburger = document.querySelector(".nav-hamburger") as HTMLElement | null;
    const mobileMenu = document.querySelector(".mobile-menu") as HTMLElement | null;

    const toggleMenu = () => {
      hamburger?.classList.toggle("open");
      mobileMenu?.classList.toggle("open");
    };

    const closeMenu = () => {
      hamburger?.classList.remove("open");
      mobileMenu?.classList.remove("open");
    };

    hamburger?.addEventListener("click", toggleMenu);

    // Close on link click
    mobileMenu?.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close on outside click
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        mobileMenu?.classList.contains("open") &&
        hamburger &&
        mobileMenu &&
        !hamburger.contains(e.target as Node) &&
        !mobileMenu.contains(e.target as Node)
      ) {
        closeMenu();
      }
    };
    document.addEventListener("click", handleOutsideClick);

    // ----------------------------------------------------------------
    // Cleanup
    // ----------------------------------------------------------------
    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
      counterObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
      hamburger?.removeEventListener("click", toggleMenu);
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return null;
}
