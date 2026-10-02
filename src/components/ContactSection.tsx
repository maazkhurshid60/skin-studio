"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, ArrowUpRight } from "lucide-react";
import SectionLabel from "./SectionLabel";

export default function ContactSection() {
  return (
    <section id="contact" className="bg-dark-secondary py-28 md:py-36 lg:py-44">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_auto]">
          <div>
            <SectionLabel text="Get in Touch" />
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="heading-serif text-4xl md:text-5xl lg:text-6xl"
            >
              Let&apos;s Start Your
              <br />
              <span className="heading-serif-italic">Skin Journey.</span>
            </motion.h2>
          </div>

          <motion.a
            href="/book"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="group hidden h-[72px] w-[72px] items-center justify-center rounded-full border border-border-subtle transition-all duration-500 hover:border-rose/40 hover:bg-rose/10 lg:flex"
          >
            <ArrowUpRight
              size={28}
              className="text-ivory transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </motion.a>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 border-t border-border-subtle pt-16 md:mt-20 md:pt-20"
        >
          <div className="grid gap-12 md:grid-cols-3 md:gap-0">
            <motion.a
              href="https://maps.google.com/?q=903+Hanshaw+Rd+Suite+104+Ithaca+NY+14850"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group md:border-r md:border-border-subtle md:pr-12"
            >
              <div className="mb-5 flex items-center gap-3">
                <MapPin
                  size={16}
                  className="text-rose/60 transition-colors duration-300 group-hover:text-rose"
                />
                <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-rose/60 transition-colors duration-300 group-hover:text-rose">
                  Visit Us
                </span>
              </div>
              <p className="heading-serif text-[22px] text-ivory transition-colors duration-300 group-hover:text-rose md:text-[24px]">
                903 Hanshaw Rd
              </p>
              <p className="heading-serif text-[22px] text-ivory transition-colors duration-300 group-hover:text-rose md:text-[24px]">
                Suite 104
              </p>
              <p className="mt-2 font-sans text-[14px] text-body-muted">
                Ithaca, NY 14850
              </p>
            </motion.a>

            <motion.a
              href="tel:6072628566"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group md:border-r md:border-border-subtle md:px-12"
            >
              <div className="mb-5 flex items-center gap-3">
                <Phone
                  size={16}
                  className="text-rose/60 transition-colors duration-300 group-hover:text-rose"
                />
                <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-rose/60 transition-colors duration-300 group-hover:text-rose">
                  Call or Text
                </span>
              </div>
              <p className="heading-serif text-[22px] text-ivory transition-colors duration-300 group-hover:text-rose md:text-[24px]">
                607-262-8566
              </p>
              <p className="mt-2 font-sans text-[14px] text-body-muted">
                Mon – Sat · By appointment
              </p>
            </motion.a>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="md:pl-12"
            >
              <p className="mb-5 font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-rose/60">
                Book Online
              </p>
              <a
                href="/book"
                className="inline-flex rounded-full bg-rose px-8 py-3.5 font-sans text-[15px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover"
              >
                Schedule your visit
              </a>
              <p className="mt-4 font-sans text-[14px] text-body-muted">
                Free consultations included
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
