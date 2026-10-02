"use client";

import { useRef, useState, useCallback, useEffect, type RefObject } from "react";
import { motion, useInView } from "framer-motion";
import SectionLabel from "./SectionLabel";

function useContainerWidth(ref: RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    ro.observe(ref.current);
    setWidth(ref.current.offsetWidth);
    return () => ro.disconnect();
  }, [ref]);
  return width;
}

const transformations = [
  {
    treatment: "BBL Photofacial",
    before: "/images/ba-photofacial-before.jpg",
    after: "/images/ba-photofacial-after.jpg",
  },
  {
    treatment: "Microneedling",
    before: "/images/ba-microneedling-before.jpg",
    after: "/images/ba-microneedling-after.jpg",
  },
  {
    treatment: "Acne Treatment",
    before: "/images/ba-acne-before.jpg",
    after: "/images/ba-acne-after.jpg",
  },
];

function ComparisonSlider({
  before,
  after,
  treatment,
  index,
}: {
  before: string;
  after: string;
  treatment: string;
  index: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const isInView = useInView(cardRef, { once: true, margin: "-80px" });
  const containerWidth = useContainerWidth(containerRef);

  const updatePosition = useCallback(
    (clientX: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setPosition(pct);
    },
    [],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updatePosition(e.clientX);
    },
    [updatePosition],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    },
    [isDragging, updatePosition],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group"
    >
      <div
        ref={containerRef}
        className="relative aspect-[4/5] cursor-ew-resize overflow-hidden rounded-2xl bg-dark-deep"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: "none" }}
      >
        {/* After image (full background) */}
        <img
          src={after}
          alt={`${treatment} — after treatment`}
          className="absolute inset-0 object-cover select-none"
          style={{ width: "100%", height: "100%" }}
          draggable={false}
          loading="lazy"
        />

        {/* Before image (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <img
            src={before}
            alt={`${treatment} — before treatment`}
            className="absolute inset-0 object-cover select-none"
            style={{
              width: containerWidth > 0 ? `${containerWidth}px` : "100%",
              height: "100%",
              maxWidth: "none",
            }}
            draggable={false}
            loading="lazy"
          />
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 z-10"
          style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        >
          <div
            className="h-full w-[2px] transition-colors duration-200"
            style={{
              backgroundColor: isDragging
                ? "rgba(244,239,232,0.7)"
                : "rgba(244,239,232,0.45)",
            }}
          />
          {/* Drag handle */}
          <div
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-200"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: isDragging
                ? "rgba(194,90,131,0.95)"
                : "rgba(31,32,29,0.75)",
              borderColor: isDragging
                ? "rgba(244,239,232,0.5)"
                : "rgba(244,239,232,0.3)",
              backdropFilter: "blur(8px)",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.5 6L3 9L5.5 12"
                stroke="#F4EFE8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.5 6L15 9L12.5 12"
                stroke="#F4EFE8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="pointer-events-none absolute top-4 left-4 z-20">
          <span className="inline-block rounded-full px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory/90"
            style={{ backgroundColor: "rgba(31,32,29,0.6)", backdropFilter: "blur(6px)" }}
          >
            Before
          </span>
        </div>
        <div className="pointer-events-none absolute top-4 right-4 z-20">
          <span className="inline-block rounded-full px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory/90"
            style={{ backgroundColor: "rgba(31,32,29,0.6)", backdropFilter: "blur(6px)" }}
          >
            After
          </span>
        </div>

        {/* Subtle gradient overlays for depth */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] bg-gradient-to-t from-dark-primary/50 to-transparent"
          style={{ height: "30%" }}
        />
      </div>

      {/* Treatment label */}
      <p className="mt-5 text-center font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-body-muted transition-colors duration-300 group-hover:text-ivory">
        {treatment}
      </p>
    </motion.div>
  );
}

