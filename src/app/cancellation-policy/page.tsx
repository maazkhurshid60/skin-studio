"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  MessageSquare,
  Clock,
  DollarSign,
  CalendarClock,
  CreditCard,
  LifeBuoy,
  FileCheck,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ease = [0.22, 1, 0.36, 1] as const;

const policies = [
  {
    id: "notice",
    title: "Cancellation Notice",
    icon: Clock,
    points: [
      "Clients must provide at least 48 hours’ notice for cancellations or rescheduling of appointments.",
      "Cancellations made with less than 48 hours’ notice may incur a cancellation fee.",
    ],
  },
  {
    id: "fees",
    title: "Cancellation Fees",
    icon: DollarSign,
    points: [
      "A fee of $75 may be charged for late cancellations.",
      "No-shows (failure to attend a scheduled appointment without prior notice) may result in a fee equal to the full cost of the scheduled treatment.",
    ],
  },
  {
    id: "rescheduling",
    title: "Rescheduling Appointments",
    icon: CalendarClock,
    points: [
      "Clients wishing to reschedule an appointment must do so at least 48 hours in advance to avoid cancellation fees.",
      "Rescheduling is subject to availability.",
    ],
  },
  {
    id: "payment",
    title: "Payment Information",
    icon: CreditCard,
    points: [
      "A valid credit card is required to secure your appointment. The card will only be charged in the event of a late cancellation or no-show.",
    ],
    callout: "Your card is only held to secure your time — it is never charged when you keep or properly reschedule your appointment.",
  },
  {
    id: "exceptions",
    title: "Exceptions",
    icon: LifeBuoy,
    points: [
      "Exceptions to the cancellation policy may be made for emergencies or unforeseen circumstances. Clients should contact Skin Studio Ithaca as soon as possible to discuss their situation.",
    ],
  },
  {
    id: "acknowledgment",
    title: "Acknowledgment of Policy",
    icon: FileCheck,
    points: [
      "Clients will be required to acknowledge and agree to the cancellation policy at the time of booking.",
    ],
  },
  {
    id: "changes",
    title: "Policy Changes",
    icon: RefreshCw,
    points: [
      "Skin Studio Ithaca reserves the right to modify the cancellation policy at any time. Clients will be notified of any changes.",
    ],
  },
];

const highlights = [
  { value: "48", unit: "hrs", label: "Notice to cancel or reschedule" },
  { value: "$75", unit: "", label: "Late cancellation fee" },
  { value: "100", unit: "%", label: "Of treatment cost for no-shows" },
];

