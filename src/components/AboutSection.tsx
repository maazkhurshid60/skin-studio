"use client";

import { motion } from "framer-motion";
import SectionLabel from "./SectionLabel";
import { ArrowRight } from "lucide-react";

const stats = [
  { value: "23+", label: "Years of Experience" },
  { value: "6+", label: "Specialized Services" },
  { value: "Free", label: "Consultations Included" },
];

export default function AboutSection() {
  return (
    <section id="about" className="bg-dark-secondary py-28 md:py-36 lg:py-44">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <SectionLabel text="About Skin Studio" />

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="heading-serif mb-8 text-4xl md:text-5xl lg:text-6xl"
            >
              Where Science
              <br />
              Meets <span className="heading-serif-italic">Beauty</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.7,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mb-6 max-w-lg font-sans text-base leading-[1.8] text-body-muted"
            >
              Skin Studio is a medi spa that provides medical-grade skin solutions
              in a relaxing atmosphere. Our highly trained and knowledgeable staff
              utilizes the latest technology to give you non-surgical, lasting
              results.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.7,
                delay: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mb-10 max-w-lg font-sans text-base leading-[1.8] text-body-muted"
            >
              Our signature treatments combine the comfort of a relaxing facial
              with the power of advanced aesthetics — a hybrid approach that
              delivers visible, lasting improvement.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-wrap items-center gap-4"
            >
              <a
                href="#services"
                className="inline-flex rounded-full bg-rose px-8 py-3.5 font-sans text-[15px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover"
              >
                Explore Our Treatments
              </a>
              <a
                href="/book"
                className="group/link inline-flex items-center gap-2 font-sans text-[14px] font-medium text-body-muted transition-colors duration-300 hover:text-ivory"
              >
                Book a Consultation
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover/link:translate-x-1"
                />
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex min-h-[400px] items-center justify-center md:min-h-[500px] lg:min-h-[580px]"
          >
            <div className="relative ml-auto w-[72%] -rotate-2 overflow-hidden rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.4)]">
              <img
                src="/images/natalie-new.webp"
                alt="Natalie Sweeney, Owner and Lead Esthetician at Skin Studio Ithaca"
                className="aspect-[3/4] w-full object-cover object-top"
                loading="lazy"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.7,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute bottom-0 left-0 z-20 w-[52%] rotate-3 overflow-hidden rounded-2xl border-[5px] border-dark-secondary shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <img
                src="/images/about-treatment.jpg"
                alt="Skin Studio esthetician performing a detailed skin analysis with magnifying lamp"
                className="aspect-[3/4] w-full object-cover object-center"
                loading="lazy"
              />
            </motion.div>

            <div className="absolute -right-3 top-[15%] z-0 h-[70%] w-[70%] rounded-full bg-rose/[0.04] blur-3xl" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.7,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-20 grid grid-cols-3 gap-8 border-t border-border-subtle pt-12 md:mt-28"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="heading-serif text-3xl text-rose md:text-4xl lg:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 font-sans text-[13px] font-medium tracking-wide text-body-muted md:text-[14px]">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
