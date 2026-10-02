"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ArrowUpRight, Phone, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const services = [
  {
    number: "01",
    title: "Facial Treatments",
    description:
      "All facial treatments are customized to each client's needs from the Acne Eliminator to Microdermabrasion to everything in between we offer an array of services to hydrate, calm and clarify your skin.",
    tags: ["Deep Cleanse", "Hydration", "Acne Care", "Microdermabrasion"],
    image: "/images/service-facial.jpg",
    alt: "Professional facial treatment with gentle skincare application",
    href: "/services/facial-treatments",
  },
  {
    number: "02",
    title: "Micro-Infusion Facial",
    description:
      "More than just a passing trend, Micro-Infusion Facial is a proven way to boost your collagen production, tighten skin, reduce fine lines, reduce large pores and resurface skin.",
    tags: ["Collagen Boost", "Fine Lines", "Pore Refining", "Skin Resurfacing"],
    image: "/images/service-microfusion.jpg",
    alt: "Micro-Infusion Facial before and after results",
    href: "/services/micro-infusion-facial",
  },
  {
    number: "03",
    title: "Photo Facial / IPL",
    description:
      "Intense pulsed light (IPL) is a cosmetic skin treatment that offers skin rejuvenation, lightens brown spots and removes vascular redness from the skin making it a great treatment for rosacea skin.",
    tags: ["Brown Spots", "Rosacea", "Sun Damage", "Rejuvenation"],
    image: "/images/service-ipl.jpg",
    alt: "IPL photo facial treatment for skin rejuvenation",
    href: "/services/ipl-treatments",
  },
  {
    number: "04",
    title: "Laser Hair Removal",
    description:
      "If you're not happy with shaving and tweezing to remove unwanted hair, we offer laser hair removal to suit every skin type. Pain-free treatments with our Motus AX technology deliver smooth results in fewer sessions.",
    tags: ["Pain-Free", "All Skin Types", "Motus AX", "Fewer Sessions"],
    image: "/images/service-laser.jpg",
    alt: "Professional laser hair removal treatment session",
    href: "/services/laser-hair-removal",
  },
  {
    number: "05",
    title: "Lash Services",
    description:
      "Our lash specialists offer Keratin Lash Lifts for beautifully curled natural lashes and professional lash tints. Our technicians are true artists whose work speaks for itself — effortless, everyday beauty that lasts up to 6–8 weeks.",
    tags: ["Lash Lift", "Lash Tint", "Natural Lashes", "Keratin"],
    image: "/images/service-lash-new.jpg",
    alt: "Lash lift and tint before and after results",
    href: "/services/lash-services",
  },
];

function ServiceCard({
  service,
  index,
  reversed,
}: {
  service: (typeof services)[0];
  index: number;
  reversed: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.9,
        delay: 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`grid overflow-hidden rounded-[28px] border border-border-subtle bg-dark-secondary shadow-[0_4px_40px_rgba(0,0,0,0.3)] lg:grid-cols-2 ${
        reversed ? "lg:[direction:rtl]" : ""
      }`}
    >
      <div className="relative min-h-[280px] overflow-hidden lg:min-h-[480px] lg:[direction:ltr]">
        <img
          src={service.image}
          alt={service.alt}
          className="absolute inset-0 object-cover transition-transform duration-700 hover:scale-105"
          style={{ width: "100%", height: "100%" }}
          loading="lazy"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t from-dark-secondary/60 via-transparent to-transparent lg:bg-gradient-to-r ${
            reversed
              ? "lg:from-transparent lg:to-dark-secondary/80"
              : "lg:from-dark-secondary/80 lg:to-transparent"
          }`}
        />
        <div className="absolute left-6 top-6 lg:left-8 lg:top-8">
          <span className="heading-serif select-none text-[56px] leading-[0.85] text-ivory/[0.12] md:text-[72px] lg:text-[88px]">
            {service.number}
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-center p-8 md:p-10 lg:p-14 lg:[direction:ltr]">
        <span className="eyebrow mb-4 block">Treatment</span>
        <h3 className="heading-serif mb-5 text-3xl md:text-4xl lg:text-[44px]">
          {service.title}
        </h3>
        <p className="mb-8 max-w-md font-sans text-[15px] leading-[1.8] text-body-muted">
          {service.description}
        </p>
        <div className="mb-8 flex flex-wrap gap-2.5">
          {service.tags.map((tag) => (
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
            className="inline-flex rounded-full bg-rose px-7 py-3 font-sans text-[14px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover"
          >
            Book This Treatment
          </a>
          <a
            href={service.href}
            {...(service.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group/link inline-flex items-center gap-2 font-sans text-[13px] font-medium text-body-muted transition-colors duration-300 hover:text-ivory"
          >
            Learn More
            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
            />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
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

          <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 flex items-center gap-3 font-sans text-[13px] text-body-muted"
            >
              <a
                href="/"
                className="transition-colors duration-300 hover:text-ivory"
              >
                Home
              </a>
              <span className="text-border-subtle">/</span>
              <span className="text-ivory">Services</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="heading-serif text-5xl md:text-6xl lg:text-[76px]"
            >
              Our{" "}
              <span className="heading-serif-italic">Treatments</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-lg font-sans text-base leading-relaxed text-body-muted md:text-lg"
            >
              From custom facials to advanced laser treatments, every service is
              tailored to your unique skin goals. Discover what we can do for
              you.
            </motion.p>
          </div>
        </section>

        {/* Services List */}
        <section className="bg-dark-primary py-20 md:py-28 lg:py-36">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
            <div className="space-y-12 md:space-y-16 lg:space-y-20">
              {services.map((service, i) => (
                <ServiceCard
                  key={service.number}
                  service={service}
                  index={i}
                  reversed={i % 2 !== 0}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Coming Soon Teaser */}
        <section className="bg-dark-deep py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden rounded-[28px] border border-rose/20 bg-dark-secondary p-10 text-center md:p-14 lg:p-20"
            >
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-rose/10">
                <Sparkles size={24} className="text-rose" />
              </div>
              <p className="eyebrow mb-4">Coming Soon</p>
              <h2 className="heading-serif mb-5 text-3xl md:text-4xl lg:text-5xl">
                Laser Focus Course
              </h2>
              <p className="mx-auto mb-8 max-w-md font-sans text-[15px] leading-[1.8] text-body-muted">
                We&apos;re developing an advanced training course for skincare
                professionals. Stay tuned for enrollment details.
              </p>
              <a
                href="https://skinstudioithaca.com/services/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-sans text-[13px] font-semibold uppercase tracking-[0.14em] text-rose transition-colors duration-300 hover:text-ivory"
              >
                Learn More on Our Website
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300"
                />
              </a>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
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
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="eyebrow mb-6">Ready to Begin?</p>
                  <h2 className="heading-serif mb-6 text-4xl md:text-5xl lg:text-[52px]">
                    Not Sure Which
                    <br />
                    Treatment Is{" "}
                    <span className="heading-serif-italic">Right?</span>
                  </h2>
                  <p className="mb-10 max-w-md font-sans text-base leading-[1.8] text-body-muted">
                    Book a free consultation and let our licensed professionals
                    create a personalized treatment plan designed around your
                    unique skin goals.
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    <a
                      href="/book"
                      className="inline-flex rounded-full bg-rose px-8 py-3.5 font-sans text-[15px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover"
                    >
                      Book a Consultation
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
