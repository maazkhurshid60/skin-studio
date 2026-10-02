"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ImageBreak() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section ref={ref} className="relative h-[50vh] overflow-hidden md:h-[60vh] lg:h-[70vh]">
      <motion.div className="absolute inset-[-10%]" style={{ y }}>
        <img
          src="/images/break.jpg"
          alt="Serene spa environment with warm lighting"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </motion.div>
      <div className="absolute inset-0 bg-dark-primary/60" />
      <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
        <motion.blockquote
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="heading-serif text-3xl text-ivory md:text-4xl lg:text-5xl xl:text-6xl">
            Expert care.
            <br />
            <span className="heading-serif-italic">Thoughtfully personalized.</span>
          </p>
        </motion.blockquote>
      </div>
    </section>
  );
}
