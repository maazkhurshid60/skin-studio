"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, Clock3 } from "lucide-react";

const trustItems = [
  { icon: ShieldCheck, label: "Licensed Professionals" },
  { icon: Sparkles, label: "Personalized Treatments" },
  { icon: Clock3, label: "No Downtime Required" },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/images/hero.webp"
          alt="Skin Studio Ithaca reception with pink marble wall and gold neon sign"
          className="absolute inset-0 object-cover"
          style={{ width: "100%", height: "100%" }}
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-primary/90 via-dark-primary/70 to-dark-primary/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-primary via-transparent to-dark-primary/30" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-20 pt-32 lg:px-12">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="eyebrow mb-8"
          >
            Luxury Skin Clinic · Ithaca, New York
          </motion.p>

          <h1 className="heading-serif mb-8">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="block text-5xl md:text-7xl lg:text-[88px]"
            >
              Serious Skincare.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="block text-5xl md:text-7xl lg:text-[88px]"
            >
              Serious{" "}
              <span className="heading-serif-italic">Results.</span>
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 max-w-lg font-sans text-base leading-relaxed text-body-muted md:text-lg"
          >
            Medical-grade skin solutions in a calming, boutique atmosphere.
            Non-surgical treatments that deliver lasting results — without
            the downtime.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center gap-4"
          >
            <a
              href="/book"
              className="inline-flex rounded-full bg-rose px-8 py-3.5 font-sans text-[15px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover"
            >
              Book an Appointment
            </a>
            <a
              href="#services"
              className="group inline-flex items-center gap-2 px-2 py-3.5 font-sans text-[14px] font-medium text-ivory transition-colors duration-300 hover:text-rose"
            >
              Explore Treatments
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-16 flex flex-wrap gap-8 border-t border-border-subtle pt-8"
          >
            {trustItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 text-body-muted"
              >
                <item.icon size={16} className="text-rose/70" />
                <span className="font-sans text-[13px] font-medium tracking-wide">
                  {item.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
