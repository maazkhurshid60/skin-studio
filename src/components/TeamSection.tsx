"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
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

const ease = [0.22, 1, 0.36, 1] as const;

function TeamCard({
  member,
  index,
}: {
  member: (typeof team)[number];
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const hasBio = Boolean(member.bio);

  const hoverCapable = () => window.matchMedia("(hover: hover)").matches;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease }}
      className="group relative w-[80vw] max-w-[340px] shrink-0 snap-start md:w-[46vw] md:max-w-[400px] lg:w-[400px]"
      onMouseEnter={() => hasBio && hoverCapable() && setOpen(true)}
      onMouseLeave={() => hasBio && hoverCapable() && setOpen(false)}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-dark-primary">
        <img
          src={member.image}
          alt={member.alt}
          draggable={false}
          className="absolute inset-0 select-none object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          style={{ width: "100%", height: "100%" }}
          loading="eager"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark-primary/70 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-dark-primary/50 px-3 py-1 font-sans text-[11px] font-semibold tracking-[0.18em] text-ivory/90 backdrop-blur-md">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="absolute inset-x-3 bottom-3 rounded-xl border border-white/10 bg-dark-primary/75 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md transition-colors duration-500">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="heading-serif text-[24px] leading-tight text-ivory">
                {member.name}
              </h3>
              <p className="mt-1.5 font-sans text-[11px] font-semibold uppercase leading-[1.5] tracking-[0.18em] text-rose">
                {member.role}
              </p>
            </div>
            {hasBio && (
              <button
                type="button"
                aria-expanded={open}
                aria-label={`Read ${member.name}'s bio`}
                onClick={() => setOpen((v) => !v)}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                  open
                    ? "rotate-45 border-rose bg-rose text-ivory"
                    : "border-white/20 text-ivory/80 hover:border-rose/60 hover:text-ivory"
                }`}
              >
                <Plus size={16} aria-hidden="true" />
              </button>
            )}
          </div>
          {hasBio && (
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <p className="overflow-hidden font-sans text-[13.5px] leading-[1.7] text-body-muted">
                <span className="block pt-4">{member.bio}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function TeamSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0.25);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? el.scrollLeft / max : 1;
    setProgress(Math.max(0.25, p));
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= max - 4);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("article");
    const gap = parseFloat(getComputedStyle(el).columnGap || "0");
    const step = card ? card.getBoundingClientRect().width + gap : 0;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const arrowClass =
    "flex h-12 w-12 items-center justify-center rounded-full border border-border-subtle text-ivory transition-all duration-300 hover:border-rose hover:bg-rose disabled:pointer-events-none disabled:opacity-30";

  return (
    <section
      id="team"
      className="overflow-hidden bg-dark-secondary py-28 md:py-36 lg:py-44"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="mb-12 flex flex-col gap-8 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel text="Meet the Team" />
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease }}
              className="heading-serif text-4xl md:text-5xl lg:text-6xl"
            >
              Experts Behind
              <br />
              Your <span className="heading-serif-italic">Glow.</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="hidden items-center gap-5 md:flex"
          >
            <div className="flex gap-2.5">
              <button
                type="button"
                aria-label="Previous team member"
                onClick={() => scrollByCard(-1)}
                disabled={atStart}
                className={arrowClass}
              >
                <ArrowLeft size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next team member"
                onClick={() => scrollByCard(1)}
                disabled={atEnd}
                className={arrowClass}
              >
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={update}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Team members"
        className="flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto pb-2 outline-none [scrollbar-width:none] active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-rose/40 md:gap-6 [&::-webkit-scrollbar]:hidden [--edge:1.5rem] lg:[--edge:max(3rem,calc((100%-1400px)/2+3rem))]"
        style={{
          paddingInline: "var(--edge)",
          scrollPaddingInline: "var(--edge)",
        }}
      >
        {team.map((member, i) => (
          <TeamCard key={member.name} member={member} index={i} />
        ))}
      </div>

      <div className="mx-auto mt-12 flex max-w-[1400px] flex-col gap-8 px-6 md:mt-14 md:flex-row md:items-center md:justify-between lg:px-12">
        <div
          className="h-px w-full max-w-sm overflow-hidden bg-border-subtle"
          aria-hidden="true"
        >
          <div
            className="h-full origin-left bg-rose transition-transform duration-300 ease-out"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease }}
          className="flex flex-wrap items-center gap-5"
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
