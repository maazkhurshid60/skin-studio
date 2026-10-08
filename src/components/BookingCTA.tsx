"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";

export default function BookingCTA() {
  return (
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
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="eyebrow mb-6">Begin Your Journey</p>
              <h2 className="heading-serif mb-6 text-4xl md:text-5xl lg:text-[56px]">
                Your Skin Journey
                <br />
                <span className="heading-serif-italic">Starts Here.</span>
              </h2>
              <p className="mb-10 max-w-md font-sans text-base leading-[1.8] text-body-muted">
                Ready to experience personalized, medical-grade skincare? Book
                your consultation today and discover the treatment plan designed
                for your unique skin.
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
  );
}
