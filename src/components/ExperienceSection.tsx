"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function ExperienceSection() {
  return (
    <section className="bg-dark-primary py-28 md:py-36 lg:py-44">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="heading-serif text-4xl md:text-5xl lg:text-6xl">
              More Than
              <br />a Treatment.
              <br />
              <span className="heading-serif-italic">
                A Moment to Exhale.
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col justify-center"
          >
            <p className="mb-6 font-sans text-base leading-[1.85] text-body-muted md:text-[17px]">
              At Skin Studio, every visit is designed to be restorative — a space
              where advanced skincare meets genuine comfort. Our signature facials
              are a hybrid of relaxing treatment with powerful, lasting results.
            </p>
            <p className="mb-10 font-sans text-base leading-[1.85] text-body-muted md:text-[17px]">
              Whether you&apos;re addressing acne, aging, skin texture, or simply
              seeking a moment of calm — our team takes skincare seriously so you
              can leave feeling confident, renewed, and truly cared for.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="/book"
                className="inline-flex rounded-full bg-rose px-8 py-3.5 font-sans text-[15px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover"
              >
                Book Your Experience
              </a>
              <a
                href="tel:6072628566"
                className="group/link inline-flex items-center gap-2 font-sans text-[14px] font-medium text-body-muted transition-colors duration-300 hover:text-ivory"
              >
                Or Call 607-262-8566
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover/link:translate-x-1"
                />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
