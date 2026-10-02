"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  ArrowUpRight,
  FileText,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Eye,
  Clock,
  DollarSign,
  Check,
  ArrowRight,
  ArrowLeft,
  Layers,
  Scissors,
  CalendarCheck,
  User,
  Calendar,
  AlertCircle,
  Loader2,
  Mail,
  MessageSquare,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionLabel from "@/components/SectionLabel";
import Testimonials from "@/components/Testimonials";

const ease = [0.22, 1, 0.36, 1] as const;

type Category = {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
};

type Service = {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  price_cents: number;
  duration_minutes: number;
  category_slug: string;
  category_name: string;
};

type Provider = {
  id: number;
  name: string;
  title: string | null;
};

const iconMap: Record<string, React.ElementType> = {
  facials: Sparkles,
  dermaplaning: Layers,
  "lash-brow": Eye,
  waxing: Scissors,
  laser: Zap,
  consult: CalendarCheck,
};

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} hr ${m} min` : `${h} hr`;
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export default function BookPage() {
  // Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsMessage, setSlotsMessage] = useState("");

  // Step state
  const [step, setStep] = useState(1);
  const [activeCategory, setActiveCategory] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  // Contact form
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");

  // Waitlist form
  const [wlDateStart, setWlDateStart] = useState("");
  const [wlDateEnd, setWlDateEnd] = useState("");
  const [wlTimePref, setWlTimePref] = useState<"" | "morning" | "afternoon" | "evening" | "flexible">("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [wlReview, setWlReview] = useState(false);

  // UI state
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLDivElement>(null);

  // Load services on mount
  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data.categories);
        setServices(data.services);
        if (data.categories.length > 0) {
          setActiveCategory(data.categories[0].slug);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Load providers when service changes
  useEffect(() => {
    if (!selectedService) return;
    fetch(`/api/providers?serviceId=${selectedService.id}`)
      .then((r) => r.json())
      .then((data) => {
        setProviders(data.providers);
        if (data.providers.length === 1) {
          setSelectedProvider(data.providers[0]);
        }
      });
  }, [selectedService]);

  // Load availability when provider + date changes
  useEffect(() => {
    if (!selectedService || !selectedProvider || !selectedDate) return;
    setSlotsLoading(true);
    setSlots([]);
    setSlotsMessage("");
    setSelectedTime("");
    fetch(
      `/api/availability?serviceId=${selectedService.id}&providerId=${selectedProvider.id}&date=${selectedDate}`,
    )
      .then((r) => r.json())
      .then((data) => {
        setSlots(data.slots || []);
        setSlotsMessage(data.message || "");
        setSlotsLoading(false);
      })
      .catch(() => setSlotsLoading(false));
  }, [selectedService, selectedProvider, selectedDate]);

  const filteredServices = services.filter(
    (s) => s.category_slug === activeCategory,
  );

  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleSelectService = useCallback((service: Service) => {
    setSelectedService(service);
    setSelectedProvider(null);
    setSelectedDate("");
    setSelectedTime("");
    setSubmitResult(null);
    setShowWaitlist(false);
    setStep(2);
    setTimeout(scrollToForm, 100);
  }, [scrollToForm]);

  const goToStep = useCallback((s: number) => {
    setStep(s);
    setSubmitResult(null);
    setTimeout(scrollToForm, 100);
  }, [scrollToForm]);

  const handleBack = useCallback(() => {
    if (step === 2) {
      setStep(1);
      setSelectedService(null);
      setSelectedProvider(null);
    } else if (step === 3) {
      setStep(2);
      setSelectedDate("");
      setSelectedTime("");
    } else if (step === 4) {
      setStep(3);
    } else if (step === 5) {
      setStep(4);
    }
    setSubmitResult(null);
    setTimeout(scrollToForm, 100);
  }, [step, scrollToForm]);

  const enterWaitlist = useCallback((fromDate?: string) => {
    setShowWaitlist(true);
    setWlReview(false);
    setWlTimePref("");
    setMarketingConsent(false);
    if (fromDate) {
      setWlDateStart(fromDate);
      setWlDateEnd(fromDate);
    } else {
      setWlDateStart("");
      setWlDateEnd("");
    }
    setSubmitResult(null);
    setStep(4);
    setTimeout(scrollToForm, 100);
  }, [scrollToForm]);

  function validateContact(): boolean {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) errs.name = "Name is required";
    if (!customerEmail.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail))
      errs.email = "Please enter a valid email";
    if (!customerPhone.trim()) errs.phone = "Phone is required";
    else if (customerPhone.replace(/\D/g, "").length < 10)
      errs.phone = "Please enter a valid phone number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmitAppointment() {
    if (!validateContact()) return;
    if (!selectedService || !selectedProvider || !selectedDate || !selectedTime)
      return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          providerId: selectedProvider.id,
          date: selectedDate,
          time: selectedTime,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim(),
          notes: customerNotes.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitResult({ ok: true, message: data.message });
        setStep(6);
      } else {
        setSubmitResult({ ok: false, message: data.error || "Something went wrong" });
      }
    } catch {
      setSubmitResult({ ok: false, message: "Network error. Please try again." });
    }
    setSubmitting(false);
  }

  const timePrefs: Record<string, { start: string; end: string; label: string }> = {
    morning: { start: "09:00", end: "12:00", label: "Morning (9 AM – 12 PM)" },
    afternoon: { start: "12:00", end: "15:00", label: "Afternoon (12 – 3 PM)" },
    evening: { start: "15:00", end: "17:00", label: "Late Afternoon (3 – 5 PM)" },
    flexible: { start: "", end: "", label: "I’m Flexible" },
  };

  async function handleSubmitWaitlist() {
    if (!validateContact()) return;
    if (!selectedService || !wlDateStart || !wlDateEnd) return;

    const timePref = wlTimePref && wlTimePref !== "flexible" ? timePrefs[wlTimePref] : null;

    setSubmitting(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          providerId: selectedProvider?.id ?? null,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim(),
          preferredDateStart: wlDateStart,
          preferredDateEnd: wlDateEnd,
          preferredTimeStart: timePref?.start || undefined,
          preferredTimeEnd: timePref?.end || undefined,
          notes: customerNotes.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitResult({ ok: true, message: data.message });
        setStep(6);
      } else {
        setSubmitResult({ ok: false, message: data.error || "Something went wrong" });
      }
    } catch {
      setSubmitResult({ ok: false, message: "Network error. Please try again." });
    }
    setSubmitting(false);
  }

  // Calendar helpers
  const today = new Date();
  const todayStr = getDateString(today);
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 60);

  function renderCalendar() {
    const { year, month } = calendarMonth;
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const canPrev = year > today.getFullYear() || (year === today.getFullYear() && month > today.getMonth());
    const canNext = new Date(year, month + 1, 1) <= maxDate;

    return (
      <div>
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => {
              if (!canPrev) return;
              setCalendarMonth((p) => {
                const m = p.month - 1;
                return m < 0 ? { year: p.year - 1, month: 11 } : { year: p.year, month: m };
              });
            }}
            disabled={!canPrev}
            className="flex h-8 w-8 items-center justify-center rounded-full text-body-muted transition-colors hover:text-ivory disabled:opacity-30"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="font-sans text-[14px] font-semibold text-ivory">
            {MONTHS[month]} {year}
          </span>
          <button
            onClick={() => {
              if (!canNext) return;
              setCalendarMonth((p) => {
                const m = p.month + 1;
                return m > 11 ? { year: p.year + 1, month: 0 } : { year: p.year, month: m };
              });
            }}
            disabled={!canNext}
            className="flex h-8 w-8 items-center justify-center rounded-full text-body-muted transition-colors hover:text-ivory disabled:opacity-30"
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {DAYS.map((d) => (
            <div key={d} className="py-1 text-center font-sans text-[11px] font-medium uppercase tracking-wider text-body-muted/50">
              {d}
            </div>
          ))}
          {cells.map((day, i) => {
            if (day === null)
              return <div key={`empty-${i}`} />;

            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isPast = dateStr < todayStr;
            const isTooFar = new Date(dateStr) > maxDate;
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === todayStr;
            const disabled = isPast || isTooFar;

            return (
              <button
                key={dateStr}
                onClick={() => !disabled && setSelectedDate(dateStr)}
                disabled={disabled}
                className={`relative flex h-9 w-full items-center justify-center rounded-lg font-sans text-[13px] transition-all duration-200 ${
                  isSelected
                    ? "bg-rose font-semibold text-ivory"
                    : disabled
                      ? "cursor-not-allowed text-body-muted/20"
                      : "text-body-muted hover:bg-rose/10 hover:text-ivory"
                } ${isToday && !isSelected ? "font-semibold text-rose" : ""}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const stepLabels = ["Service", "Provider", "Date & Time", "Waitlist", "Review", "Confirmed"];
  const currentStepLabel = showWaitlist && step === 4 ? "Waitlist" : stepLabels[step - 1] || "";

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative flex min-h-[50vh] items-end overflow-hidden pb-20 pt-32 md:min-h-[40vh] md:pb-24 lg:pb-28">
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
              <a href="/" className="transition-colors duration-300 hover:text-ivory">
                Home
              </a>
              <span className="text-border-subtle">/</span>
              <span className="text-ivory">Book</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease }}
              className="heading-serif text-5xl md:text-6xl lg:text-[76px]"
            >
              Book an <span className="heading-serif-italic">Appointment</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease }}
              className="mt-6 max-w-lg font-sans text-base leading-relaxed text-body-muted md:text-lg"
            >
              Browse our services, choose your provider and time, and request
              your appointment — all right here.
            </motion.p>
          </div>
        </section>

        {/* Booking Section */}
        <section ref={formRef} className="bg-dark-secondary py-20 md:py-28 lg:py-36">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            {/* Step Indicator */}
            {step < 6 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease }}
                className="mb-12 md:mb-16"
              >
                <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
                  {[1, 2, 3, 5].map((s, i) => {
                    const labels = ["Service", "Provider", "Date & Time", "Review"];
                    const isActive = step === s || (step === 4 && s === 3);
                    const isComplete = step > s;
                    return (
                      <div key={s} className="flex items-center gap-2">
                        {i > 0 && <div className="h-px w-6 bg-border-subtle md:w-10" />}
                        <button
                          onClick={() => isComplete && goToStep(s)}
                          disabled={!isComplete}
                          className={`flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 font-sans text-[12px] font-semibold transition-all duration-300 md:px-4 md:text-[13px] ${
                            isActive
                              ? "bg-rose/15 text-rose"
                              : isComplete
                                ? "cursor-pointer text-body-muted hover:text-ivory"
                                : "text-body-muted/40"
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold md:h-6 md:w-6 ${
                              isActive
                                ? "bg-rose text-ivory"
                                : isComplete
                                  ? "bg-rose/20 text-rose"
                                  : "bg-border-subtle text-body-muted/40"
                            }`}
                          >
                            {isComplete ? <Check size={10} /> : i + 1}
                          </span>
                          <span className="hidden sm:inline">{labels[i]}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
              {/* Main Content */}
              <div>
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 size={24} className="animate-spin text-rose" />
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    {/* STEP 1: Choose Service */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, ease }}
                      >
                        <div className="mb-8 flex flex-wrap gap-2 md:mb-10">
                          {categories.map((cat) => {
                            const Icon = iconMap[cat.slug] || Sparkles;
                            const isActive = activeCategory === cat.slug;
                            const count = services.filter((s) => s.category_slug === cat.slug).length;
                            return (
                              <button
                                key={cat.slug}
                                onClick={() => setActiveCategory(cat.slug)}
                                className={`flex items-center gap-2 rounded-full px-4 py-2.5 font-sans text-[13px] font-medium transition-all duration-300 ${
                                  isActive
                                    ? "bg-rose text-ivory shadow-[0_2px_12px_rgba(194,90,131,0.3)]"
                                    : "border border-border-subtle text-body-muted hover:border-rose/30 hover:text-ivory"
                                }`}
                              >
                                <Icon size={14} />
                                {cat.name}
                                <span className={`ml-0.5 text-[11px] ${isActive ? "text-ivory/70" : "text-body-muted/50"}`}>
                                  ({count})
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          {filteredServices.map((service, i) => (
                            <motion.button
                              key={service.id}
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: i * 0.04, ease }}
                              onClick={() => handleSelectService(service)}
                              className="group rounded-2xl border border-border-subtle bg-dark-primary p-5 text-left transition-all duration-300 hover:border-rose/30 hover:shadow-[0_4px_20px_rgba(194,90,131,0.08)] md:p-6"
                            >
                              <h3 className="mb-2 font-serif text-[17px] font-semibold text-ivory transition-colors duration-300 group-hover:text-rose md:text-[18px]">
                                {service.name}
                              </h3>
                              <div className="mb-3 flex items-center gap-3 font-sans text-[13px] text-body-muted">
                                <span className="flex items-center gap-1">
                                  <DollarSign size={12} className="text-rose/60" />
                                  {formatPrice(service.price_cents)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock size={12} className="text-rose/60" />
                                  {formatDuration(service.duration_minutes)}
                                </span>
                              </div>
                              {service.description && (
                                <p className="mb-3 line-clamp-2 font-sans text-[13px] leading-[1.7] text-body-muted/70">
                                  {service.description}
                                </p>
                              )}
                              <span className="inline-flex items-center gap-1.5 font-sans text-[12px] font-semibold uppercase tracking-[0.12em] text-rose/70 transition-colors duration-300 group-hover:text-rose">
                                Select
                                <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                              </span>
                            </motion.button>
                          ))}
                        </div>

                        {/* Waitlist CTA */}
                        <motion.div
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.3, ease }}
                          className="mt-8 rounded-2xl border border-dashed border-rose/20 bg-rose/[0.03] p-6 text-center"
                        >
                          <Clock size={20} className="mx-auto mb-2 text-rose/50" />
                          <p className="mb-1 font-sans text-[14px] font-semibold text-ivory">
                            Can&apos;t find a convenient time?
                          </p>
                          <p className="mb-4 font-sans text-[13px] text-body-muted/70">
                            Join our waitlist and we&apos;ll reach out when an opening matches your preferences.
                          </p>
                          <button
                            onClick={() => enterWaitlist()}
                            className="inline-flex items-center gap-2 rounded-full bg-rose/10 px-5 py-2.5 font-sans text-[13px] font-semibold text-rose transition-colors hover:bg-rose/20"
                          >
                            Join the Waitlist
                            <ArrowRight size={13} />
                          </button>
                        </motion.div>
                      </motion.div>
                    )}

                    {/* STEP 2: Choose Provider */}
                    {step === 2 && selectedService && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.4, ease }}
                      >
                        <button onClick={handleBack} className="mb-6 flex items-center gap-2 font-sans text-[13px] font-medium text-body-muted transition-colors hover:text-ivory">
                          <ArrowLeft size={14} />
                          Change service
                        </button>

                        {/* Selected service summary */}
                        <div className="mb-8 rounded-2xl border border-rose/20 bg-dark-primary p-6">
                          <p className="mb-1 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-rose/60">
                            Selected Treatment
                          </p>
                          <h3 className="heading-serif text-xl text-ivory md:text-2xl">
                            {selectedService.name}
                          </h3>
                          <div className="mt-2 flex items-center gap-3 font-sans text-[13px] text-body-muted">
                            <span className="flex items-center gap-1">
                              <DollarSign size={12} className="text-rose" />
                              {formatPrice(selectedService.price_cents)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} className="text-rose" />
                              {formatDuration(selectedService.duration_minutes)}
                            </span>
                          </div>
                        </div>

                        <h4 className="mb-4 font-sans text-[15px] font-semibold text-ivory">
                          Choose Your Provider
                        </h4>

                        {providers.length === 0 ? (
                          <p className="font-sans text-[14px] text-body-muted">
                            Loading providers...
                          </p>
                        ) : (
                          <div className="grid gap-3">
                            {/* Any available provider option */}
                            {providers.length > 1 && (
                              <button
                                onClick={() => {
                                  setSelectedProvider(providers[0]);
                                  setStep(3);
                                  setTimeout(scrollToForm, 100);
                                }}
                                className={`group flex items-center gap-4 rounded-2xl border p-5 text-left transition-all duration-300 ${
                                  selectedProvider === null
                                    ? "border-rose/30 bg-dark-primary"
                                    : "border-border-subtle bg-dark-primary hover:border-rose/20"
                                }`}
                              >
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose/10">
                                  <User size={20} className="text-rose" />
                                </div>
                                <div>
                                  <p className="font-sans text-[15px] font-semibold text-ivory">
                                    Any Available Provider
                                  </p>
                                  <p className="font-sans text-[13px] text-body-muted">
                                    First available specialist
                                  </p>
                                </div>
                                <ArrowRight size={16} className="ml-auto text-body-muted/40 transition-all group-hover:translate-x-0.5 group-hover:text-rose" />
                              </button>
                            )}

                            {providers.map((prov) => (
                              <button
                                key={prov.id}
                                onClick={() => {
                                  setSelectedProvider(prov);
                                  setStep(3);
                                  setTimeout(scrollToForm, 100);
                                }}
                                className={`group flex items-center gap-4 rounded-2xl border p-5 text-left transition-all duration-300 ${
                                  selectedProvider?.id === prov.id
                                    ? "border-rose/30 bg-dark-primary"
                                    : "border-border-subtle bg-dark-primary hover:border-rose/20"
                                }`}
                              >
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose/10">
                                  <User size={20} className="text-rose" />
                                </div>
                                <div>
                                  <p className="font-sans text-[15px] font-semibold text-ivory">
                                    {prov.name}
                                  </p>
                                  {prov.title && (
                                    <p className="font-sans text-[13px] text-body-muted">
                                      {prov.title}
                                    </p>
                                  )}
                                </div>
                                <ArrowRight size={16} className="ml-auto text-body-muted/40 transition-all group-hover:translate-x-0.5 group-hover:text-rose" />
                              </button>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* STEP 3: Choose Date & Time */}
                    {step === 3 && selectedService && selectedProvider && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.4, ease }}
                      >
                        <button onClick={handleBack} className="mb-6 flex items-center gap-2 font-sans text-[13px] font-medium text-body-muted transition-colors hover:text-ivory">
                          <ArrowLeft size={14} />
                          Change provider
                        </button>

                        <div className="mb-6 rounded-2xl border border-border-subtle bg-dark-primary/50 p-5">
                          <div className="flex flex-wrap items-center gap-4 font-sans text-[13px] text-body-muted">
                            <span className="font-semibold text-ivory">{selectedService.name}</span>
                            <span>{formatPrice(selectedService.price_cents)}</span>
                            <span>{formatDuration(selectedService.duration_minutes)}</span>
                            <span>with {selectedProvider.name}</span>
                          </div>
                        </div>

                        <h4 className="mb-4 font-sans text-[15px] font-semibold text-ivory">
                          Choose a Date
                        </h4>

                        <div className="mb-8 rounded-2xl border border-border-subtle bg-dark-primary p-5">
                          {renderCalendar()}
                        </div>

                        {selectedDate && (
                          <>
                            <h4 className="mb-4 font-sans text-[15px] font-semibold text-ivory">
                              Available Times
                              <span className="ml-2 font-normal text-body-muted">
                                {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
                                  weekday: "long",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
                            </h4>

                            {slotsLoading ? (
                              <div className="flex items-center gap-2 py-8">
                                <Loader2 size={16} className="animate-spin text-rose" />
                                <span className="font-sans text-[14px] text-body-muted">
                                  Checking availability...
                                </span>
                              </div>
                            ) : slots.length > 0 ? (
                              <div className="mb-6 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                                {slots.map((slot) => (
                                  <button
                                    key={slot}
                                    onClick={() => setSelectedTime(slot)}
                                    className={`rounded-xl px-3 py-2.5 font-sans text-[13px] font-medium transition-all duration-200 ${
                                      selectedTime === slot
                                        ? "bg-rose font-semibold text-ivory shadow-[0_2px_12px_rgba(194,90,131,0.3)]"
                                        : "border border-border-subtle text-body-muted hover:border-rose/30 hover:text-ivory"
                                    }`}
                                  >
                                    {formatTime(slot)}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="mb-6 rounded-2xl border border-border-subtle bg-dark-primary/50 p-6 text-center">
                                <AlertCircle size={20} className="mx-auto mb-2 text-body-muted/50" />
                                <p className="mb-1 font-sans text-[14px] font-medium text-body-muted">
                                  {slotsMessage || "No available times on this date"}
                                </p>
                                <p className="mb-4 font-sans text-[13px] text-body-muted/60">
                                  Try another date or join the waitlist.
                                </p>
                                <button
                                  onClick={() => enterWaitlist(selectedDate)}
                                  className="inline-flex items-center gap-2 rounded-full bg-rose/10 px-5 py-2.5 font-sans text-[13px] font-semibold text-rose transition-colors hover:bg-rose/20"
                                >
                                  Join Waitlist
                                  <ArrowRight size={13} />
                                </button>
                              </div>
                            )}

                            {selectedTime && (
                              <button
                                onClick={() => goToStep(5)}
                                className="flex w-full items-center justify-center gap-2 rounded-full bg-rose px-8 py-4 font-sans text-[15px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover"
                              >
                                Continue to Review
                                <ArrowRight size={16} />
                              </button>
                            )}

                            {slots.length > 0 && (
                              <div className="mt-4 text-center">
                                <button
                                  onClick={() => enterWaitlist(selectedDate)}
                                  className="font-sans text-[13px] text-body-muted/60 transition-colors hover:text-rose"
                                >
                                  Preferred time not available? Join the waitlist
                                </button>
                              </div>
                            )}
                          </>
                        )}

                        <p className="mt-6 font-sans text-[12px] text-body-muted/40">
                          All times shown in Eastern Time (ET). Daylight saving is handled automatically.
                        </p>
                      </motion.div>
                    )}

                    {/* STEP 4: Waitlist */}
                    {step === 4 && showWaitlist && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.4, ease }}
                      >
                        <button
                          onClick={() => {
                            if (wlReview) {
                              setWlReview(false);
                            } else if (selectedDate) {
                              setShowWaitlist(false);
                              setStep(3);
                              setTimeout(scrollToForm, 100);
                            } else {
                              setShowWaitlist(false);
                              setStep(selectedService ? 1 : 1);
                              setTimeout(scrollToForm, 100);
                            }
                          }}
                          className="mb-6 flex items-center gap-2 font-sans text-[13px] font-medium text-body-muted transition-colors hover:text-ivory"
                        >
                          <ArrowLeft size={14} />
                          {wlReview ? "Edit preferences" : selectedDate ? "Back to calendar" : "Back to services"}
                        </button>

                        <div className="mb-6 rounded-2xl border border-rose/10 bg-rose/5 p-5">
                          <div className="flex items-start gap-3">
                            <Clock size={18} className="mt-0.5 shrink-0 text-rose/70" />
                            <div>
                              <p className="font-sans text-[14px] font-semibold text-ivory">
                                Join the Waitlist
                              </p>
                              <p className="mt-1 font-sans text-[13px] leading-[1.7] text-body-muted">
                                This is a <strong className="text-ivory">request</strong>, not a confirmed appointment. We&apos;ll contact you when an opening matches your preferences.
                              </p>
                            </div>
                          </div>
                        </div>

                        {!wlReview ? (
                          <>
                            {/* Service selection */}
                            <h4 className="mb-3 font-sans text-[15px] font-semibold text-ivory">
                              Service
                            </h4>
                            {selectedService ? (
                              <div className="mb-6 flex items-center justify-between rounded-2xl border border-border-subtle bg-dark-primary/50 p-5">
                                <div>
                                  <p className="font-sans text-[15px] font-semibold text-ivory">
                                    {selectedService.name}
                                  </p>
                                  <div className="mt-1 flex items-center gap-3 font-sans text-[12px] text-body-muted">
                                    <span>{formatPrice(selectedService.price_cents)}</span>
                                    <span>{formatDuration(selectedService.duration_minutes)}</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    setShowWaitlist(false);
                                    setStep(1);
                                    setSelectedService(null);
                                    setSelectedProvider(null);
                                    setTimeout(scrollToForm, 100);
                                  }}
                                  className="font-sans text-[12px] text-rose/70 transition-colors hover:text-rose"
                                >
                                  Change
                                </button>
                              </div>
                            ) : (
                              <div className="mb-6">
                                <select
                                  value=""
                                  onChange={(e) => {
                                    const svc = services.find((s) => s.id === Number(e.target.value));
                                    if (svc) {
                                      setSelectedService(svc);
                                      setSelectedProvider(null);
                                    }
                                  }}
                                  className="w-full rounded-xl border border-border-subtle bg-dark-primary px-4 py-3 font-sans text-[14px] text-ivory focus:border-rose/40 focus:outline-none"
                                >
                                  <option value="" disabled>Select a service...</option>
                                  {categories.map((cat) => (
                                    <optgroup key={cat.slug} label={cat.name}>
                                      {services
                                        .filter((s) => s.category_slug === cat.slug)
                                        .map((s) => (
                                          <option key={s.id} value={s.id}>
                                            {s.name} — {formatPrice(s.price_cents)}
                                          </option>
                                        ))}
                                    </optgroup>
                                  ))}
                                </select>
                              </div>
                            )}

                            {/* Provider preference */}
                            {selectedService && (
                              <>
                                <h4 className="mb-3 font-sans text-[15px] font-semibold text-ivory">
                                  Provider Preference
                                </h4>
                                <div className="mb-6 flex flex-wrap gap-2">
                                  <button
                                    onClick={() => setSelectedProvider(null)}
                                    className={`rounded-full px-4 py-2 font-sans text-[13px] font-medium transition-all duration-200 ${
                                      selectedProvider === null
                                        ? "bg-rose text-ivory shadow-[0_2px_12px_rgba(194,90,131,0.3)]"
                                        : "border border-border-subtle text-body-muted hover:border-rose/30 hover:text-ivory"
                                    }`}
                                  >
                                    Any Provider
                                  </button>
                                  {providers.map((prov) => (
                                    <button
                                      key={prov.id}
                                      onClick={() => setSelectedProvider(prov)}
                                      className={`rounded-full px-4 py-2 font-sans text-[13px] font-medium transition-all duration-200 ${
                                        selectedProvider?.id === prov.id
                                          ? "bg-rose text-ivory shadow-[0_2px_12px_rgba(194,90,131,0.3)]"
                                          : "border border-border-subtle text-body-muted hover:border-rose/30 hover:text-ivory"
                                      }`}
                                    >
                                      {prov.name}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}

                            {/* Date range */}
                            <h4 className="mb-3 font-sans text-[15px] font-semibold text-ivory">
                              Preferred Date Range *
                            </h4>
                            <div className="mb-6 grid gap-4 sm:grid-cols-2">
                              <div>
                                <label className="mb-1.5 block font-sans text-[12px] font-medium text-body-muted">
                                  <Calendar size={11} className="mr-1 inline" />
                                  Earliest Date
                                </label>
                                <input
                                  type="date"
                                  value={wlDateStart}
                                  onChange={(e) => {
                                    setWlDateStart(e.target.value);
                                    if (wlDateEnd && e.target.value > wlDateEnd) setWlDateEnd(e.target.value);
                                  }}
                                  min={todayStr}
                                  className="w-full rounded-xl border border-border-subtle bg-dark-primary px-4 py-3 font-sans text-[14px] text-ivory [color-scheme:dark] focus:border-rose/40 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="mb-1.5 block font-sans text-[12px] font-medium text-body-muted">
                                  <Calendar size={11} className="mr-1 inline" />
                                  Latest Date
                                </label>
                                <input
                                  type="date"
                                  value={wlDateEnd}
                                  onChange={(e) => setWlDateEnd(e.target.value)}
                                  min={wlDateStart || todayStr}
                                  className="w-full rounded-xl border border-border-subtle bg-dark-primary px-4 py-3 font-sans text-[14px] text-ivory [color-scheme:dark] focus:border-rose/40 focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* Time-of-day preference */}
                            <h4 className="mb-3 font-sans text-[15px] font-semibold text-ivory">
                              Preferred Time of Day
                            </h4>
                            <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
                              {(["morning", "afternoon", "evening", "flexible"] as const).map((pref) => {
                                const labels = {
                                  morning: "Morning",
                                  afternoon: "Afternoon",
                                  evening: "Late Afternoon",
                                  flexible: "I’m Flexible",
                                };
                                const sublabels = {
                                  morning: "9 AM – 12 PM",
                                  afternoon: "12 – 3 PM",
                                  evening: "3 – 5 PM",
                                  flexible: "Any time",
                                };
                                const isActive = wlTimePref === pref;
                                return (
                                  <button
                                    key={pref}
                                    onClick={() => setWlTimePref(isActive ? "" : pref)}
                                    className={`rounded-xl px-3 py-3 text-center transition-all duration-200 ${
                                      isActive
                                        ? "bg-rose/15 ring-1 ring-rose/40"
                                        : "border border-border-subtle hover:border-rose/20"
                                    }`}
                                  >
                                    <p className={`font-sans text-[13px] font-semibold ${isActive ? "text-rose" : "text-ivory"}`}>
                                      {labels[pref]}
                                    </p>
                                    <p className={`font-sans text-[11px] ${isActive ? "text-rose/60" : "text-body-muted/50"}`}>
                                      {sublabels[pref]}
                                    </p>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Contact info */}
                            <h4 className="mb-3 font-sans text-[15px] font-semibold text-ivory">
                              Your Contact Information
                            </h4>

                            {renderContactFields()}

                            {/* Marketing consent */}
                            <label className="mb-6 flex cursor-pointer items-start gap-3">
                              <input
                                type="checkbox"
                                checked={marketingConsent}
                                onChange={(e) => setMarketingConsent(e.target.checked)}
                                className="mt-1 h-4 w-4 shrink-0 rounded border-border-subtle bg-dark-primary accent-rose"
                              />
                              <span className="font-sans text-[12px] leading-[1.6] text-body-muted/70">
                                I&apos;d like to receive occasional emails about special offers and new treatments. You can unsubscribe at any time.
                              </span>
                            </label>

                            {submitResult && !submitResult.ok && (
                              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                                <p className="font-sans text-[13px] text-red-300">{submitResult.message}</p>
                              </div>
                            )}

                            <button
                              onClick={() => {
                                if (!selectedService) {
                                  setErrors({ service: "Please select a service" });
                                  return;
                                }
                                if (!wlDateStart || !wlDateEnd) {
                                  setErrors({ date: "Please select a date range" });
                                  return;
                                }
                                if (!validateContact()) return;
                                setWlReview(true);
                                setTimeout(scrollToForm, 100);
                              }}
                              disabled={!selectedService || !wlDateStart || !wlDateEnd}
                              className="flex w-full items-center justify-center gap-2 rounded-full bg-rose px-8 py-4 font-sans text-[15px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover disabled:opacity-50 disabled:hover:translate-y-0"
                            >
                              Review Waitlist Request
                              <ArrowRight size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            {/* Review summary */}
                            <h4 className="mb-4 font-sans text-[15px] font-semibold text-ivory">
                              Review Your Waitlist Request
                            </h4>

                            <div className="mb-6 rounded-2xl border border-rose/20 bg-dark-primary p-6">
                              <div className="space-y-3 font-sans text-[14px]">
                                <div className="flex items-center justify-between">
                                  <span className="text-body-muted">Service</span>
                                  <span className="font-semibold text-ivory">{selectedService?.name}</span>
                                </div>
                                <div className="border-t border-border-subtle" />
                                <div className="flex items-center justify-between">
                                  <span className="text-body-muted">Provider</span>
                                  <span className="font-semibold text-ivory">
                                    {selectedProvider?.name || "Any Provider"}
                                  </span>
                                </div>
                                <div className="border-t border-border-subtle" />
                                <div className="flex items-center justify-between">
                                  <span className="text-body-muted">Date Range</span>
                                  <span className="text-right font-semibold text-ivory">
                                    {new Date(wlDateStart + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                    {" – "}
                                    {new Date(wlDateEnd + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                  </span>
                                </div>
                                <div className="border-t border-border-subtle" />
                                <div className="flex items-center justify-between">
                                  <span className="text-body-muted">Time Preference</span>
                                  <span className="font-semibold text-ivory">
                                    {wlTimePref ? timePrefs[wlTimePref]?.label || "Not specified" : "Not specified"}
                                  </span>
                                </div>
                                <div className="border-t border-border-subtle" />
                                <div className="flex items-center justify-between">
                                  <span className="text-body-muted">Name</span>
                                  <span className="text-ivory">{customerName}</span>
                                </div>
                                <div className="border-t border-border-subtle" />
                                <div className="flex items-center justify-between">
                                  <span className="text-body-muted">Email</span>
                                  <span className="text-ivory">{customerEmail}</span>
                                </div>
                                <div className="border-t border-border-subtle" />
                                <div className="flex items-center justify-between">
                                  <span className="text-body-muted">Phone</span>
                                  <span className="text-ivory">{customerPhone}</span>
                                </div>
                                {customerNotes && (
                                  <>
                                    <div className="border-t border-border-subtle" />
                                    <div>
                                      <span className="text-body-muted">Notes</span>
                                      <p className="mt-1 text-[13px] italic text-ivory/70">{customerNotes}</p>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="mb-6 rounded-xl border border-rose/10 bg-rose/5 px-5 py-4">
                              <p className="font-sans text-[13px] leading-[1.7] text-body-muted">
                                <strong className="text-ivory">Reminder:</strong> Submitting this form places you on our waitlist. It does not confirm an appointment. We will reach out to you when an opening becomes available.
                              </p>
                            </div>

                            {submitResult && !submitResult.ok && (
                              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                                <p className="font-sans text-[13px] text-red-300">{submitResult.message}</p>
                              </div>
                            )}

                            <button
                              onClick={handleSubmitWaitlist}
                              disabled={submitting}
                              className="flex w-full items-center justify-center gap-2 rounded-full bg-rose px-8 py-4 font-sans text-[15px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover disabled:opacity-50 disabled:hover:translate-y-0"
                            >
                              {submitting ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : (
                                <>
                                  Submit Waitlist Request
                                  <ArrowRight size={16} />
                                </>
                              )}
                            </button>

                            <p className="mt-4 text-center font-sans text-[12px] text-body-muted/50">
                              You can unsubscribe from marketing communications at any time.
                            </p>
                          </>
                        )}
                      </motion.div>
                    )}

                    {/* STEP 5: Review & Contact */}
                    {step === 5 && selectedService && selectedProvider && selectedDate && selectedTime && (
                      <motion.div
                        key="step5"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.4, ease }}
                      >
                        <button onClick={handleBack} className="mb-6 flex items-center gap-2 font-sans text-[13px] font-medium text-body-muted transition-colors hover:text-ivory">
                          <ArrowLeft size={14} />
                          Change date/time
                        </button>

                        <h4 className="mb-4 font-sans text-[15px] font-semibold text-ivory">
                          Review Your Appointment
                        </h4>

                        <div className="mb-8 rounded-2xl border border-rose/20 bg-dark-primary p-6">
                          <div className="space-y-3 font-sans text-[14px]">
                            <div className="flex items-center justify-between">
                              <span className="text-body-muted">Service</span>
                              <span className="font-semibold text-ivory">{selectedService.name}</span>
                            </div>
                            <div className="border-t border-border-subtle" />
                            <div className="flex items-center justify-between">
                              <span className="text-body-muted">Provider</span>
                              <span className="font-semibold text-ivory">{selectedProvider.name}</span>
                            </div>
                            <div className="border-t border-border-subtle" />
                            <div className="flex items-center justify-between">
                              <span className="text-body-muted">Date</span>
                              <span className="font-semibold text-ivory">
                                {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
                                  weekday: "long",
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="border-t border-border-subtle" />
                            <div className="flex items-center justify-between">
                              <span className="text-body-muted">Time</span>
                              <span className="font-semibold text-ivory">{formatTime(selectedTime)} ET</span>
                            </div>
                            <div className="border-t border-border-subtle" />
                            <div className="flex items-center justify-between">
                              <span className="text-body-muted">Duration</span>
                              <span className="text-ivory">{formatDuration(selectedService.duration_minutes)}</span>
                            </div>
                            <div className="border-t border-border-subtle" />
                            <div className="flex items-center justify-between">
                              <span className="text-body-muted">Price</span>
                              <span className="heading-serif text-xl text-rose">{formatPrice(selectedService.price_cents)}</span>
                            </div>
                          </div>
                        </div>

                        <h4 className="mb-4 font-sans text-[15px] font-semibold text-ivory">
                          Your Contact Information
                        </h4>

                        {renderContactFields()}

                        {submitResult && !submitResult.ok && (
                          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                            <p className="font-sans text-[13px] text-red-300">{submitResult.message}</p>
                          </div>
                        )}

                        <button
                          onClick={handleSubmitAppointment}
                          disabled={submitting}
                          className="flex w-full items-center justify-center gap-2 rounded-full bg-rose px-8 py-4 font-sans text-[15px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover disabled:opacity-50 disabled:hover:translate-y-0"
                        >
                          {submitting ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <>
                              Request Appointment
                              <ArrowRight size={16} />
                            </>
                          )}
                        </button>

                        <p className="mt-4 text-center font-sans text-[12px] text-body-muted/50">
                          Your request will be pending until confirmed by our team.
                        </p>
                      </motion.div>
                    )}

                    {/* STEP 6: Confirmation */}
                    {step === 6 && submitResult?.ok && (
                      <motion.div
                        key="step6"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease }}
                        className="text-center"
                      >
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose/15">
                          <Check size={28} className="text-rose" />
                        </div>

                        <h3 className="heading-serif mb-4 text-3xl text-ivory md:text-4xl">
                          {showWaitlist ? "You’re on the Waitlist" : "Request Received"}
                        </h3>

                        <p className="mx-auto mb-8 max-w-md font-sans text-[15px] leading-[1.75] text-body-muted">
                          {submitResult.message}
                        </p>

                        {showWaitlist && selectedService && (
                          <div className="mx-auto mb-8 max-w-sm rounded-2xl border border-border-subtle bg-dark-primary p-6 text-left">
                            <div className="space-y-2 font-sans text-[14px]">
                              <div className="flex justify-between">
                                <span className="text-body-muted">Service</span>
                                <span className="text-ivory">{selectedService.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-body-muted">Provider</span>
                                <span className="text-ivory">{selectedProvider?.name || "Any"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-body-muted">Dates</span>
                                <span className="text-ivory">
                                  {new Date(wlDateStart + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                  {" – "}
                                  {new Date(wlDateEnd + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                </span>
                              </div>
                              {wlTimePref && (
                                <div className="flex justify-between">
                                  <span className="text-body-muted">Time</span>
                                  <span className="text-ivory">{timePrefs[wlTimePref]?.label}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-body-muted">Status</span>
                                <span className="rounded-full bg-amber-500/10 px-3 py-0.5 text-[12px] font-semibold text-amber-400">
                                  On Waitlist
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {!showWaitlist && selectedService && selectedProvider && selectedDate && selectedTime && (
                          <div className="mx-auto mb-8 max-w-sm rounded-2xl border border-border-subtle bg-dark-primary p-6 text-left">
                            <div className="space-y-2 font-sans text-[14px]">
                              <div className="flex justify-between">
                                <span className="text-body-muted">Service</span>
                                <span className="text-ivory">{selectedService.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-body-muted">Date</span>
                                <span className="text-ivory">
                                  {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-body-muted">Time</span>
                                <span className="text-ivory">{formatTime(selectedTime)} ET</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-body-muted">Status</span>
                                <span className="rounded-full bg-amber-500/10 px-3 py-0.5 text-[12px] font-semibold text-amber-400">
                                  Pending Confirmation
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => {
                            setStep(1);
                            setSelectedService(null);
                            setSelectedProvider(null);
                            setSelectedDate("");
                            setSelectedTime("");
                            setCustomerName("");
                            setCustomerEmail("");
                            setCustomerPhone("");
                            setCustomerNotes("");
                            setSubmitResult(null);
                            setShowWaitlist(false);
                            setWlReview(false);
                            setWlTimePref("");
                            setMarketingConsent(false);
                            setWlDateStart("");
                            setWlDateEnd("");
                          }}
                          className="inline-flex items-center gap-2 rounded-full border border-border-subtle px-6 py-3 font-sans text-[14px] font-medium text-body-muted transition-all duration-300 hover:border-rose/30 hover:text-ivory"
                        >
                          Book Another Appointment
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>

              {/* Sidebar */}
              {step < 6 && (
                <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.7, ease }}
                    className="rounded-2xl border border-border-subtle bg-dark-primary p-7"
                  >
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose/10">
                        <Phone size={16} className="text-rose" />
                      </div>
                      <h2 className="font-sans text-[15px] font-semibold text-ivory">
                        Call or Text Us
                      </h2>
                    </div>
                    <p className="mb-5 font-sans text-[14px] leading-[1.75] text-body-muted">
                      Prefer to book by phone? Call or text us and we&apos;ll help
                      you find the right treatment and time.
                    </p>
                    <a
                      href="tel:6072628566"
                      className="inline-flex w-full items-center justify-center rounded-full border border-border-subtle px-6 py-3 font-sans text-[14px] font-semibold text-ivory transition-all duration-300 hover:border-rose/30 hover:bg-rose/5"
                    >
                      <Phone size={15} className="mr-2.5" />
                      607-262-8566
                    </a>
                  </motion.div>

                  {!showWaitlist && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.7, delay: 0.05, ease }}
                      className="rounded-2xl border border-dashed border-rose/20 bg-rose/[0.03] p-6"
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose/10">
                          <Clock size={16} className="text-rose" />
                        </div>
                        <h2 className="font-sans text-[15px] font-semibold text-ivory">
                          Join the Waitlist
                        </h2>
                      </div>
                      <p className="mb-4 font-sans text-[13px] leading-[1.7] text-body-muted/70">
                        No time works? Tell us your preferences and we&apos;ll reach out when something opens up.
                      </p>
                      <button
                        onClick={() => enterWaitlist()}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-rose/30 px-5 py-2.5 font-sans text-[13px] font-semibold text-rose transition-all duration-300 hover:bg-rose/10"
                      >
                        <Clock size={14} />
                        Join Waitlist
                      </button>
                    </motion.div>
                  )}

                  <motion.a
                    href="https://skinstudioithaca.com/cancellation-policy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.7, delay: 0.1, ease }}
                    className="group flex items-center gap-4 rounded-2xl border border-border-subtle bg-dark-primary p-6 transition-all duration-300 hover:border-rose/20"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose/10">
                      <FileText size={16} className="text-rose" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-sans text-[14px] font-semibold text-ivory">
                        Cancellation Policy
                      </p>
                      <p className="font-sans text-[12px] text-body-muted/60">
                        Please review before booking
                      </p>
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="shrink-0 text-body-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ivory"
                    />
                  </motion.a>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <Testimonials showCTAs={false} />

        {/* Subscribe */}
        <section className="bg-dark-primary py-20 md:py-28">
          <div className="mx-auto max-w-[800px] px-6 text-center lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease }}
            >
              <SectionLabel text="Stay Connected" align="center" />
              <h2 className="heading-serif mb-8 text-3xl md:text-4xl lg:text-5xl">
                Get Our Special <span className="heading-serif-italic">Offers</span>
              </h2>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  placeholder="Your e-mail address"
                  className="flex-1 rounded-full border border-border-subtle bg-dark-secondary px-6 py-3.5 font-sans text-[14px] text-ivory placeholder:text-body-muted/50 focus:border-rose/40 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-full bg-rose px-8 py-3.5 font-sans text-[14px] font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-hover"
                >
                  Subscribe
                </button>
              </form>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );

  function renderContactFields() {
    return (
      <div className="mb-6 space-y-4">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 font-sans text-[12px] font-medium text-body-muted">
            <User size={12} />
            Full Name *
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => {
              setCustomerName(e.target.value);
              if (errors.name) setErrors((p) => ({ ...p, name: "" }));
            }}
            placeholder="Your full name"
            className={`w-full rounded-xl border bg-dark-primary px-4 py-3 font-sans text-[14px] text-ivory placeholder:text-body-muted/40 focus:outline-none ${
              errors.name ? "border-red-500/50 focus:border-red-500" : "border-border-subtle focus:border-rose/40"
            }`}
          />
          {errors.name && <p className="mt-1 font-sans text-[12px] text-red-400">{errors.name}</p>}
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 font-sans text-[12px] font-medium text-body-muted">
            <Mail size={12} />
            Email Address *
          </label>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => {
              setCustomerEmail(e.target.value);
              if (errors.email) setErrors((p) => ({ ...p, email: "" }));
            }}
            placeholder="your@email.com"
            className={`w-full rounded-xl border bg-dark-primary px-4 py-3 font-sans text-[14px] text-ivory placeholder:text-body-muted/40 focus:outline-none ${
              errors.email ? "border-red-500/50 focus:border-red-500" : "border-border-subtle focus:border-rose/40"
            }`}
          />
          {errors.email && <p className="mt-1 font-sans text-[12px] text-red-400">{errors.email}</p>}
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 font-sans text-[12px] font-medium text-body-muted">
            <Phone size={12} />
            Phone Number *
          </label>
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => {
              setCustomerPhone(e.target.value);
              if (errors.phone) setErrors((p) => ({ ...p, phone: "" }));
            }}
            placeholder="(607) 555-1234"
            className={`w-full rounded-xl border bg-dark-primary px-4 py-3 font-sans text-[14px] text-ivory placeholder:text-body-muted/40 focus:outline-none ${
              errors.phone ? "border-red-500/50 focus:border-red-500" : "border-border-subtle focus:border-rose/40"
            }`}
          />
          {errors.phone && <p className="mt-1 font-sans text-[12px] text-red-400">{errors.phone}</p>}
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 font-sans text-[12px] font-medium text-body-muted">
            <MessageSquare size={12} />
            Notes (optional)
          </label>
          <textarea
            value={customerNotes}
            onChange={(e) => setCustomerNotes(e.target.value)}
            placeholder="Any special requests or skin concerns"
            rows={3}
            className="w-full resize-none rounded-xl border border-border-subtle bg-dark-primary px-4 py-3 font-sans text-[14px] text-ivory placeholder:text-body-muted/40 focus:border-rose/40 focus:outline-none"
          />
        </div>
      </div>
    );
  }
}
