"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionLabel from "@/components/SectionLabel";
import Testimonials from "@/components/Testimonials";
import BookingCTA from "@/components/BookingCTA";

const ease = [0.22, 1, 0.36, 1] as const;

const benefits = [
  "Reduces the signs of visible aging such as wrinkles and fine lines",
  "Reduces enlarged pores and acne scars",
  "Enhances texture, tone, and elasticity for healthier looking skin",
  "Boosts collagen production and tightens skin",
  "Customized treatment plans tailored to individual concerns",
];

const tags = ["Collagen Boost", "Fine Lines", "Pore Refining", "Skin Resurfacing", "Anti-Aging"];

export default function MicroInfusionFacialPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true, margin: "-80px" });

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative flex min-h-[60vh] items-end overflow-hidden pb-20 pt-32 md:min-h-[50vh] md:pb-24 lg:pb-28">
          <div className="absolute inset-0">
            <img
              src="/images/service-microfusion-new.jpg"
              alt="Micro-Infusion Facial treatment at Skin Studio Ithaca"
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
              <a href="/" className="transition-colors duration-300 hover:text-ivory">Home</a>
              <span className="text-border-subtle">/</span>
              <a href="/services" className="transition-colors duration-300 hover:text-ivory">Services</a>
              <span className="text-border-subtle">/</span>
              <span className="text-ivory">Micro-Infusion Facial</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease }}
              className="heading-serif text-5xl md:text-6xl lg:text-[76px]"
            >
              Micro-Infusion <span className="heading-serif-italic">Facial</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease }}
              className="mt-6 max-w-lg font-sans text-base leading-relaxed text-body-muted md:text-lg"
            >
              A proven way to boost collagen production, tighten skin, reduce
              fine lines, minimize pores, and resurface skin for a radiant,
              youthful complexion.
            </motion.p>
          </div>
        </section>

        {/* Service Detail */}
        <section className="bg-dark-secondary py-28 md:py-36 lg:py-44">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <div
              ref={contentRef}
              className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.9, ease }}
                className="relative overflow-hidden rounded-2xl"
              >
                <img
                  src="/images/service-micro.jpg"
                  alt="Micro-Infusion Facial results"
                  className="w-full object-cover"
                  style={{ aspectRatio: "4/5" }}
                  loading="lazy"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2, ease }}
              >
                <SectionLabel text="Targeted Skin Renewal" />
                <h2 className="heading-serif mb-6 text-4xl md:text-5xl lg:text-[56px]">
                  Rejuvenate Your <span className="heading-serif-italic">Skin</span>
                </h2>
                <p className="mb-6 font-sans text-base leading-[1.8] text-body-muted">
                  Micro-Infusion Facial can reduce the signs of visible aging
                  such as wrinkles, fine lines, enlarged pores and reduce acne
                  scars. It enhances texture, tone, and elasticity, leading to
                  healthier looking skin.
                </p>
                <p className="mb-8 font-sans text-base leading-[1.8] text-body-muted">
                  Our estheticians will assess your facial concerns and create a
                  customized treatment plan that may include a combination of
                  therapies to achieve optimal results. This plan will also
                  include recommendations for pre-treatment skincare or lifestyle
                  changes to enhance results.
                </p>

                <div className="mb-8 space-y-4">
                  {benefits.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose" />
                      <p className="font-sans text-[15px] leading-relaxed text-ivory/90">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mb-10 flex flex-wrap gap-2.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border-subtle px-4 py-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-body-muted/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="/book"
                    className="inline-flex rounded-full bg-rose px-8 py-3.5 font-sans text-[15px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover"
                  >
                    Book This Treatment
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
          </div>
        </section>

        <Testimonials showCTAs={false} />
        <BookingCTA />
      </main>
      <Footer />
    </>
  );
}