function BeforeAfterPlaceholder({
  treatment,
  index,
}: {
  treatment: string;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const isInView = useInView(cardRef, { once: true, margin: "-80px" });
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useContainerWidth(containerRef);

  const updatePosition = useCallback(
    (clientX: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setPosition(pct);
    },
    [],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updatePosition(e.clientX);
    },
    [updatePosition],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    },
    [isDragging, updatePosition],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const gradientsBefore: Record<string, string> = {
    "BBL Photofacial":
      "linear-gradient(145deg, #3d2e2e 0%, #5a3d3d 40%, #4a3535 100%)",
    Microneedling:
      "linear-gradient(145deg, #2e3033 0%, #3d4045 40%, #353739 100%)",
    "Acne Treatment":
      "linear-gradient(145deg, #332e2e 0%, #4a3d3d 40%, #3d3535 100%)",
  };

  const gradientsAfter: Record<string, string> = {
    "BBL Photofacial":
      "linear-gradient(145deg, #4a3d3d 0%, #7a5c5c 40%, #6a5050 100%)",
    Microneedling:
      "linear-gradient(145deg, #3d4045 0%, #5a5f65 40%, #4a4f53 100%)",
    "Acne Treatment":
      "linear-gradient(145deg, #4a3d3d 0%, #6a5555 40%, #5a4a4a 100%)",
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group"
    >
      <div
        ref={containerRef}
        className="relative aspect-[4/5] cursor-ew-resize overflow-hidden rounded-2xl bg-dark-deep"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: "none" }}
      >
        {/* After placeholder (full background) */}
        <div
          className="absolute inset-0"
          style={{ background: gradientsAfter[treatment] || gradientsAfter["BBL Photofacial"] }}
        />

        {/* Before placeholder (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: gradientsBefore[treatment] || gradientsBefore["BBL Photofacial"],
              width: containerWidth > 0 ? `${containerWidth}px` : "100%",
            }}
          />
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 z-10"
          style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        >
          <div
            className="h-full w-[2px] transition-colors duration-200"
            style={{
              backgroundColor: isDragging
                ? "rgba(244,239,232,0.7)"
                : "rgba(244,239,232,0.45)",
            }}
          />
          {/* Drag handle */}
          <div
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-200"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: isDragging
                ? "rgba(194,90,131,0.95)"
                : "rgba(31,32,29,0.75)",
              borderColor: isDragging
                ? "rgba(244,239,232,0.5)"
                : "rgba(244,239,232,0.3)",
              backdropFilter: "blur(8px)",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.5 6L3 9L5.5 12"
                stroke="#F4EFE8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.5 6L15 9L12.5 12"
                stroke="#F4EFE8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="pointer-events-none absolute top-4 left-4 z-20">
          <span
            className="inline-block rounded-full px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory/90"
            style={{ backgroundColor: "rgba(31,32,29,0.6)", backdropFilter: "blur(6px)" }}
          >
            Before
          </span>
        </div>
        <div className="pointer-events-none absolute top-4 right-4 z-20">
          <span
            className="inline-block rounded-full px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory/90"
            style={{ backgroundColor: "rgba(31,32,29,0.6)", backdropFilter: "blur(6px)" }}
          >
            After
          </span>
        </div>

        {/* Instruction hint */}
        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 text-center">
          <span className="font-sans text-[11px] font-medium tracking-wider text-ivory/40">
            Drag to compare
          </span>
        </div>

        {/* Bottom gradient */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] bg-gradient-to-t from-dark-primary/50 to-transparent"
          style={{ height: "30%" }}
        />
      </div>

      {/* Treatment label */}
      <p className="mt-5 text-center font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-body-muted transition-colors duration-300 group-hover:text-ivory">
        {treatment}
      </p>
    </motion.div>
  );
}

export default function BeforeAfterSection() {
  const [imagesExist, setImagesExist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    transformations.forEach((t) => {
      const img = new Image();
      img.onload = () =>
        setImagesExist((prev) => ({ ...prev, [t.treatment]: true }));
      img.onerror = () =>
        setImagesExist((prev) => ({ ...prev, [t.treatment]: false }));
      img.src = t.before;
    });
  }, []);

  return (
    <section className="bg-dark-primary pt-6 pb-28 md:pt-8 md:pb-36 lg:pt-10 lg:pb-44">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 text-center lg:mb-20">
          <SectionLabel text="Results" align="center" />
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="heading-serif text-4xl md:text-5xl lg:text-6xl"
          >
            Before & <span className="heading-serif-italic">After</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-6 max-w-md font-sans text-[15px] leading-[1.75] text-body-muted"
          >
            Drag the slider to reveal the transformation. Real clients, real
            treatments, real results.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {transformations.map((t, i) =>
            imagesExist[t.treatment] ? (
              <ComparisonSlider
                key={t.treatment}
                before={t.before}
                after={t.after}
                treatment={t.treatment}
                index={i}
              />
            ) : (
              <BeforeAfterPlaceholder
                key={t.treatment}
                treatment={t.treatment}
                index={i}
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
