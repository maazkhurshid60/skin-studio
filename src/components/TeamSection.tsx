"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import SectionLabel from "./SectionLabel";

const team = [
  {
    name: "Natalie Sweeney",
    role: "Lead Esthetician & Co-Founder",
    bio: "With over 26 years of experience in medical aesthetics, Natalie specializes in advanced laser treatments and skin rejuvenation. Her passion for science-backed skincare drives every consultation.",
    image: "/images/natalie-new.webp",
    alt: "Natalie Sweeney, Lead Esthetician and Co-Founder at Skin Studio Ithaca",
  },
  {
    name: "Nane Lafleur",
    role: "Licensed Aesthetician",
    bio: "Nane brings warmth and expertise to every treatment. Specializing in customized facials and acne protocols, she has helped hundreds of clients achieve clear, glowing skin.",
    image: "/images/nana-new.jpg",
    alt: "Nane Lafleur, Licensed Aesthetician at Skin Studio Ithaca",
  },
  {
    name: "Christie",
    role: "Massage Therapist",
    bio: "",
    image: "/images/christie.jpg",
    alt: "Christie, Massage Therapist at Skin Studio Ithaca",
  },
  {
    name: "Linda Roman",
    role: "Licensed Aesthetician & Lash Specialist",
    bio: "Linda is our resident lash and skincare expert, bringing meticulous care and a warm touch to every appointment. Her attention to detail ensures beautiful, natural-looking results.",
    image: "/images/linda-new.jpg",
    alt: "Linda Roman, Licensed Aesthetician and Lash Specialist at Skin Studio Ithaca",
  },
];

export default function TeamSection() {
  return (
    <section id="team" className="bg-dark-secondary py-28 md:py-36 lg:py-44">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-16 text-center md:mb-20">
          <SectionLabel text="Meet the Team" align="center" />
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="heading-serif text-4xl md:text-5xl lg:text-6xl"
          >
            Experts Behind
            <br />
            Your <span className="heading-serif-italic">Glow.</span>
          </motion.h2>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-4 md:gap-10">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.8,
                delay: i * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group"
            >
              <div className="relative mb-6 aspect-[3/4] overflow-hidden rounded-lg">
                <img
                  src={member.image}
                  alt={member.alt}
                  className="absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  style={{ width: "100%", height: "100%" }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-primary/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-rose/80 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:opacity-100">
                  <ArrowUpRight size={18} className="text-ivory" />
                </div>
              </div>

              <h3 className="heading-serif mb-1 text-2xl text-ivory md:text-[26px]">
                {member.name}
              </h3>
              <p className="mb-3 font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-rose">
                {member.role}
              </p>
              {member.bio && (
                <p className="font-sans text-[14px] leading-[1.75] text-body-muted">
                  {member.bio}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 flex flex-wrap items-center justify-center gap-5"
        >
          <a
            href="/team"
            className="inline-flex rounded-full bg-rose px-8 py-3.5 font-sans text-[15px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover"
          >
            Meet the Full Team
          </a>
          <a
            href="/team"
            className="group/link inline-flex items-center gap-2 font-sans text-[14px] font-medium text-body-muted transition-colors duration-300 hover:text-ivory"
          >
            Learn More About Us
            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover/link:translate-x-1"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
