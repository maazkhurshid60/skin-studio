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
  ChevronDown,
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

function formatDisplayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return `${MONTHS[m - 1].slice(0, 3)} ${d}, ${y}`;
}

// Styled replacement for <input type="date">, whose popup can't be themed
function DatePicker({
  value,
  onChange,
  min,
  placeholder = "Select a date",
  rangeStart,
  rangeEnd,
}: {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  placeholder?: string;
  rangeStart?: string;
  rangeEnd?: string;
}) {
  const [open, setOpen] = useState(false);
  const initial = value || min || getDateString(new Date());
  const [view, setView] = useState(() => {
    const [y, m] = initial.split("-").map(Number);
    return { year: y, month: m - 1 };
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const todayStr = getDateString(new Date());

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggle() {
    if (!open) {
      const [y, m] = (value || min || todayStr).split("-").map(Number);
      setView({ year: y, month: m - 1 });
    }
    setOpen((o) => !o);
  }

  const { year, month } = view;
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const minMonth = min ? min.slice(0, 7) : null;
  const viewMonth = `${year}-${String(month + 1).padStart(2, "0")}`;
  const canPrev = !minMonth || viewMonth > minMonth;

  function shift(delta: number) {
    setView((p) => {
      const m = p.month + delta;
      if (m < 0) return { year: p.year - 1, month: 11 };
      if (m > 11) return { year: p.year + 1, month: 0 };
      return { year: p.year, month: m };
    });
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`flex w-full items-center justify-between rounded-xl border bg-dark-primary px-4 py-3 text-left font-sans text-[14px] transition-colors focus:outline-none ${
          open ? "border-rose/40" : "border-border-subtle hover:border-rose/25"
        } ${value ? "text-ivory" : "text-body-muted/50"}`}
      >
        {value ? formatDisplayDate(value) : placeholder}
        <Calendar size={16} className={open ? "text-rose" : "text-body-muted/60"} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease }}
            className="absolute left-0 top-[calc(100%+8px)] z-30 w-[300px] max-w-[calc(100vw-32px)] rounded-2xl border border-border-subtle bg-dark-secondary p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => canPrev && shift(-1)}
                disabled={!canPrev}
                className="flex h-8 w-8 items-center justify-center rounded-full text-body-muted transition-colors hover:bg-rose/10 hover:text-ivory disabled:pointer-events-none disabled:opacity-30"
                aria-label="Previous month"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="font-sans text-[14px] font-semibold text-ivory">
                {MONTHS[month]} {year}
              </span>
              <button
                type="button"
                onClick={() => shift(1)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-body-muted transition-colors hover:bg-rose/10 hover:text-ivory"
                aria-label="Next month"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {DAYS.map((d) => (
                <div key={d} className="py-1 text-center font-sans text-[10px] font-medium uppercase tracking-wider text-body-muted/50">
                  {d.slice(0, 2)}
                </div>
              ))}
              {cells.map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} />;

                const dateStr = `${viewMonth}-${String(day).padStart(2, "0")}`;
                const disabled = !!min && dateStr < min;
                const isSelected = dateStr === value;
                const isToday = dateStr === todayStr;
                const inRange =
                  !!rangeStart && !!rangeEnd && dateStr > rangeStart && dateStr < rangeEnd;
                const isRangeEdge = dateStr === rangeStart || dateStr === rangeEnd;

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => {
                      if (disabled) return;
                      onChange(dateStr);
                      setOpen(false);
                    }}
                    disabled={disabled}
                    className={`flex h-9 w-full items-center justify-center rounded-lg font-sans text-[13px] transition-all duration-200 ${
                      isSelected
                        ? "bg-rose font-semibold text-ivory shadow-[0_2px_12px_rgba(194,90,131,0.3)]"
                        : disabled
                          ? "cursor-not-allowed text-body-muted/20"
                          : isRangeEdge
                            ? "bg-rose/25 font-semibold text-ivory"
                            : inRange
                              ? "bg-rose/10 text-ivory hover:bg-rose/20"
                              : "text-body-muted hover:bg-rose/10 hover:text-ivory"
                    } ${isToday && !isSelected && !disabled ? "font-semibold text-rose" : ""}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-border-subtle pt-3">
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className="font-sans text-[12px] font-medium text-body-muted transition-colors hover:text-ivory"
              >
                Clear
              </button>
              {(!min || todayStr >= min) && (
                <button
                  type="button"
                  onClick={() => {
                    onChange(todayStr);
                    setOpen(false);
                  }}
                  className="font-sans text-[12px] font-semibold text-rose transition-colors hover:text-blush"
                >
                  Today
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Styled replacement for the native <select>, grouped by category
function ServiceSelect({
  categories,
  services,
  onSelect,
}: {
  categories: Category[];
  services: Service[];
  onSelect: (service: Service) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between rounded-xl border bg-dark-primary px-4 py-3 text-left font-sans text-[14px] text-body-muted/70 transition-colors focus:outline-none ${
          open ? "border-rose/40" : "border-border-subtle hover:border-rose/25"
        }`}
      >
        Select a service...
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${open ? "rotate-180 text-rose" : "text-body-muted/60"}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-[360px] overflow-y-auto overscroll-contain rounded-2xl border border-border-subtle bg-dark-secondary p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            {categories.map((cat) => {
              const items = services.filter((s) => s.category_slug === cat.slug);
              if (items.length === 0) return null;
              return (
                <div key={cat.slug} className="mb-1 last:mb-0">
                  <p className="sticky top-[-8px] z-10 bg-dark-secondary px-3 pb-2 pt-3 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-rose">
                    {cat.name}
                  </p>
                  {items.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      role="option"
                      aria-selected={false}
                      onClick={() => {
                        onSelect(s);
                        setOpen(false);
                      }}
                      className="flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left transition-colors duration-200 hover:bg-rose/10 focus:bg-rose/10 focus:outline-none"
                    >
                      <span className="font-sans text-[14px] text-ivory">{s.name}</span>
                      <span className="flex shrink-0 items-center gap-3 font-sans text-[12px] text-body-muted/70">
                        <span>{formatDuration(s.duration_minutes)}</span>
                        <span className="font-semibold text-ivory/90">{formatPrice(s.price_cents)}</span>
                      </span>
                    </button>
                  ))}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
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
                            <motion.div
                              key={service.id}
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: i * 0.04, ease }}
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
                            </motion.div>
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
                    href="/cancellation-policy"
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
