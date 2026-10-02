"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, ArrowUpRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionLabel from "@/components/SectionLabel";
import Testimonials from "@/components/Testimonials";
import BookingCTA from "@/components/BookingCTA";

const ease = [0.22, 1, 0.36, 1] as const;

const teamMembers = [
  {
    name: "Nane Lafleur",
    role: "Licensed Aesthetician",
    bio: "Nane brings warmth and expertise to every treatment. Specializing in customized facials and acne protocols, she has helped hundreds of clients achieve clear, glowing skin.",
    image: "/images/nana-new.jpg",
    alt: "Nane Lafleur, Licensed Aesthetician at Skin Studio Ithaca",
    tags: ["Custom Facials", "Acne Care", "Skin Analysis"],
  },
  {
    name: "Christie",
    role: "Massage Therapist",
    bio: "",
    image: "/images/christie.jpg",
    alt: "Christie, Massage Therapist at Skin Studio Ithaca",
    tags: ["Massage Therapy", "Relaxation", "Wellness"],
  },
  {
    name: "Linda Roman",
    role: "Licensed Aesthetician & Lash Specialist",
    bio: "Linda is our resident lash and skincare expert, bringing meticulous care and a warm touch to every appointment. Her attention to detail ensures beautiful, natural-looking results.",
    image: "/images/linda-new.jpg",
    alt: "Linda Roman, Licensed Aesthetician and Lash Specialist at Skin Studio Ithaca",
    tags: ["Lash Services", "Skincare", "Detail-Oriented"],
  },
];

function TeamCard({
  member,
  index,
}: {
  member: (typeof teamMembers)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease }}
      className="group"
    >
      <div className="relative mb-6 aspect-[3/4] overflow-hidden rounded-2xl">
        <img
          src={member.image}
          alt={member.alt}
          className="absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          style={{ width: "100%", height: "100%" }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-primary/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <h3 className="heading-serif mb-1 text-[26px] text-ivory">
        {member.name}
      </h3>
      <p className="mb-3 font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-rose">
        {member.role}
      </p>
      {member.bio && (
        <p className="mb-4 font-sans text-[14px] leading-[1.75] text-body-muted">
          {member.bio}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {member.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border-subtle px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-body-muted/70"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function TeamPage() {
  const founderRef = useRef<HTMLDivElement>(null);
  const founderInView = useInView(founderRef, { once: true, margin: "-80px" });

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
              <span className="text-ivory">Our Team</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease }}
              className="heading-serif text-5xl md:text-6xl lg:text-[76px]"
            >
              Meet the <span className="heading-serif-italic">Team</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease }}
              className="mt-6 max-w-lg font-sans text-base leading-relaxed text-body-muted md:text-lg"
            >
              The professionals behind your skin journey. Every treatment is
              delivered by licensed specialists who combine expertise with
              genuine care.
            </motion.p>
          </div>
        </section>

        {/* Founder Feature — Natalie */}
        <section className="bg-dark-secondary py-28 md:py-36 lg:py-44">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <div
              ref={founderRef}
              className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={founderInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.9, ease }}
                className="relative overflow-hidden rounded-2xl"
              >
                <img
                  src="/images/natalie-sweeney-about.jpg"
                  alt="Natalie Sweeney, Owner and Lead Esthetician at Skin Studio Ithaca"
                  className="w-full object-cover"
                  style={{ aspectRatio: "4/5" }}
                  loading="eager"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-primary/60 to-transparent p-8">
                  <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-rose">
                    Founder
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={founderInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2, ease }}
              >
                <SectionLabel text="Owner & Lead Esthetician" />
                <h2 className="heading-serif mb-2 text-4xl md:text-5xl lg:text-[56px]">
                  Natalie{" "}
                  <span className="heading-serif-italic">Sweeney</span>
                </h2>
                <p className="mb-6 font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-rose">
                  Lead Esthetician & Co-Founder
                </p>

                <div className="space-y-4 font-sans text-[15px] leading-[1.85] text-body-muted">
                  <p>
                    With over 26 years of aesthetics experience, Natalie brings
                    a depth of knowledge that spans high-end resort spas like
                    the Four Seasons, physicians&apos; offices including plastic
                    surgeons, and medical spa consultation.
                  </p>
                  <p>
                    Certified in laser technology for over a decade, Natalie
                    specializes in advanced laser treatments and skin
                    rejuvenation. Her passion for science-backed skincare drives
                    every consultation.
                  </p>
                  <p>
                    Having dealt with acne herself for years, Natalie understands
                    her clients&apos; frustration firsthand. Helping boost
                    someone&apos;s confidence and letting their inner beauty
                    shine is what drives her every day.
                  </p>
                </div>

                <div className="mt-8 rounded-xl border border-border-subtle bg-dark-primary/30 p-6">
                  <p className="heading-serif-italic text-[18px] text-ivory/80">
                    &ldquo;Serious skincare, serious results.&rdquo;
                  </p>
                  <p className="mt-2 font-sans text-[13px] text-body-muted/60">
                    — Natalie&apos;s motto
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-2.5">
                  {[
                    "Medical Aesthetics",
                    "Laser Treatments",
                    "Skin Rejuvenation",
                    "Acne Solutions",
                    "10+ Years Laser Certified",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border-subtle px-4 py-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-body-muted/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <a
                    href="/book"
                    className="inline-flex rounded-full bg-rose px-8 py-3.5 font-sans text-[15px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover"
                  >
                    Book with Natalie
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

        {/* Team Grid */}
        <section className="bg-dark-primary py-28 md:py-36 lg:py-44">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
            <div className="mb-16 text-center md:mb-20">
              <SectionLabel text="The Team" align="center" />
              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease }}
                className="heading-serif text-4xl md:text-5xl lg:text-6xl"
              >
                Experts Behind
                <br />
                Your <span className="heading-serif-italic">Glow</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: 0.15, ease }}
                className="mx-auto mt-6 max-w-lg font-sans text-[15px] leading-relaxed text-body-muted"
              >
                Each member of our team is dedicated to delivering exceptional
                care and helping you achieve your skin goals.
              </motion.p>
            </div>

            <div className="grid gap-10 md:grid-cols-3 md:gap-8">
              {teamMembers.map((member, i) => (
                <TeamCard key={member.name} member={member} index={i} />
              ))}
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
