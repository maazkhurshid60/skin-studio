"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Clock,
  Calendar,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionLabel from "@/components/SectionLabel";
import Testimonials from "@/components/Testimonials";
import {
  GOOGLE_MAPS_EMBED_URL,
  GOOGLE_MAPS_DIRECTIONS_URL,
} from "@/lib/square";

const ease = [0.22, 1, 0.36, 1] as const;

const contactInfo = [
  {
    icon: MapPin,
    label: "Visit Us",
    primary: "903 Hanshaw Rd, Suite 104",
    secondary: "Community Corners Plaza · Ithaca, NY 14850",
    href: GOOGLE_MAPS_DIRECTIONS_URL,
    external: true,
    action: "Get Directions",
  },
  {
    icon: Phone,
    label: "Call or Text",
    primary: "607-262-8566",
    secondary: "Mon – Sat · By appointment",
    href: "tel:6072628566",
    external: false,
    action: "Call Now",
  },
  {
    icon: Clock,
    label: "Hours",
    primary: "Monday – Saturday",
    secondary: "By appointment only",
    href: "/book",
    external: false,
    action: "Book Online",
  },
];

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative flex min-h-[60vh] items-end overflow-hidden pb-20 pt-32 md:min-h-[50vh] md:pb-24 lg:pb-28">
          <div className="absolute inset-0">
            <img
              src="/images/hero.webp"
              alt="Skin Studio Ithaca"
              className="absolute inset-0 object-cover"
              style={{ width: "100%", height: "100%" }}
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-dark-primary/95 via-dark-primary/80 to-dark-primary/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-primary via-dark-primary/40 to-transparent" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
              className="mb-6 flex items-center gap-3 font-sans text-[13px] text-body-muted"
            >
              <a
                href="/"
                className="transition-colors duration-300 hover:text-ivory"
              >
                Home
              </a>
              <span className="text-border-subtle">/</span>
              <span className="text-ivory">Contact</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease }}
              className="heading-serif text-5xl md:text-6xl lg:text-[76px]"
            >
              Contact <span className="heading-serif-italic">Us</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease }}
              className="mt-6 max-w-lg font-sans text-base leading-relaxed text-body-muted md:text-lg"
            >
              We&apos;d love to hear from you. Visit our studio in Community
              Corners Plaza, or book an appointment online to begin your
              personalized skincare journey.
            </motion.p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="bg-dark-secondary py-20 md:py-28 lg:py-36">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
            <div className="grid gap-6 md:grid-cols-3">
              {contactInfo.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    {...(item.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.1,
                      ease,
                    }}
                    className="group rounded-[20px] border border-border-subtle bg-dark-primary/40 p-8 transition-all duration-300 hover:border-rose/20 hover:bg-dark-primary/60"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-rose/10 transition-colors duration-300 group-hover:bg-rose/15">
                      <Icon
                        size={20}
                        className="text-rose/70 transition-colors duration-300 group-hover:text-rose"
                      />
                    </div>
                    <p className="mb-4 font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-rose/60 transition-colors duration-300 group-hover:text-rose">
                      {item.label}
                    </p>
                    <p className="heading-serif text-[22px] text-ivory">
                      {item.primary}
                    </p>
                    <p className="mt-1 font-sans text-[14px] text-body-muted">
                      {item.secondary}
                    </p>
                    <p className="mt-4 font-sans text-[13px] font-semibold text-rose/70 transition-colors duration-300 group-hover:text-rose">
                      {item.action} &rarr;
                    </p>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Booking Redirect Banner */}
        <section className="border-y border-border-subtle bg-dark-primary py-20 md:py-24">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease }}
              className="relative overflow-hidden rounded-[28px] border border-border-subtle bg-gradient-to-b from-dark-secondary to-dark-secondary/60 p-10 text-center md:p-14 lg:p-16 shadow-2xl"
            >
              <div className="mx-auto max-w-2xl">
                <SectionLabel text="Appointments & Scheduling" align="center" />
                <h2 className="heading-serif text-3xl text-ivory md:text-4xl lg:text-5xl">
                  Ready to Book Your{" "}
                  <span className="heading-serif-italic">Visit?</span>
                </h2>
                <p className="mx-auto mt-6 max-w-xl font-sans text-[15px] leading-[1.8] text-body-muted md:text-base">
                  All consultations and treatment appointments are booked
                  directly through our booking portal. Visit our booking page to
                  browse services, view pricing, and reserve your preferred time
                  slot on Square.
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                  <a
                    href="/book"
                    className="inline-flex items-center gap-2.5 rounded-full bg-rose px-9 py-4 font-sans text-[15px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover shadow-lg shadow-rose/20"
                  >
                    <Calendar size={18} />
                    Book Now
                    <ArrowRight size={16} />
                  </a>

                  <a
                    href="tel:6072628566"
                    className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-dark-primary px-7 py-4 font-sans text-[14px] font-medium text-ivory transition-all duration-300 hover:border-rose/30 hover:text-rose"
                  >
                    <Phone size={15} />
                    Call or Text 607-262-8566
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Full-Width Live Google Map Section */}
        <section className="bg-dark-secondary py-20 md:py-28 lg:py-36">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <SectionLabel text="Studio Location" />
                <h2 className="heading-serif text-3xl md:text-4xl lg:text-5xl">
                  Community Corners{" "}
                  <span className="heading-serif-italic">Plaza</span>
                </h2>
                <p className="mt-4 font-sans text-[15px] text-body-muted">
                  903 Hanshaw Rd, Suite 104 · Ithaca, NY 14850 · Convenient parking right outside
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={GOOGLE_MAPS_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-dark-primary px-6 py-3 font-sans text-[13px] font-medium text-ivory transition-all duration-300 hover:border-rose/40 hover:text-rose"
                >
                  <MapPin size={15} />
                  Get Driving Directions
                  <ExternalLink size={13} />
                </a>

                <a
                  href="/book"
                  className="inline-flex items-center gap-2 rounded-full bg-rose px-6 py-3 font-sans text-[13px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover"
                >
                  <Calendar size={15} />
                  Book an Appointment
                </a>
              </div>
            </div>

            {/* Embedded Live Google Map (Full Width) */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease }}
              className="overflow-hidden rounded-[28px] border border-border-subtle shadow-2xl"
            >
              <iframe
                loading="lazy"
                src={GOOGLE_MAPS_EMBED_URL}
                title="Community Corners Plaza 903 Hanshaw Road Ithaca NY 14850"
                aria-label="Community Corners Plaza 903 Hanshaw Road Ithaca NY 14850"
                className="h-[460px] w-full md:h-[520px] lg:h-[600px]"
                style={{ border: 0 }}
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </section>

        <Testimonials showCTAs={false} />

        {/* Bottom CTA */}
        <section className="bg-dark-primary py-28 md:py-36 lg:py-44">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease }}
              className="overflow-hidden rounded-[28px] border border-border-subtle bg-dark-secondary p-10 text-center md:p-14 lg:p-20 shadow-2xl"
            >
              <p className="eyebrow mb-6">Ready to Begin?</p>
              <h2 className="heading-serif mb-6 text-3xl md:text-4xl lg:text-5xl">
                Start Your Skin{" "}
                <span className="heading-serif-italic">Journey</span>
              </h2>
              <p className="mx-auto mb-10 max-w-lg font-sans text-[15px] leading-[1.8] text-body-muted">
                Visit our booking page to choose your service, view appointment
                times, and reserve your session.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="/book"
                  className="inline-flex items-center gap-2 rounded-full bg-rose px-8 py-3.5 font-sans text-[15px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover shadow-lg shadow-rose/20"
                >
                  <Calendar size={16} />
                  Book an Appointment
                </a>
                <a
                  href="tel:6072628566"
                  className="inline-flex items-center gap-2 rounded-full border border-border-subtle px-6 py-3.5 font-sans text-[14px] font-medium text-body-muted transition-all duration-300 hover:border-rose/30 hover:text-ivory"
                >
                  <Phone size={15} />
                  607-262-8566
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
