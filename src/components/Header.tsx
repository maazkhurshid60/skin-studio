"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, ChevronDown } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

interface NavChild {
  label: string;
  href: string;
  external?: boolean;
}

interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  children?: NavChild[];
}

const navLinks: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    children: [
      {
        label: "Facial Treatments",
        href: "/services/facial-treatments",
      },
      {
        label: "Micro-Infusion Facial",
        href: "/services/micro-infusion-facial",
      },
      {
        label: "Photo Facial",
        href: "/services/ipl-treatments",
      },
      {
        label: "Lash Services",
        href: "/services/lash-services",
      },
      {
        label: "Laser Hair Removal",
        href: "/services/laser-hair-removal",
      },
    ],
  },
  {
    label: "About Us",
    href: "/about",
    children: [
      {
        label: "Gift Certificates",
        href: "/product/gift-card",
      },
    ],
  },
  { label: "Team", href: "/team" },
  { label: "Offers", href: "/offers" },
  { label: "Contact", href: "/contact" },
];

function DesktopNavItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleEnter = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  const externalProps = item.external
    ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
    : {};

  if (!item.children) {
    return (
      <a
        href={item.href}
        {...externalProps}
        className="group relative font-sans text-[13px] font-medium uppercase tracking-[0.14em] text-body-muted transition-colors duration-300 hover:text-ivory"
      >
        {item.label}
        <span className="absolute -bottom-1 left-0 h-px w-0 bg-rose transition-all duration-300 group-hover:w-full" />
      </a>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <a
        href={item.href}
        className="group relative inline-flex items-center gap-1 font-sans text-[13px] font-medium uppercase tracking-[0.14em] text-body-muted transition-colors duration-300 hover:text-ivory"
      >
        {item.label}
        <ChevronDown
          size={11}
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
        <span className="absolute -bottom-1 left-0 h-px w-0 bg-rose transition-all duration-300 group-hover:w-full" />
      </a>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease }}
            className="absolute left-0 top-full z-50 mt-3 min-w-[220px] overflow-hidden rounded-xl border border-border-subtle bg-dark-primary/95 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md"
          >
            {item.children!.map((child) => (
              <a
                key={child.label}
                href={child.href}
                {...(child.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="block px-5 py-2.5 font-sans text-[13px] normal-case tracking-normal text-body-muted transition-colors duration-200 hover:bg-surface-subtle hover:text-ivory"
              >
                {child.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileExpanded(null);
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-dark-primary/95 backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.06)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 lg:px-12">
          <a
            href="/"
            className="font-serif text-xl tracking-wide text-ivory md:text-2xl"
          >
            SKIN STUDIO
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <DesktopNavItem key={link.label} item={link} />
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="tel:6072628566"
              className="hidden items-center gap-2 text-[13px] font-medium text-body-muted transition-colors duration-300 hover:text-ivory md:flex lg:hidden"
            >
              <Phone size={14} />
              607-262-8566
            </a>

            <a
              href="/book"
              className="hidden rounded-full bg-rose px-6 py-2.5 font-sans text-[13px] font-semibold uppercase tracking-[0.1em] text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover md:inline-block"
            >
              Book Now
            </a>

            <button
              onClick={() => setMobileOpen(true)}
              className="text-ivory lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-dark-primary/98 backdrop-blur-xl"
          >
            <div className="flex h-full flex-col px-8 py-6">
              <div className="flex items-center justify-between">
                <span className="font-serif text-xl tracking-wide text-ivory">
                  SKIN STUDIO
                </span>
                <button
                  onClick={closeMobile}
                  className="text-ivory"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="mt-16 flex flex-1 flex-col gap-1 overflow-y-auto">
                {navLinks.map((link, i) => (
                  <div key={link.label}>
                    <div className="flex items-center border-b border-border-subtle">
                      <motion.a
                        href={link.href}
                        onClick={closeMobile}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.1 + i * 0.06,
                          duration: 0.5,
                          ease,
                        }}
                        className="flex-1 py-5 font-serif text-3xl text-ivory transition-colors duration-300 hover:text-rose"
                        {...(link.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {link.label}
                      </motion.a>
                      {link.children && (
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            delay: 0.1 + i * 0.06 + 0.1,
                            duration: 0.4,
                          }}
                          onClick={() =>
                            setMobileExpanded(
                              mobileExpanded === link.label
                                ? null
                                : link.label
                            )
                          }
                          className="px-3 py-5 text-body-muted transition-colors duration-300 hover:text-ivory"
                          aria-label={`Expand ${link.label}`}
                        >
                          <ChevronDown
                            size={20}
                            className={`transition-transform duration-300 ${
                              mobileExpanded === link.label
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </motion.button>
                      )}
                    </div>
                    <AnimatePresence>
                      {link.children && mobileExpanded === link.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease }}
                          className="overflow-hidden"
                        >
                          {link.children.map((child) => (
                            <a
                              key={child.label}
                              href={child.href}
                              onClick={closeMobile}
                              {...(child.external
                                ? {
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                  }
                                : {})}
                              className="block border-b border-border-subtle/40 py-3.5 pl-6 font-sans text-[16px] text-body-muted transition-colors duration-300 hover:text-ivory"
                            >
                              {child.label}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>

              <div className="space-y-4 pb-8">
                <a
                  href="/book"
                  className="block w-full rounded-full bg-rose py-4 text-center font-sans text-[14px] font-semibold uppercase tracking-[0.12em] text-ivory"
                >
                  Book Now
                </a>
                <a
                  href="tel:6072628566"
                  className="flex items-center justify-center gap-2 py-2 font-sans text-[14px] text-body-muted"
                >
                  <Phone size={15} />
                  607-262-8566
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
