"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import SectionLabel from "./SectionLabel";

const testimonials = [
  {
    quote:
      "The atmosphere is extremely cozy and the treatment was better than I could've gotten at any local spa! Two days later, my husband said 'Your face looks different! Your cheeks and forehead look really smooth!'",
    name: "Julie Curcio",
    image: "/images/testimonial-julie.jpg",
  },
  {
    quote:
      "I got a microdermabrasion and it was above and beyond my expectations! I've had many facials before and this was the best yet. Natalie is talented, professional and knowledgeable about her work.",
    name: "Christi Pritchard",
    image: "/images/testimonial-christi.jpg",
  },
  {
    quote:
      "Thank you Natalie for always providing excellent affordable service. Ladies, she's the best. I highly recommend her if you are looking for an esthetician. She is on top of her game!",
    name: "Kimberly Noftell",
    image: "/images/testimonial-kimberly.jpg",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function Testimonials({
  showCTAs = true,
}: {
  showCTAs?: boolean;
}) {
  return (
    <section
      id="testimonials"
      className="bg-dark-deep py-28 md:py-36 lg:py-44"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-16 text-center md:mb-20">
          <SectionLabel text="Client Stories" align="center" />
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease }}
            className="heading-serif text-4xl md:text-5xl lg:text-6xl"
          >
            Loved by Our{" "}
            <span className="heading-serif-italic">Clients.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className="fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <span className="font-sans text-[14px] font-semibold text-ivory">
              5.0
            </span>
            <span className="text-border-subtle">|</span>
            <a
              href="https://www.google.com/maps/place/Skin+Studio+Ithaca/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[13px] text-body-muted transition-colors duration-300 hover:text-ivory"
            >
              Google Reviews
            </a>
          </motion.div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease }}
              className="rounded-2xl border border-border-subtle bg-dark-secondary p-8 md:p-9"
            >
              <span className="heading-serif mb-5 block text-[48px] leading-none text-rose/25">
                &ldquo;
              </span>

              <p className="mb-8 font-sans text-[14px] leading-[1.85] text-body-muted">
                {t.quote}
              </p>

              <div className="mb-6 flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    size={14}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              <div className="flex items-center gap-3.5 border-t border-border-subtle pt-6">
                <img
                  src={t.image}
                  alt={t.name}
                  className="h-11 w-11 rounded-full object-cover"
                  loading="lazy"
                />
                <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.16em] text-ivory">
                  {t.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {showCTAs && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="mt-14 flex flex-wrap items-center justify-center gap-5"
          >
            <a
              href="https://www.google.com/maps/place/Skin+Studio+Ithaca/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-rose px-8 py-3.5 font-sans text-[15px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover"
            >
              Read All Reviews
            </a>
            <a
              href="/book"
              className="inline-flex rounded-full border border-border-subtle px-8 py-3.5 font-sans text-[14px] font-medium text-body-muted transition-all duration-300 hover:border-rose/30 hover:text-ivory"
            >
              Book an Appointment
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
