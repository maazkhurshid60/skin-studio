"use client";

import { motion } from "framer-motion";
import { Phone, Sparkles, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionLabel from "@/components/SectionLabel";
import Testimonials from "@/components/Testimonials";

const ease = [0.22, 1, 0.36, 1] as const;

const offers = [
  {
    title: "Facial Consultation",
    price: "$25",
    valued: "Valued at $100",
    icon: Sparkles,
    description:
      "Experience personalized skin analysis tailored to your unique needs. Consultations focus on addressing concerns such as acne, signs of aging, and skin discoloration. We provide customized recommendations to help you achieve healthy, radiant skin.",
    tags: ["Skin Analysis", "Personalized Plan", "All Skin Types"],
    image: "/images/service-facial.jpg",
    alt: "Professional facial treatment at Skin Studio Ithaca",
  },
  {
    title: "Laser Hair Consultation",
    price: "$25",
    valued: null,
    icon: Zap,
    description:
      "Laser hair removal for all skin types. Discover if laser hair removal is right for you with a comprehensive consultation. We assess your suitability for the treatment while providing transparent pricing information. Our goal is to ensure you feel informed and confident in your decision for smooth, hair-free skin.",
    tags: ["All Skin Types", "Transparent Pricing", "Motus AX"],
    image: "/images/service-laser.jpg",
    alt: "Professional laser hair removal treatment at Skin Studio Ithaca",
  },
];

export default function OffersPage() {
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
              <span className="text-ivory">Offers</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease }}
              className="heading-serif text-5xl md:text-6xl lg:text-[76px]"
            >
              Special <span className="heading-serif-italic">Offers</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease }}
              className="mt-6 max-w-lg font-sans text-base leading-relaxed text-body-muted md:text-lg"
            >
              Discover our consultation offers and take the first step toward
              healthier, more radiant skin — with a personalized plan designed
              just for you.
            </motion.p>
          </div>
        </section>

        {/* Offer Cards */}
        <section className="bg-dark-secondary py-28 md:py-36 lg:py-44">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
            <div className="mb-16 text-center md:mb-20">
              <SectionLabel text="Current Offers" align="center" />
              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease }}
                className="heading-serif text-4xl md:text-5xl lg:text-6xl"
              >
                Start Your Skin{" "}
                <span className="heading-serif-italic">Journey.</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="mx-auto mt-6 max-w-md font-sans text-[15px] leading-[1.75] text-body-muted"
              >
                Book a consultation and let our licensed professionals create a
                personalized treatment plan for you.
              </motion.p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:gap-10">
              {offers.map((offer, i) => (
                <motion.div
                  key={offer.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.8, delay: i * 0.15, ease }}
                  className="group overflow-hidden rounded-[28px] border border-border-subtle bg-dark-primary shadow-[0_4px_40px_rgba(0,0,0,0.3)] transition-all duration-500 hover:border-rose/20 hover:shadow-[0_8px_60px_rgba(194,90,131,0.1)]"
                >
                  {/* Image header */}
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={offer.image}
                      alt={offer.alt}
                      className="absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      style={{ width: "100%", height: "100%" }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-primary via-dark-primary/30 to-transparent" />

                    {/* Price badge */}
                    <div className="absolute bottom-6 left-8 md:left-10">
                      <div className="flex items-baseline gap-2.5">
                        <span className="heading-serif text-5xl text-ivory drop-shadow-lg md:text-6xl">
                          {offer.price}
                        </span>
                        {offer.valued && (
                          <span className="rounded-full bg-rose/90 px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-wide text-ivory backdrop-blur-sm">
                            {offer.valued}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="px-8 pb-10 pt-8 md:px-10">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose/10">
                        <offer.icon size={18} className="text-rose" />
                      </div>
                      <h3 className="heading-serif text-2xl text-ivory md:text-[28px]">
                        {offer.title}
                      </h3>
                    </div>

                    <p className="mb-8 font-sans text-[15px] leading-[1.8] text-body-muted">
                      {offer.description}
                    </p>

                    <div className="mb-8 flex flex-wrap gap-2.5">
                      {offer.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border-subtle px-4 py-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-body-muted/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <a
                      href="/book"
                      className="inline-flex w-full items-center justify-center rounded-full bg-rose px-8 py-3.5 font-sans text-[15px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover"
                    >
                      Book This Consultation
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
              className="mt-12 text-center font-sans text-[14px] text-body-muted/60"
            >
              All consultations are applied toward the cost of your first
              treatment.
            </motion.p>
          </div>
        </section>

        <Testimonials showCTAs={false} />

        {/* Booking CTA */}
        <section className="relative overflow-hidden bg-dark-primary py-28 md:py-36 lg:py-44">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
            <div className="grid overflow-hidden rounded-xl lg:grid-cols-2">
              <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[480px]">
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
                  <h2 className="heading-serif mb-6 text-4xl md:text-5xl lg:text-[52px]">
                    Ready to Get
                    <br />
                    <span className="heading-serif-italic">Started?</span>
                  </h2>
                  <p className="mb-10 max-w-md font-sans text-base leading-[1.8] text-body-muted">
                    Take advantage of our consultation offers and begin your
                    journey to healthier, more radiant skin. Book today — your
                    skin will thank you.
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
