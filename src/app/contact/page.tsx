"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  MapPin,
  Phone,
  Clock,
  Send,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionLabel from "@/components/SectionLabel";
import Testimonials from "@/components/Testimonials";

const ease = [0.22, 1, 0.36, 1] as const;

const contactInfo = [
  {
    icon: MapPin,
    label: "Visit Us",
    primary: "903 Hanshaw Rd, Suite 104",
    secondary: "Ithaca, NY 14850",
    href: "https://maps.google.com/?q=903+Hanshaw+Rd+Suite+104+Ithaca+NY+14850",
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

const inputClass =
  "w-full rounded-xl border border-border-subtle bg-dark-primary px-5 py-3.5 font-sans text-[14px] text-ivory placeholder:text-body-muted/50 transition-colors duration-300 outline-none focus:border-rose/40";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const formRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(formRef, { once: true, margin: "-80px" });

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Please enter your name.";
    if (!email.trim()) errs.email = "Please enter your email address.";
    else if (!isValidEmail(email))
      errs.email = "Please enter a valid email address.";
    if (!message.trim()) errs.message = "Please enter a message.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          message: message.trim(),
        }),
      });

      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
        setErrors({});
      } else {
        const data = await res.json().catch(() => null);
        setStatus("error");
        if (data?.error) {
          setErrors({ form: data.error });
        }
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <motion.div
      ref={formRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2, ease }}
    >
      <SectionLabel text="Send a Message" />
      <h2 className="heading-serif mb-3 text-3xl text-ivory md:text-4xl lg:text-[44px]">
        Get in <span className="heading-serif-italic">Touch</span>
      </h2>
      <p className="mb-8 font-sans text-[15px] leading-relaxed text-body-muted">
        Have a question about our services? Send us a message and we&apos;ll get
        back to you as soon as possible.
      </p>

      {status === "success" && (
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-5">
          <CheckCircle
            size={20}
            className="mt-0.5 flex-shrink-0 text-emerald-400"
          />
          <div>
            <p className="font-sans text-[14px] font-semibold text-ivory">
              Message Sent
            </p>
            <p className="mt-1 font-sans text-[13px] text-body-muted">
              Thank you for reaching out. We&apos;ll respond as soon as
              possible.
            </p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-rose/20 bg-rose/[0.05] p-5">
          <AlertTriangle
            size={20}
            className="mt-0.5 flex-shrink-0 text-rose"
          />
          <div>
            <p className="font-sans text-[14px] font-semibold text-ivory">
              Unable to Send
            </p>
            <p className="mt-1 font-sans text-[13px] text-body-muted">
              {errors.form ||
                "Something went wrong. Please call us at 607-262-8566 or try again later."}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-ivory">
              Name <span className="text-rose">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => {
                  const n = { ...prev };
                  delete n.name;
                  return n;
                });
              }}
              placeholder="Your name"
              className={inputClass}
              required
            />
            {errors.name && (
              <p className="mt-1.5 font-sans text-[13px] text-rose">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-ivory">
              Email <span className="text-rose">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => {
                  const n = { ...prev };
                  delete n.email;
                  return n;
                });
              }}
              placeholder="you@example.com"
              className={inputClass}
              required
            />
            {errors.email && (
              <p className="mt-1.5 font-sans text-[13px] text-rose">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-2 block font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-ivory">
            Phone{" "}
            <span className="normal-case tracking-normal text-body-muted/50">
              (optional)
            </span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="607-000-0000"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-ivory">
            Message <span className="text-rose">*</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setErrors((prev) => {
                const n = { ...prev };
                delete n.message;
                return n;
              });
            }}
            placeholder="How can we help you?"
            rows={4}
            className={`${inputClass} resize-none`}
            required
          />
          {errors.message && (
            <p className="mt-1.5 font-sans text-[13px] text-rose">
              {errors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center gap-2 rounded-full bg-rose px-8 py-3.5 font-sans text-[15px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {status === "submitting" ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={16} />
              Send Message
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}

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
              We&apos;d love to hear from you. Reach out to book an
              appointment, ask about our services, or visit us in Ithaca.
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

        {/* Contact Form + Map */}
        <section className="bg-dark-primary py-20 md:py-28 lg:py-36">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
            <div className="grid items-start gap-16 lg:grid-cols-2 lg:gap-20">
              {/* Form */}
              <ContactForm />

              {/* Map & Directions */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: 0.3, ease }}
              >
                <a
                  href="https://maps.google.com/?q=903+Hanshaw+Rd+Suite+104+Ithaca+NY+14850"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block overflow-hidden rounded-[20px] border border-border-subtle"
                >
                  <div className="flex h-[280px] flex-col items-center justify-center bg-dark-deep/60 transition-colors duration-300 group-hover:bg-dark-deep/80">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose/10 transition-colors duration-300 group-hover:bg-rose/15">
                      <MapPin
                        size={28}
                        className="text-rose/70 transition-colors duration-300 group-hover:text-rose"
                      />
                    </div>
                    <p className="heading-serif text-xl text-ivory">
                      903 Hanshaw Rd, Suite 104
                    </p>
                    <p className="mt-1 font-sans text-[14px] text-body-muted">
                      Ithaca, NY 14850
                    </p>
                    <p className="mt-4 font-sans text-[13px] font-semibold text-rose/70 transition-colors duration-300 group-hover:text-rose">
                      Open in Google Maps &rarr;
                    </p>
                  </div>
                </a>

                <div className="mt-8 rounded-[20px] border border-border-subtle bg-dark-secondary/60 p-8">
                  <h3 className="heading-serif mb-4 text-2xl text-ivory">
                    Visit the Studio
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin
                        size={16}
                        className="mt-1 flex-shrink-0 text-rose/60"
                      />
                      <div>
                        <p className="font-sans text-[14px] text-ivory">
                          903 Hanshaw Rd, Suite 104
                        </p>
                        <p className="font-sans text-[14px] text-body-muted">
                          Ithaca, NY 14850
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone
                        size={16}
                        className="mt-1 flex-shrink-0 text-rose/60"
                      />
                      <div>
                        <a
                          href="tel:6072628566"
                          className="font-sans text-[14px] text-ivory transition-colors duration-300 hover:text-rose"
                        >
                          607-262-8566
                        </a>
                        <p className="font-sans text-[14px] text-body-muted">
                          Call or text
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock
                        size={16}
                        className="mt-1 flex-shrink-0 text-rose/60"
                      />
                      <div>
                        <p className="font-sans text-[14px] text-ivory">
                          Monday – Saturday
                        </p>
                        <p className="font-sans text-[14px] text-body-muted">
                          By appointment only
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href="https://maps.google.com/?q=903+Hanshaw+Rd+Suite+104+Ithaca+NY+14850"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border-subtle px-5 py-2.5 font-sans text-[13px] font-medium text-body-muted transition-all duration-300 hover:border-rose/30 hover:text-ivory"
                    >
                      <MapPin size={14} />
                      Get Directions
                    </a>
                    <a
                      href="/book"
                      className="inline-flex rounded-full bg-rose px-5 py-2.5 font-sans text-[13px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover"
                    >
                      Book an Appointment
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <Testimonials showCTAs={false} />

        {/* CTA */}
        <section className="bg-dark-primary py-28 md:py-36 lg:py-44">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease }}
              className="overflow-hidden rounded-[28px] border border-border-subtle bg-dark-secondary p-10 text-center md:p-14 lg:p-20"
            >
              <p className="eyebrow mb-6">Ready to Begin?</p>
              <h2 className="heading-serif mb-6 text-3xl md:text-4xl lg:text-5xl">
                Start Your Skin{" "}
                <span className="heading-serif-italic">Journey</span>
              </h2>
              <p className="mx-auto mb-10 max-w-lg font-sans text-[15px] leading-[1.8] text-body-muted">
                Book a free consultation and let our licensed professionals
                create a personalized treatment plan designed around your unique
                skin goals.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="/book"
                  className="inline-flex rounded-full bg-rose px-8 py-3.5 font-sans text-[15px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover"
                >
                  Book a Consultation
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
