"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Gift,
  ChevronLeft,
  Check,
  AlertTriangle,
  Edit3,
  Sparkles,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ease = [0.22, 1, 0.36, 1] as const;

const amounts = [10, 25, 50, 100] as const;

const policies = [
  "All gift cards are FINAL SALE.",
  'Skin Studio is not responsible for "lost or stolen gift cards".',
  "Gift cards cannot be redeemed for cash.",
  "All gift cards expire one year from purchase date.",
];

const steps = [
  { label: "Amount", short: "1" },
  { label: "Details", short: "2" },
  { label: "Review", short: "3" },
  { label: "Checkout", short: "4" },
];

const MAX_MESSAGE = 500;

function parseEmails(raw: string): string[] {
  return raw
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const inputClass =
  "w-full rounded-xl border border-border-subtle bg-dark-primary px-5 py-3.5 font-sans text-[14px] text-ivory placeholder:text-body-muted/50 transition-colors duration-300 outline-none focus:border-rose/40";

export default function GiftCardPage() {
  const [step, setStep] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [recipientEmailRaw, setRecipientEmailRaw] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [purchaserEmail, setPurchaserEmail] = useState("");
  const [purchaserName, setPurchaserName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const recipients = useMemo(
    () => parseEmails(recipientEmailRaw),
    [recipientEmailRaw],
  );
  const recipientCount = Math.max(recipients.length, 1);
  const total = selectedAmount ? selectedAmount * recipientCount : 0;

  function validateStep(s: number): boolean {
    const errs: Record<string, string> = {};

    if (s === 0) {
      if (!selectedAmount) errs.amount = "Please select a gift card amount.";
    }

    if (s === 1) {
      if (!recipientEmailRaw.trim())
        errs.recipientEmail = "Please enter a recipient email address.";
      else {
        const invalid = recipients.filter((e) => !isValidEmail(e));
        if (invalid.length)
          errs.recipientEmail = `Invalid email: ${invalid[0]}`;
      }
      if (!senderName.trim())
        errs.senderName = "Please enter your name.";
    }

    if (s === 3) {
      if (!purchaserEmail.trim())
        errs.purchaserEmail = "Please enter your email address.";
      else if (!isValidEmail(purchaserEmail))
        errs.purchaserEmail = "Please enter a valid email address.";
      if (!purchaserName.trim())
        errs.purchaserName = "Please enter your full name.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function goNext() {
    if (validateStep(step)) setStep((s) => Math.min(3, s + 1));
  }

  function goBack() {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  }

  function goToStep(s: number) {
    setErrors({});
    setStep(s);
  }

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
              <span className="text-ivory">Gift Certificates</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease }}
              className="heading-serif text-5xl md:text-6xl lg:text-[76px]"
            >
              Gift <span className="heading-serif-italic">Certificates</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease }}
              className="mt-6 max-w-lg font-sans text-base leading-relaxed text-body-muted md:text-lg"
            >
              Give the gift of radiant skin. Perfect for birthdays,
              anniversaries, or simply showing someone you care.
            </motion.p>
          </div>
        </section>

        {/* Gift Card Purchase Flow */}
        <section className="bg-dark-secondary py-20 md:py-28 lg:py-36">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
            {/* Stepper */}
            <div className="mb-12 flex items-center justify-center gap-2 md:mb-16">
              {steps.map((s, i) => (
                <div key={s.label} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => i < step && goToStep(i)}
                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 font-sans text-[12px] font-semibold uppercase tracking-[0.14em] transition-all duration-300 md:px-4 md:py-2 ${
                      i === step
                        ? "bg-rose/15 text-rose"
                        : i < step
                          ? "cursor-pointer text-ivory/70 hover:text-ivory"
                          : "cursor-default text-body-muted/40"
                    }`}
                    disabled={i > step}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                        i < step
                          ? "bg-rose/20 text-rose"
                          : i === step
                            ? "bg-rose text-ivory"
                            : "bg-border-subtle/30 text-body-muted/40"
                      }`}
                    >
                      {i < step ? <Check size={12} /> : i + 1}
                    </span>
                    <span className="hidden md:inline">{s.label}</span>
                  </button>
                  {i < steps.length - 1 && (
                    <div
                      className={`h-px w-6 md:w-10 ${
                        i < step ? "bg-rose/30" : "bg-border-subtle/30"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Gift Card Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease }}
                className="relative lg:sticky lg:top-32"
              >
                <div className="overflow-hidden rounded-[28px] border border-border-subtle shadow-[0_4px_40px_rgba(0,0,0,0.3)]">
                  <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                    <img
                      src="/images/cta-booking.jpg"
                      alt="Skin Studio Ithaca Gift Certificate"
                      className="absolute inset-0 object-cover"
                      style={{ width: "100%", height: "100%" }}
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-primary/90 via-dark-primary/40 to-dark-primary/20" />
                    <div className="absolute inset-0 bg-gradient-to-br from-rose/[0.15] via-transparent to-transparent" />

                    <div className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-ivory/20 bg-dark-primary/40 backdrop-blur-sm md:right-8 md:top-8">
                      <Sparkles size={18} className="text-rose" />
                    </div>

                    <div className="relative flex h-full flex-col justify-between p-8 md:p-10">
                      <div>
                        <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-rose md:text-[11px]">
                          Gift Certificate
                        </p>
                        <h3 className="heading-serif mt-3 text-3xl text-ivory md:text-4xl lg:text-[44px]">
                          Skin Studio
                        </h3>
                        <p className="mt-1 font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-ivory/50 md:text-[13px]">
                          Ithaca, New York
                        </p>
                      </div>

                      <div>
                        <div className="mb-4 h-px w-16 bg-gradient-to-r from-rose/60 to-transparent" />
                        <p className="heading-serif-italic text-[15px] text-ivory/70 md:text-[17px]">
                          &ldquo;The gift of radiant skin&rdquo;
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-ivory/10 bg-dark-primary/40 backdrop-blur-sm">
                            <Gift size={14} className="text-rose" />
                          </div>
                          <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-ivory/40">
                            Medical-Grade Skincare
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-rose/[0.06] blur-2xl" />
                <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-mauve/[0.06] blur-2xl" />

                {/* Running total */}
                {selectedAmount && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 rounded-xl border border-border-subtle bg-dark-primary/60 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-[13px] text-body-muted">
                        ${selectedAmount}.00 &times; {recipientCount}{" "}
                        {recipientCount === 1 ? "recipient" : "recipients"}
                      </span>
                      <span className="heading-serif text-2xl text-ivory">
                        ${total}.00
                      </span>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Steps */}
              <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                  {/* STEP 0: Amount */}
                  {step === 0 && (
                    <motion.div
                      key="step-0"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, ease }}
                    >
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose/10">
                        <Gift size={22} className="text-rose" />
                      </div>

                      <h2 className="heading-serif mb-2 text-3xl text-ivory md:text-4xl">
                        Choose an Amount
                      </h2>
                      <p className="mb-8 font-sans text-[15px] text-body-muted">
                        $10.00 &ndash; $100.00
                      </p>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {amounts.map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => {
                              setSelectedAmount(amount);
                              setErrors({});
                            }}
                            className={`rounded-xl border py-4 font-sans text-[17px] font-semibold transition-all duration-300 ${
                              selectedAmount === amount
                                ? "border-rose bg-rose/10 text-ivory"
                                : "border-border-subtle text-body-muted hover:border-rose/30 hover:text-ivory"
                            }`}
                          >
                            ${amount}
                          </button>
                        ))}
                      </div>
                      {errors.amount && (
                        <p className="mt-3 font-sans text-[13px] text-rose">
                          {errors.amount}
                        </p>
                      )}

                      {/* Policies */}
                      <div className="mt-10 rounded-xl border border-border-subtle bg-surface-subtle p-5">
                        <p className="mb-3 font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-ivory/70">
                          Gift Card Terms
                        </p>
                        <ol className="list-decimal space-y-1.5 pl-5 font-sans text-[13px] leading-[1.7] text-body-muted/80">
                          {policies.map((policy, i) => (
                            <li key={i}>{policy}</li>
                          ))}
                        </ol>
                      </div>

                      <button
                        type="button"
                        onClick={goNext}
                        className="mt-8 w-full rounded-full bg-rose px-8 py-4 font-sans text-[15px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover"
                      >
                        Continue
                      </button>
                    </motion.div>
                  )}

                  {/* STEP 1: Gift Details */}
                  {step === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, ease }}
                    >
                      <button
                        type="button"
                        onClick={goBack}
                        className="mb-6 flex items-center gap-1.5 font-sans text-[13px] text-body-muted transition-colors duration-300 hover:text-ivory"
                      >
                        <ChevronLeft size={14} />
                        Back
                      </button>

                      <h2 className="heading-serif mb-2 text-3xl text-ivory md:text-4xl">
                        Gift Details
                      </h2>
                      <p className="mb-8 font-sans text-[15px] text-body-muted">
                        Tell us who should receive this gift card.
                      </p>

                      <div className="space-y-6">
                        <div>
                          <label className="mb-2 block font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-ivory">
                            Recipient Email
                          </label>
                          <input
                            type="text"
                            value={recipientEmailRaw}
                            onChange={(e) => {
                              setRecipientEmailRaw(e.target.value);
                              setErrors((prev) => {
                                const n = { ...prev };
                                delete n.recipientEmail;
                                return n;
                              });
                            }}
                            placeholder="recipient@example.com"
                            className={inputClass}
                          />
                          <p className="mt-1.5 font-sans text-[12px] text-body-muted/50">
                            Separate multiple email addresses with a comma. Each
                            recipient receives one ${selectedAmount}.00 gift
                            card.
                          </p>
                          {recipients.length > 1 && (
                            <p className="mt-1 font-sans text-[12px] text-rose/80">
                              {recipients.length} recipients &times; $
                              {selectedAmount}.00 = ${total}.00 total
                            </p>
                          )}
                          {errors.recipientEmail && (
                            <p className="mt-1.5 font-sans text-[13px] text-rose">
                              {errors.recipientEmail}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="mb-2 block font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-ivory">
                            From
                          </label>
                          <input
                            type="text"
                            value={senderName}
                            onChange={(e) => {
                              setSenderName(e.target.value);
                              setErrors((prev) => {
                                const n = { ...prev };
                                delete n.senderName;
                                return n;
                              });
                            }}
                            placeholder="Your name"
                            className={inputClass}
                          />
                          {errors.senderName && (
                            <p className="mt-1.5 font-sans text-[13px] text-rose">
                              {errors.senderName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="mb-2 block font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-ivory">
                            Message{" "}
                            <span className="normal-case tracking-normal text-body-muted/50">
                              (optional)
                            </span>
                          </label>
                          <textarea
                            value={message}
                            onChange={(e) => {
                              if (e.target.value.length <= MAX_MESSAGE)
                                setMessage(e.target.value);
                            }}
                            placeholder="Add a personal message"
                            rows={3}
                            className={`${inputClass} resize-none`}
                          />
                          <p className="mt-1.5 text-right font-sans text-[12px] text-body-muted/50">
                            <span
                              className={
                                message.length > MAX_MESSAGE - 50
                                  ? "text-rose"
                                  : ""
                              }
                            >
                              {MAX_MESSAGE - message.length}
                            </span>{" "}
                            characters remaining
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={goNext}
                        className="mt-8 w-full rounded-full bg-rose px-8 py-4 font-sans text-[15px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover"
                      >
                        Review Gift
                      </button>
                    </motion.div>
                  )}

                  {/* STEP 2: Review */}
                  {step === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, ease }}
                    >
                      <button
                        type="button"
                        onClick={goBack}
                        className="mb-6 flex items-center gap-1.5 font-sans text-[13px] text-body-muted transition-colors duration-300 hover:text-ivory"
                      >
                        <ChevronLeft size={14} />
                        Back
                      </button>

                      <h2 className="heading-serif mb-2 text-3xl text-ivory md:text-4xl">
                        Review Your Gift
                      </h2>
                      <p className="mb-8 font-sans text-[15px] text-body-muted">
                        Make sure everything looks right before checkout.
                      </p>

                      <div className="space-y-4">
                        {/* Amount */}
                        <div className="flex items-center justify-between rounded-xl border border-border-subtle bg-dark-primary/40 px-5 py-4">
                          <div>
                            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-body-muted/60">
                              Gift Card Amount
                            </p>
                            <p className="mt-1 font-sans text-[17px] font-semibold text-ivory">
                              ${selectedAmount}.00
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => goToStep(0)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-body-muted transition-colors duration-300 hover:bg-border-subtle/20 hover:text-ivory"
                            aria-label="Edit amount"
                          >
                            <Edit3 size={14} />
                          </button>
                        </div>

                        {/* Recipients */}
                        <div className="flex items-start justify-between rounded-xl border border-border-subtle bg-dark-primary/40 px-5 py-4">
                          <div>
                            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-body-muted/60">
                              {recipients.length === 1
                                ? "Recipient"
                                : `Recipients (${recipients.length})`}
                            </p>
                            <div className="mt-1 space-y-0.5">
                              {recipients.map((email) => (
                                <p
                                  key={email}
                                  className="font-sans text-[14px] text-ivory"
                                >
                                  {email}
                                </p>
                              ))}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => goToStep(1)}
                            className="mt-1 flex h-8 w-8 items-center justify-center rounded-full text-body-muted transition-colors duration-300 hover:bg-border-subtle/20 hover:text-ivory"
                            aria-label="Edit recipients"
                          >
                            <Edit3 size={14} />
                          </button>
                        </div>

                        {/* From */}
                        <div className="flex items-center justify-between rounded-xl border border-border-subtle bg-dark-primary/40 px-5 py-4">
                          <div>
                            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-body-muted/60">
                              From
                            </p>
                            <p className="mt-1 font-sans text-[14px] text-ivory">
                              {senderName}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => goToStep(1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-body-muted transition-colors duration-300 hover:bg-border-subtle/20 hover:text-ivory"
                            aria-label="Edit sender"
                          >
                            <Edit3 size={14} />
                          </button>
                        </div>

                        {/* Message */}
                        {message && (
                          <div className="flex items-start justify-between rounded-xl border border-border-subtle bg-dark-primary/40 px-5 py-4">
                            <div>
                              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-body-muted/60">
                                Message
                              </p>
                              <p className="mt-1 font-sans text-[14px] leading-relaxed text-ivory/80">
                                &ldquo;{message}&rdquo;
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => goToStep(1)}
                              className="mt-1 flex h-8 w-8 items-center justify-center rounded-full text-body-muted transition-colors duration-300 hover:bg-border-subtle/20 hover:text-ivory"
                              aria-label="Edit message"
                            >
                              <Edit3 size={14} />
                            </button>
                          </div>
                        )}

                        {/* Total */}
                        <div className="rounded-xl border border-rose/20 bg-rose/[0.05] px-5 py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-body-muted/60">
                                Total
                              </p>
                              <p className="mt-0.5 font-sans text-[12px] text-body-muted/50">
                                ${selectedAmount}.00 &times;{" "}
                                {recipientCount}{" "}
                                {recipientCount === 1
                                  ? "gift card"
                                  : "gift cards"}
                              </p>
                            </div>
                            <p className="heading-serif text-3xl text-ivory">
                              ${total}.00
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Terms reminder */}
                      <div className="mt-8 rounded-xl border border-border-subtle bg-surface-subtle p-5">
                        <p className="mb-2 font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-ivory/70">
                          Gift Card Terms
                        </p>
                        <ol className="list-decimal space-y-1 pl-5 font-sans text-[12px] leading-[1.7] text-body-muted/70">
                          {policies.map((policy, i) => (
                            <li key={i}>{policy}</li>
                          ))}
                        </ol>
                      </div>

                      <button
                        type="button"
                        onClick={goNext}
                        className="mt-8 w-full rounded-full bg-rose px-8 py-4 font-sans text-[15px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover"
                      >
                        Proceed to Checkout
                      </button>
                    </motion.div>
                  )}

                  {/* STEP 3: Checkout */}
                  {step === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, ease }}
                    >
                      <button
                        type="button"
                        onClick={goBack}
                        className="mb-6 flex items-center gap-1.5 font-sans text-[13px] text-body-muted transition-colors duration-300 hover:text-ivory"
                      >
                        <ChevronLeft size={14} />
                        Back
                      </button>

                      <h2 className="heading-serif mb-2 text-3xl text-ivory md:text-4xl">
                        Checkout
                      </h2>
                      <p className="mb-8 font-sans text-[15px] text-body-muted">
                        Your billing information. This is separate from the
                        recipient.
                      </p>

                      <div className="space-y-6">
                        <div>
                          <label className="mb-2 block font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-ivory">
                            Your Full Name
                          </label>
                          <input
                            type="text"
                            value={purchaserName}
                            onChange={(e) => {
                              setPurchaserName(e.target.value);
                              setErrors((prev) => {
                                const n = { ...prev };
                                delete n.purchaserName;
                                return n;
                              });
                            }}
                            placeholder="Full name"
                            className={inputClass}
                          />
                          {errors.purchaserName && (
                            <p className="mt-1.5 font-sans text-[13px] text-rose">
                              {errors.purchaserName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="mb-2 block font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-ivory">
                            Your Email
                          </label>
                          <input
                            type="email"
                            value={purchaserEmail}
                            onChange={(e) => {
                              setPurchaserEmail(e.target.value);
                              setErrors((prev) => {
                                const n = { ...prev };
                                delete n.purchaserEmail;
                                return n;
                              });
                            }}
                            placeholder="you@example.com"
                            className={inputClass}
                          />
                          <p className="mt-1.5 font-sans text-[12px] text-body-muted/50">
                            Your receipt will be sent here.
                          </p>
                          {errors.purchaserEmail && (
                            <p className="mt-1.5 font-sans text-[13px] text-rose">
                              {errors.purchaserEmail}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Order summary */}
                      <div className="mt-8 rounded-xl border border-border-subtle bg-dark-primary/40 px-5 py-4">
                        <div className="flex items-center justify-between border-b border-border-subtle/50 pb-3">
                          <span className="font-sans text-[13px] text-body-muted">
                            Gift Card (${selectedAmount}.00) &times;{" "}
                            {recipientCount}
                          </span>
                          <span className="font-sans text-[14px] font-semibold text-ivory">
                            ${total}.00
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-3">
                          <span className="font-sans text-[14px] font-semibold text-ivory">
                            Total
                          </span>
                          <span className="heading-serif text-2xl text-ivory">
                            ${total}.00
                          </span>
                        </div>
                      </div>

                      {/* Payment unavailable notice */}
                      <div className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-5">
                        <div className="flex gap-3">
                          <AlertTriangle
                            size={20}
                            className="mt-0.5 flex-shrink-0 text-amber-400"
                          />
                          <div>
                            <p className="font-sans text-[14px] font-semibold text-ivory">
                              Payment Not Yet Available
                            </p>
                            <p className="mt-1 font-sans text-[13px] leading-relaxed text-body-muted">
                              Online gift card purchases are coming soon. To
                              purchase a gift card now, please call or visit the
                              studio.
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled
                        className="mt-6 w-full cursor-not-allowed rounded-full bg-rose/40 px-8 py-4 font-sans text-[15px] font-semibold text-ivory/60"
                      >
                        Complete Purchase &mdash; ${total}.00
                      </button>

                      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                        <a
                          href="tel:6072628566"
                          className="inline-flex items-center gap-2 rounded-full border border-border-subtle px-6 py-3 font-sans text-[14px] font-medium text-body-muted transition-all duration-300 hover:border-rose/30 hover:text-ivory"
                        >
                          <Phone size={15} />
                          Call 607-262-8566
                        </a>
                        <a
                          href="/book"
                          className="inline-flex rounded-full bg-rose px-6 py-3 font-sans text-[14px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover"
                        >
                          Visit the Studio
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-dark-primary py-28 md:py-36 lg:py-44">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease }}
              className="overflow-hidden rounded-[28px] border border-border-subtle bg-dark-secondary p-10 text-center md:p-14 lg:p-20"
            >
              <p className="eyebrow mb-6">Explore Treatments</p>
              <h2 className="heading-serif mb-6 text-3xl md:text-4xl lg:text-5xl">
                Not Sure What to{" "}
                <span className="heading-serif-italic">Gift?</span>
              </h2>
              <p className="mx-auto mb-10 max-w-lg font-sans text-[15px] leading-[1.8] text-body-muted">
                Browse our full range of treatments — from custom facials to
                laser services — to help your recipient choose the perfect
                experience.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="/services"
                  className="inline-flex rounded-full bg-rose px-8 py-3.5 font-sans text-[15px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover"
                >
                  View Treatments
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
        </section>
      </main>
      <Footer />
    </>
  );
}
