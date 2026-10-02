"use client";

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/#about" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

const treatmentLinks = [
  { label: "Facial Treatments", href: "/services/facial-treatments" },
  { label: "Micro-Infusion Facial", href: "/services/micro-infusion-facial" },
  { label: "Photo Facial / IPL", href: "/services/ipl-treatments" },
  { label: "Laser Hair Removal", href: "/services/laser-hair-removal" },
  { label: "Lash Services", href: "/services/lash-services" },
];

const otherLinks = [
  { label: "Gift Certificates", href: "/product/gift-card", external: false },
  { label: "Offers", href: "/offers", external: false },
  { label: "Cancellation Policy", href: "https://skinstudioithaca.com/cancellation-policy/", external: true },
];

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-dark-deep">
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-12 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-1">
            <span className="heading-serif mb-4 block text-2xl text-ivory">
              SKIN STUDIO
            </span>
            <p className="mb-6 max-w-xs font-sans text-[14px] leading-[1.75] text-body-muted">
              Serious skincare. Serious results. Medical-grade skin solutions in
              Ithaca, New York.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle text-body-muted transition-all duration-300 hover:border-rose/30 hover:text-ivory"
                aria-label="Facebook"
              >
                <FacebookIcon size={16} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle text-body-muted transition-all duration-300 hover:border-rose/30 hover:text-ivory"
                aria-label="Instagram"
              >
                <InstagramIcon size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-ivory">
              Navigation
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-sans text-[14px] text-body-muted transition-colors duration-300 hover:text-ivory"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-ivory">
              Treatments
            </h4>
            <ul className="space-y-3">
              {treatmentLinks.map((link) => {
                const isExternal = link.href.startsWith("http");
                return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="font-sans text-[14px] text-body-muted transition-colors duration-300 hover:text-ivory"
                  >
                    {link.label}
                  </a>
                </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-ivory">
              Info
            </h4>
            <ul className="space-y-3">
              {otherLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="font-sans text-[14px] text-body-muted transition-colors duration-300 hover:text-ivory"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="tel:6072628566"
                  className="font-sans text-[14px] text-body-muted transition-colors duration-300 hover:text-ivory"
                >
                  607-262-8566
                </a>
              </li>
              <li>
                <span className="font-sans text-[14px] text-body-muted">
                  903 Hanshaw Rd, Suite 104
                  <br />
                  Ithaca, NY 14850
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-border-subtle pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="font-sans text-[13px] text-body-muted/60">
              &copy; {new Date().getFullYear()} Skin Studio Ithaca. All rights
              reserved.
            </p>
            <a
              href="/book"
              className="font-sans text-[13px] font-medium text-rose transition-colors duration-300 hover:text-rose-hover"
            >
              Book an Appointment
            </a>
          </div>
        </div>

        <div className="mt-12 overflow-hidden text-center">
          <span className="heading-serif text-[60px] tracking-wider text-border-subtle md:text-[80px] lg:text-[100px]">
            SKIN STUDIO
          </span>
        </div>
      </div>
    </footer>
  );
}
