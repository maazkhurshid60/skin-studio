"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionLabel from "./SectionLabel";

const values = [
  {
    number: "01",
    title: "Personalized Care",
    description:
      "Every treatment plan is built around your unique skin concerns and goals. Free consultations with all skincare services.",
  },
  {
    number: "02",
    title: "Advanced Technology",
    description:
      "From our Motus AX laser to IPL photofacials, we invest in proven, medical-grade technology for safe, effective results.",
  },
  {
    number: "03",
    title: "Relaxing Experience",
    description:
      "Medical-grade results delivered in a calming, boutique spa atmosphere — treatment sessions that feel as restorative as they are effective.",
  },
  {
    number: "04",
    title: "Expert Guidance",
    description:
      "Our team brings decades of combined aesthetics experience, from high-end resort spas to physician's offices.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-dark-deep py-28 md:py-36 lg:py-44">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <div className="order-2 lg:order-1">
            <SectionLabel text="The Skin Studio Difference" />
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="heading-serif mb-14 text-4xl md:text-5xl lg:text-6xl"
            >
              Care That Feels{" "}
              <span className="heading-serif-italic">Personal.</span>
            </motion.h2>

            <div className="space-y-0">
              {values.map((item, i) => (
                <motion.div
                  key={item.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="border-b border-border-subtle py-7 first:border-t"
                >
                  <div className="flex gap-5">
                    <span className="mt-0.5 font-sans text-[12px] font-semibold tracking-[0.2em] text-rose/50">
                      {item.number}
                    </span>
                    <div>
                      <h3 className="mb-2 font-sans text-[16px] font-semibold tracking-wide text-ivory">
                        {item.title}
                      </h3>
                      <p className="max-w-md font-sans text-[14px] leading-[1.75] text-body-muted">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12 flex flex-wrap items-center gap-4"
            >
              <a
                href="/book"
                className="inline-flex rounded-full bg-rose px-8 py-3.5 font-sans text-[15px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover"
              >
                Book Your Visit
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
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 grid min-h-[400px] grid-cols-2 gap-3 lg:order-2 lg:gap-4"
            style={{ gridTemplateRows: "1fr 1fr" }}
          >
            <div className="relative min-h-0 overflow-hidden rounded-lg">
              <img
                src="/images/treatment-facial.jpg"
                alt="Natalie performing a facial treatment with magnifying light"
                className="absolute inset-0 object-cover"
                style={{ width: "100%", height: "100%" }}
                loading="eager"
              />
            </div>
            <div className="relative min-h-0 overflow-hidden rounded-lg">
              <img
                src="/images/natalie-new.webp"
                alt="Natalie Sweeney, Owner of Skin Studio Ithaca"
                className="absolute inset-0 object-cover object-top"
                style={{ width: "100%", height: "100%" }}
                loading="eager"
              />
            </div>
            <div className="relative col-span-2 min-h-0 overflow-hidden rounded-lg">
              <img
                src="/images/service-microfusion-new.jpg"
                alt="Gloved esthetician using a micro-infusion pen on a client's face"
                className="absolute inset-0 object-cover"
                style={{ width: "100%", height: "100%" }}
                loading="eager"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