export default function CancellationPolicyPage() {
  const [active, setActive] = useState(policies[0].id);

  // Highlight the section currently in view in the sidebar
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    policies.forEach((p) => {
      const el = document.getElementById(p.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative flex min-h-[56vh] items-end overflow-hidden pb-32 pt-32 md:min-h-[50vh] md:pb-36">
          <div className="absolute inset-0">
            <img
              src="/images/about-treatment.jpg"
              alt="Skin Studio Ithaca treatment room"
              className="absolute inset-0 object-cover"
              style={{ width: "100%", height: "100%" }}
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-dark-primary/95 via-dark-primary/80 to-dark-primary/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-primary via-dark-primary/40 to-transparent" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
              className="mb-6 flex items-center gap-3 font-sans text-[13px] text-body-muted"
            >
              <Link href="/" className="transition-colors duration-300 hover:text-ivory">
                Home
              </Link>
              <span className="text-border-subtle">/</span>
              <span className="text-ivory">Cancellation Policy</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease }}
              className="eyebrow mb-4"
            >
              Client Policies
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease }}
              className="heading-serif text-5xl md:text-6xl lg:text-[76px]"
            >
              Cancellation <span className="heading-serif-italic">Policy</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease }}
              className="mt-6 max-w-lg font-sans text-base leading-relaxed text-body-muted md:text-lg"
            >
              Every appointment is time reserved especially for you. Please
              review our policy before booking so we can keep openings
              available for every client.
            </motion.p>
          </div>
        </section>

        {/* At a glance — overlaps the hero */}
        <section className="relative z-20 -mt-20 px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease }}
            className="mx-auto grid max-w-[1100px] overflow-hidden rounded-[28px] border border-border-subtle bg-dark-secondary/95 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-md sm:grid-cols-3"
          >
            {highlights.map((h, i) => (
              <div
                key={h.label}
                className={`px-8 py-8 text-center md:py-10 ${
                  i > 0 ? "border-t border-border-subtle sm:border-l sm:border-t-0" : ""
                }`}
              >
                <p className="heading-serif text-5xl text-ivory md:text-6xl">
                  {h.value}
                  {h.unit && (
                    <span className="heading-serif-italic ml-1 text-2xl text-rose md:text-3xl">
                      {h.unit}
                    </span>
                  )}
                </p>
                <p className="mt-3 font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-body-muted/70">
                  {h.label}
                </p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Policy */}
        <section className="bg-dark-primary py-24 md:py-32">
          <div className="mx-auto grid max-w-[1100px] gap-12 px-6 lg:grid-cols-[260px_1fr] lg:gap-20 lg:px-12">
            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-32">
                <p className="eyebrow mb-6">On This Page</p>
                <nav className="relative border-l border-border-subtle">
                  {policies.map((p, i) => {
                    const isActive = active === p.id;
                    return (
                      <a
                        key={p.id}
                        href={`#${p.id}`}
                        className={`relative -ml-px flex items-baseline gap-3 border-l py-2.5 pl-5 font-sans text-[14px] transition-colors duration-300 ${
                          isActive
                            ? "border-rose text-ivory"
                            : "border-transparent text-body-muted/60 hover:text-ivory"
                        }`}
                      >
                        <span className={`text-[11px] font-semibold tracking-wider ${isActive ? "text-rose" : "text-body-muted/40"}`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {p.title}
                      </a>
                    );
                  })}
                </nav>

                <div className="mt-10 rounded-2xl border border-border-subtle bg-dark-secondary p-6">
                  <p className="mb-1 font-sans text-[14px] font-semibold text-ivory">
                    Need to reschedule?
                  </p>
                  <p className="mb-5 font-sans text-[13px] leading-relaxed text-body-muted/70">
                    Reach out at least 48 hours ahead.
                  </p>
                  <a
                    href="tel:6073194592"
                    className="mb-2 flex items-center gap-2 font-sans text-[13px] font-medium text-body-muted transition-colors hover:text-ivory"
                  >
                    <Phone size={14} className="text-rose" />
                    607-319-4592
                  </a>
                  <a
                    href="sms:6072628566"
                    className="flex items-center gap-2 font-sans text-[13px] font-medium text-body-muted transition-colors hover:text-ivory"
                  >
                    <MessageSquare size={14} className="text-rose" />
                    Text 607-262-8566
                  </a>
                </div>
              </div>
            </aside>

            {/* Sections */}
            <div>
              {policies.map((policy, i) => {
                const Icon = policy.icon;
                return (
                  <motion.article
                    key={policy.id}
                    id={policy.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.7, ease }}
                    className={`scroll-mt-32 py-10 md:py-12 ${i > 0 ? "border-t border-border-subtle" : "pt-0 md:pt-0"}`}
                  >
                    <div className="mb-5 flex items-center gap-5">
                      <span className="heading-serif-italic text-5xl leading-none text-rose/40 md:text-6xl">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-rose/30 to-transparent" />
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-rose/20 bg-rose/10">
                        <Icon size={16} className="text-rose" />
                      </div>
                    </div>

                    <h2 className="heading-serif mb-5 text-3xl md:text-4xl">{policy.title}</h2>

                    <ul className="space-y-3">
                      {policy.points.map((point) => (
                        <li
                          key={point}
                          className="relative pl-6 font-sans text-[16px] leading-[1.8] text-body-muted before:absolute before:left-0 before:top-[0.8em] before:h-px before:w-3 before:bg-rose/60"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>

                    {policy.callout && (
                      <div className="mt-6 flex gap-4 rounded-2xl border border-rose/20 bg-rose/[0.06] p-5">
                        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-rose" />
                        <p className="font-sans text-[14px] leading-relaxed text-ivory/90">
                          {policy.callout}
                        </p>
                      </div>
                    )}
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Acknowledgment / questions */}
        <section className="bg-dark-primary pb-28 md:pb-36">
          <div className="mx-auto max-w-[1100px] px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease }}
              className="relative overflow-hidden rounded-[28px] border border-border-subtle bg-dark-deep p-10 md:p-14"
            >
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-rose/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-mauve/10 blur-3xl" />

              <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
                <div>
                  <p className="eyebrow mb-5">Questions?</p>
                  <h2 className="heading-serif mb-5 text-4xl md:text-5xl">
                    We’re Happy to <span className="heading-serif-italic">Help.</span>
                  </h2>
                  <p className="max-w-md font-sans text-[15px] leading-[1.8] text-body-muted">
                    For any questions regarding the cancellation policy, call
                    our front desk or send us a text. By booking an
                    appointment, you acknowledge and agree to this policy.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <a
                    href="tel:6073194592"
                    className="group flex items-center gap-4 rounded-2xl border border-border-subtle bg-dark-primary/60 p-5 transition-all duration-300 hover:border-rose/30"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose/10">
                      <Phone size={16} className="text-rose" />
                    </span>
                    <span className="flex-1">
                      <span className="block font-sans text-[12px] uppercase tracking-[0.14em] text-body-muted/60">
                        Front Desk
                      </span>
                      <span className="block font-sans text-[16px] font-semibold text-ivory">607-319-4592</span>
                    </span>
                    <ArrowRight size={16} className="text-body-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ivory" />
                  </a>
                  <a
                    href="sms:6072628566"
                    className="group flex items-center gap-4 rounded-2xl border border-border-subtle bg-dark-primary/60 p-5 transition-all duration-300 hover:border-rose/30"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose/10">
                      <MessageSquare size={16} className="text-rose" />
                    </span>
                    <span className="flex-1">
                      <span className="block font-sans text-[12px] uppercase tracking-[0.14em] text-body-muted/60">
                        Text Us
                      </span>
                      <span className="block font-sans text-[16px] font-semibold text-ivory">607-262-8566</span>
                    </span>
                    <ArrowRight size={16} className="text-body-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ivory" />
                  </a>
                  <Link
                    href="/book"
                    className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-rose px-8 py-4 font-sans text-[15px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover"
                  >
                    Book Your Appointment
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
