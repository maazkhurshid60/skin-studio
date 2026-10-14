"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionLabel from "./SectionLabel";

const ease = [0.22, 1, 0.36, 1] as const;

type BeforeAfterItem = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  /** Defaults to 4/3. Use the photo's own ratio for portrait or small images. */
  aspectRatio?: string;
  /** Cap the display width — use for low-resolution photos. */
  maxWidthClass?: string;
  caption?: string;
};

const labelClass =
  "font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-body-muted";

function Card({
  label,
  src,
  alt,
  aspectRatio,
}: {
  label: string;
  src: string;
  alt: string;
  aspectRatio?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border-subtle">
      <div className="bg-dark-secondary/60 px-5 py-3">
        <span className={labelClass}>{label}</span>
      </div>
      <img
        src={src}
        alt={alt}
        className="w-full object-cover"
        style={aspectRatio ? { aspectRatio } : undefined}
        loading="lazy"
      />
    </div>
  );
}

export default function ServiceBeforeAfter({
  items,
}: {
  items: BeforeAfterItem[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
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
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="space-y-10"
        >
          {items.map((item, i) => (
            <div key={i}>
              <div
                className={`mx-auto grid gap-6 md:grid-cols-2 ${item.maxWidthClass ?? ""}`}
              >
                <Card
                  label="Before"
                  src={item.beforeSrc}
                  alt={item.beforeAlt}
                  aspectRatio={item.aspectRatio ?? "4/3"}
                />
                <Card
                  label="After"
                  src={item.afterSrc}
                  alt={item.afterAlt}
                  aspectRatio={item.aspectRatio ?? "4/3"}
                />
              </div>
              {item.caption && (
                <p className="mt-4 text-center font-sans text-[13px] text-body-muted/70">
                  {item.caption}
                </p>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
