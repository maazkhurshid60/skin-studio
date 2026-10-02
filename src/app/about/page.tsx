"use client";

import { motion } from "framer-motion";
import { ArrowRight, Phone, Award, Heart, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionLabel from "@/components/SectionLabel";
import Testimonials from "@/components/Testimonials";

const ease = [0.22, 1, 0.36, 1] as const;

const highlights = [
  { icon: Award, value: "23+", label: "Years of Experience" },
  { icon: Heart, value: "1000+", label: "Happy Clients" },
  { icon: Zap, value: "10+", label: "Years Laser Certified" },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative flex min-h-[60vh] items-end overflow-hidden pb-20 pt-32 md:min-h-[50vh] md:pb-24 lg:pb-28">
          <div className="absolute inset-0">
            <img
              src="/images/about-treatment.jpg"
              alt="Skin Studio Ithaca treatment room"
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
              <span className="text-ivory">About Us</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease }}
              className="heading-serif text-5xl md:text-6xl lg:text-[76px]"
            >
              About <span className="heading-serif-italic">Us</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease }}
              className="mt-6 max-w-lg font-sans text-base leading-relaxed text-body-muted md:text-lg"
            >
              Serious skincare. Serious results. Meet the expertise and passion
              behind Skin Studio Ithaca.
            </motion.p>
          </div>
        </section>

        {/* Meet Natalie */}
        <section className="bg-dark-secondary py-28 md:py-36 lg:py-44">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.9, ease }}
                className="relative"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.4)]">
                  <img
                    src="/images/natalie-new.webp"
                    alt="Natalie Sweeney, Owner and Lead Esthetician at Skin Studio Ithaca"
                    className="aspect-[3/4] w-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -right-3 top-[15%] z-0 h-[70%] w-[70%] rounded-full bg-rose/[0.04] blur-3xl" />
              </motion.div>

              <div>
                <SectionLabel text="Meet Natalie" />

                <motion.h2
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.8, ease }}
                  className="heading-serif mb-3 text-4xl md:text-5xl lg:text-6xl"
                >
                  Owner &{" "}
                  <span className="heading-serif-italic">Esthetician</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: 0.1, ease }}
                  className="mb-8 font-sans text-[15px] font-semibold italic text-rose"
                >
                  Natalie is ready to take your skincare to the next level!
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: 0.15, ease }}
                  className="mb-6 max-w-lg font-sans text-base leading-[1.8] text-body-muted"
                >
                  Natalie brings 23 years of aesthetics experience to Skin
                  Studio. She has an array of experience — from high-end resort
                  spas, such as the Four Seasons, to various physicians&apos;
                  offices, including plastic surgeons, to medical spa business
                  consultation. She has been certified in laser technology for 10
                  years.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: 0.25, ease }}
                  className="mb-10 max-w-lg font-sans text-base leading-[1.8] text-body-muted"
                >
                  Natalie loves solving people&apos;s skin issues — she suffered
                  with acne for years, so she knows her clients&apos; pain and
                  frustration firsthand. Helping boost someone&apos;s confidence
                  and letting their inner beauty shine rather than hiding behind
                  makeup is a passion of hers. She takes skincare very seriously
                  — her motto is &ldquo;serious skincare, serious results&rdquo;
                  and she stands by her word.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: 0.35, ease }}
                  className="flex flex-wrap items-center gap-4"
                >
                  <a
                    href="/book"
                    className="inline-flex rounded-full bg-rose px-8 py-3.5 font-sans text-[15px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover"
                  >
                    Book a Consultation
                  </a>
                  <a
                    href="/#team"
                    className="group/link inline-flex items-center gap-2 font-sans text-[14px] font-medium text-body-muted transition-colors duration-300 hover:text-ivory"
                  >
                    Meet the Full Team
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover/link:translate-x-1"
                    />
                  </a>
                </motion.div>
              </div>
            </div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
              className="mt-20 grid grid-cols-3 gap-8 border-t border-border-subtle pt-12 md:mt-28"
            >
              {highlights.map((item) => (
                <div key={item.label} className="text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose/10">
                    <item.icon size={18} className="text-rose" />
                  </div>
                  <p className="heading-serif text-3xl text-rose md:text-4xl lg:text-5xl">
                    {item.value}
                  </p>
                  <p className="mt-2 font-sans text-[13px] font-medium tracking-wide text-body-muted md:text-[14px]">
                    {item.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Philosophy / Mission */}
        <section className="bg-dark-primary py-28 md:py-36 lg:py-44">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease }}
              >
                <SectionLabel text="Our Philosophy" />
                <h2 className="heading-serif text-4xl md:text-5xl lg:text-6xl">
                  Serious Skincare.
                  <br />
                  Serious{" "}
                  <span className="heading-serif-italic">Results.</span>
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.15, ease }}
                className="flex flex-col justify-center"
              >
                <p className="mb-6 font-sans text-base leading-[1.85] text-body-muted md:text-[17px]">
                  At Skin Studio, every visit is designed to be restorative — a
                  space where advanced skincare meets genuine comfort. Our
                  signature facials are a hybrid of relaxing treatment with
                  powerful, lasting results.
                </p>
                <p className="font-sans text-base leading-[1.85] text-body-muted md:text-[17px]">
                  Whether you&apos;re addressing acne, aging, skin texture, or
                  simply seeking a moment of calm — our team takes skincare
                  seriously so you can leave feeling confident, renewed, and
                  truly cared for.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <Testimonials showCTAs={false} />

        {/* Booking CTA */}
        <section className="relative overflow-hidden bg-dark-primary py-28 md:py-36 lg:py-44">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <div className="grid overflow-hidden rounded-xl lg:grid-cols-2">
              <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[500px]">
                <img
                  src="/images/cta-booking.jpg"
                  alt="Radiant, healthy skin — the result of expert skincare"
                  className="absolute inset-0 object-cover"
                  style={{ width: "100%", height: "100%" }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-deep/60 to-transparent lg:bg-gradient-to-r" />
              </div>

              <div className="flex flex-col justify-center bg-dark-deep p-10 md:p-14 lg:p-16">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.8, ease }}
                >
                  <p className="eyebrow mb-6">Begin Your Journey</p>
                  <h2 className="heading-serif mb-6 text-4xl md:text-5xl lg:text-[56px]">
                    Ready to Experience
                    <br />
                    the <span className="heading-serif-italic">Difference?</span>
                  </h2>
                  <p className="mb-10 max-w-md font-sans text-base leading-[1.8] text-body-muted">
                    Book your consultation today and discover the treatment plan
                    designed for your unique skin. Free consultations included
                    with all skincare services.
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    <a
                      href="/book"
                      className="inline-flex rounded-full bg-rose px-8 py-3.5 font-sans text-[15px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover"
                    >
                      Book Now
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
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
