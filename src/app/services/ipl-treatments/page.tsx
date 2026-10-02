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
  "Skin rejuvenation and improved complexion",
  "Brown spot and sun damage removal",
  "Facial vein and broken capillary treatment",
  "Ideal for rosacea and vascular redness",
  "Acts on deeper layers of the skin for lasting results",
];

const tags = ["Brown Spots", "Rosacea", "Sun Damage", "Skin Rejuvenation", "Broken Capillaries"];

export default function IPLTreatmentsPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true, margin: "-80px" });
  const baRef = useRef<HTMLDivElement>(null);
  const baInView = useInView(baRef, { once: true, margin: "-80px" });

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative flex min-h-[60vh] items-end overflow-hidden pb-20 pt-32 md:min-h-[50vh] md:pb-24 lg:pb-28">
          <div className="absolute inset-0">
            <img
              src="/images/service-ipl.jpg"
              alt="IPL Photo Facial treatment at Skin Studio Ithaca"
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
              <span className="text-ivory">Photo Facial / IPL</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease }}
              className="heading-serif text-5xl md:text-6xl lg:text-[76px]"
            >
              Photo <span className="heading-serif-italic">Facial</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease }}
              className="mt-6 max-w-lg font-sans text-base leading-relaxed text-body-muted md:text-lg"
            >
              Intense pulsed light therapy offers skin rejuvenation, lightens
              brown spots, and removes vascular redness — an ideal treatment for
              rosacea and sun damage.
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
                  src="/images/service-ipl.jpg"
                  alt="IPL Photofacial treatment for skin rejuvenation"
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
                <SectionLabel text="Light-Based Rejuvenation" />
                <h2 className="heading-serif mb-6 text-4xl md:text-5xl lg:text-[56px]">
                  IPL <span className="heading-serif-italic">Photofacial</span>
                </h2>
                <p className="mb-6 font-sans text-base leading-[1.8] text-body-muted">
                  IPL Photofacials, also known as Pulsed Light Therapy, involves
                  a handheld device that emits a pulse of broad-spectrum light
                  through direct contact with the skin. It acts on deeper layers
                  of the skin, making it ideal for treating broken capillaries,
                  sun damage, and other impurities.
                </p>
                <p className="mb-8 font-sans text-base leading-[1.8] text-body-muted">
                  Skin rejuvenation, brown spot removal, and facial veins all
                  disappear with IPL Photofacial.
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

        {/* Before & After */}
        <section className="bg-dark-primary py-28 md:py-36 lg:py-44">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <div className="mb-16 text-center">
              <SectionLabel text="Real Results" align="center" />
              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease }}
                className="heading-serif text-4xl md:text-5xl lg:text-[56px]"
              >
                Before & <span className="heading-serif-italic">After</span>
              </motion.h2>
            </div>

            <motion.div
              ref={baRef}
              initial={{ opacity: 0, y: 30 }}
              animate={baInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease }}
              className="grid gap-6 md:grid-cols-2"
            >
              <div className="overflow-hidden rounded-2xl border border-border-subtle">
                <div className="bg-dark-secondary/60 px-5 py-3">
                  <span className="font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-body-muted">
                    Before
                  </span>
                </div>
                <img
                  src="/images/ba-photofacial-before.jpg"
                  alt="Skin before BBL Photofacial treatment"
                  className="w-full object-cover"
                  style={{ aspectRatio: "4/3" }}
                  loading="lazy"
                />
              </div>
              <div className="overflow-hidden rounded-2xl border border-border-subtle">
                <div className="bg-dark-secondary/60 px-5 py-3">
                  <span className="font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-body-muted">
                    After
                  </span>
                </div>
                <img
                  src="/images/ba-photofacial-after.jpg"
                  alt="Skin after BBL Photofacial treatment"
                  className="w-full object-cover"
                  style={{ aspectRatio: "4/3" }}
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </section>

        <Testimonials showCTAs={false} />
        <BookingCTA />
      </main>
      <Footer />
    </>
  );
}
