"use client";

import { motion } from "framer-motion";

interface SectionLabelProps {
  text: string;
  align?: "left" | "center";
}

export default function SectionLabel({
  text,
  align = "left",
}: SectionLabelProps) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`eyebrow mb-6 ${align === "center" ? "text-center" : ""}`}
    >
      {text}
    </motion.p>
  );
}
