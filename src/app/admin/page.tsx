"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CalendarCheck,
  Clock,
  Users,
  Layers,
  RefreshCw,
  ChevronDown,
  Check,
  X,
  AlertCircle,
  Loader2,
  Phone,
  Mail,
  FileText,
  ArrowLeft,
} from "lucide-react";

const ADMIN_KEY = "skin-studio-admin-dev";

type Dashboard = {
  pending: number;
  confirmed: number;
  waitlist: number;
  activeServices: number;
};

type Appointment = {
  id: number;
  service_name: string;
  provider_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  notes: string | null;
  price_cents: number;
  duration_minutes: number;
  created_at: string;
};

type WaitlistItem = {
  id: number;
  service_name: string;
  provider_name: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  preferred_date_start: string;
  preferred_date_end: string;
  preferred_time_start: string | null;
  preferred_time_end: string | null;
  status: string;
  notes: string | null;
  created_at: string;
};

type ServiceItem = {
  id: number;
  name: string;
  category_name: string;
  price_cents: number;
  duration_minutes: number;
  active: number;
  description: string | null;
};

const headers = { "x-admin-key": ADMIN_KEY };

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

type Tab = "dashboard" | "appointments" | "waitlist" | "services";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<Tab>("dashboard");
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchData = useCallback(
    async (view: string, params?: string) => {
      setLoading(true);
      try {
        const url = `/api/admin?view=${view}${params ? `&${params}` : ""}`;
        const res = await fetch(url, { headers });
        if (res.status === 401) {
          setAuthenticated(false);
          return null;
        }
        return await res.json();
      } catch {
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const loadTab = useCallback(
    async (t: Tab) => {
      if (t === "dashboard") {
        const data = await fetchData("dashboard");
        if (data) setDashboard(data);
      } else if (t === "appointments") {
        const data = await fetchData("appointments", statusFilter ? `status=${statusFilter}` : "");
        if (data) setAppointments(data.appointments);
      } else if (t === "waitlist") {
        const data = await fetchData("waitlist");
        if (data) setWaitlist(data.waitlist);
      } else if (t === "services") {
        const data = await fetchData("services");
        if (data) setServices(data.services);
      }
    },
    [fetchData, statusFilter],
  );

  useEffect(() => {
    if (authenticated) loadTab(tab);
  }, [authenticated, tab, loadTab]);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin?view=dashboard", {
      headers: { "x-admin-key": keyInput },
    });
    if (res.ok) {
      setAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid admin key");
    }
  }

  async function updateStatus(
    type: "appointment" | "waitlist",
    id: number,
    status: string,
  ) {
    setUpdating(id);
    const action = type === "appointment" ? "update-appointment" : "update-waitlist";
    await fetch("/api/admin", {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ action, id, status }),
    });
    await loadTab(type === "appointment" ? "appointments" : "waitlist");
    setUpdating(null);
  }

  async function toggleService(id: number, active: boolean) {
    setUpdating(id);
    await fetch("/api/admin", {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update-service", id, active }),
    });
    await loadTab("services");
    setUpdating(null);
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1F201D] p-6">
        <form
          onSubmit={handleAuth}
          className="w-full max-w-sm rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[#292A26] p-8"
        >
          <h1
            className="mb-6 text-center text-2xl font-semibold text-[#F4EFE8]"
            style={{ fontFamily: "var(--font-serif, serif)" }}
          >
            Admin Login
          </h1>
          <label className="mb-1.5 block text-[12px] font-medium text-[#D6D0C8]">
            Admin Key
          </label>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            className="mb-4 w-full rounded-xl border border-[rgba(255,255,255,0.10)] bg-[#1F201D] px-4 py-3 text-[14px] text-[#F4EFE8] focus:border-[#C25A83]/40 focus:outline-none"
            placeholder="Enter admin key"
          />
          {authError && (
            <p className="mb-3 text-[13px] text-red-400">{authError}</p>
          )}
          <button
            type="submit"
            className="w-full rounded-full bg-[#C25A83] px-6 py-3 text-[14px] font-semibold text-[#F4EFE8] transition-colors hover:bg-[#A9466D]"
          >
            Sign In
          </button>
        </form>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "dashboard", label: "Dashboard", icon: Layers },
    { key: "appointments", label: "Appointments", icon: CalendarCheck },
    { key: "waitlist", label: "Waitlist", icon: Clock },
    { key: "services", label: "Services", icon: FileText },
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-400",
    confirmed: "bg-emerald-500/10 text-emerald-400",
    completed: "bg-blue-500/10 text-blue-400",
    cancelled: "bg-red-500/10 text-red-400",
    active: "bg-amber-500/10 text-amber-400",
    contacted: "bg-blue-500/10 text-blue-400",
    booked: "bg-emerald-500/10 text-emerald-400",
    expired: "bg-red-500/10 text-red-400",
  };

  return (
    <div className="min-h-screen bg-[#1F201D]">
      {/* Nav */}
      <header className="border-b border-[rgba(255,255,255,0.10)] bg-[#292A26] px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="flex items-center gap-2 text-[13px] text-[#D6D0C8] hover:text-[#F4EFE8]"
            >
              <ArrowLeft size={14} />
              Back to Site
            </a>
            <span className="text-[#D6D0C8]/30">|</span>
            <h1
              className="text-lg font-semibold text-[#F4EFE8]"
              style={{ fontFamily: "var(--font-serif, serif)" }}
            >
              Admin Dashboard
            </h1>
          </div>
          <button
            onClick={() => loadTab(tab)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] text-[#D6D0C8] transition-colors hover:bg-[rgba(255,255,255,0.04)] hover:text-[#F4EFE8]"
          >
            <RefreshCw size={12} />
            Refresh
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-xl border border-[rgba(255,255,255,0.10)] bg-[#292A26] p-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all ${
                  tab === t.key
                    ? "bg-[#C25A83]/15 text-[#C25A83]"
                    : "text-[#D6D0C8] hover:text-[#F4EFE8]"
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={20} className="animate-spin text-[#C25A83]" />
          </div>
        )}

        {/* Dashboard */}
        {!loading && tab === "dashboard" && dashboard && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Pending",
                value: dashboard.pending,
                icon: AlertCircle,
                color: "text-amber-400",
                bg: "bg-amber-500/10",
              },
              {
                label: "Confirmed",
                value: dashboard.confirmed,
                icon: Check,
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
              },
              {
                label: "Waitlist",
                value: dashboard.waitlist,
                icon: Clock,
                color: "text-blue-400",
                bg: "bg-blue-500/10",
              },
              {
                label: "Active Services",
                value: dashboard.activeServices,
                icon: Layers,
                color: "text-[#C25A83]",
                bg: "bg-[#C25A83]/10",
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[#292A26] p-6"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${card.bg}`}
                    >
                      <Icon size={16} className={card.color} />
                    </div>
                    <span className="text-[13px] text-[#D6D0C8]">
                      {card.label}
                    </span>
                  </div>
                  <p
                    className="text-3xl font-semibold text-[#F4EFE8]"
                    style={{ fontFamily: "var(--font-serif, serif)" }}
                  >
                    {card.value}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Appointments */}
        {!loading && tab === "appointments" && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[12px] text-[#D6D0C8]">Filter:</span>
              {["", "pending", "confirmed", "completed", "cancelled"].map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStatusFilter(s);
                      setTimeout(() => loadTab("appointments"), 0);
                    }}
                    className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors ${
                      statusFilter === s
                        ? "bg-[#C25A83]/15 text-[#C25A83]"
                        : "text-[#D6D0C8] hover:text-[#F4EFE8]"
                    }`}
                  >
                    {s || "All"}
                  </button>
                ),
              )}
            </div>

            {appointments.length === 0 ? (
              <p className="py-12 text-center text-[14px] text-[#D6D0C8]/50">
                No appointments found
              </p>
            ) : (
              <div className="space-y-3">
                {appointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[#292A26] p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="mb-1 flex items-center gap-2">
                          <h3 className="text-[15px] font-semibold text-[#F4EFE8]">
                            {appt.customer_name}
                          </h3>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                              statusColors[appt.status] || "text-[#D6D0C8]"
                            }`}
                          >
                            {appt.status}
                          </span>
                        </div>
                        <p className="mb-2 text-[14px] font-medium text-[#C25A83]">
                          {appt.service_name}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#D6D0C8]">
                          <span className="flex items-center gap-1">
                            <CalendarCheck size={11} />
                            {new Date(appt.date + "T12:00:00").toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {formatTime(appt.start_time)} –{" "}
                            {formatTime(appt.end_time)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={11} />
                            {appt.provider_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail size={11} />
                            {appt.customer_email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone size={11} />
                            {appt.customer_phone}
                          </span>
                        </div>
                        {appt.notes && (
                          <p className="mt-2 text-[12px] italic text-[#D6D0C8]/60">
                            {appt.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-1.5">
                        {appt.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                updateStatus("appointment", appt.id, "confirmed")
                              }
                              disabled={updating === appt.id}
                              className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/20"
                            >
                              <Check size={12} />
                              Confirm
                            </button>
                            <button
                              onClick={() =>
                                updateStatus("appointment", appt.id, "cancelled")
                              }
                              disabled={updating === appt.id}
                              className="flex items-center gap-1 rounded-lg bg-red-500/10 px-3 py-1.5 text-[11px] font-semibold text-red-400 transition-colors hover:bg-red-500/20"
                            >
                              <X size={12} />
                              Cancel
                            </button>
                          </>
                        )}
                        {appt.status === "confirmed" && (
                          <button
                            onClick={() =>
                              updateStatus("appointment", appt.id, "completed")
                            }
                            disabled={updating === appt.id}
                            className="flex items-center gap-1 rounded-lg bg-blue-500/10 px-3 py-1.5 text-[11px] font-semibold text-blue-400 transition-colors hover:bg-blue-500/20"
                          >
                            <Check size={12} />
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Waitlist */}
        {!loading && tab === "waitlist" && (
          <div>
            {waitlist.length === 0 ? (
              <p className="py-12 text-center text-[14px] text-[#D6D0C8]/50">
                No waitlist requests
              </p>
            ) : (
              <div className="space-y-3">
                {waitlist.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[#292A26] p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="mb-1 flex items-center gap-2">
                          <h3 className="text-[15px] font-semibold text-[#F4EFE8]">
                            {item.customer_name}
                          </h3>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                              statusColors[item.status] || "text-[#D6D0C8]"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <p className="mb-2 text-[14px] font-medium text-[#C25A83]">
                          {item.service_name}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#D6D0C8]">
                          <span>
                            {item.preferred_date_start} → {item.preferred_date_end}
                          </span>
                          {item.preferred_time_start && (
                            <span>
                              {formatTime(item.preferred_time_start)}
                              {item.preferred_time_end &&
                                ` – ${formatTime(item.preferred_time_end)}`}
                            </span>
                          )}
                          {item.provider_name && (
                            <span className="flex items-center gap-1">
                              <Users size={11} />
                              {item.provider_name}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Mail size={11} />
                            {item.customer_email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone size={11} />
                            {item.customer_phone}
                          </span>
                        </div>
                        {item.notes && (
                          <p className="mt-2 text-[12px] italic text-[#D6D0C8]/60">
                            {item.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-1.5">
                        {item.status === "active" && (
                          <>
                            <button
                              onClick={() =>
                                updateStatus("waitlist", item.id, "contacted")
                              }
                              disabled={updating === item.id}
                              className="flex items-center gap-1 rounded-lg bg-blue-500/10 px-3 py-1.5 text-[11px] font-semibold text-blue-400 transition-colors hover:bg-blue-500/20"
                            >
                              Contacted
                            </button>
                            <button
                              onClick={() =>
                                updateStatus("waitlist", item.id, "expired")
                              }
                              disabled={updating === item.id}
                              className="flex items-center gap-1 rounded-lg bg-red-500/10 px-3 py-1.5 text-[11px] font-semibold text-red-400 transition-colors hover:bg-red-500/20"
                            >
                              Expire
                            </button>
                          </>
                        )}
                        {item.status === "contacted" && (
                          <button
                            onClick={() =>
                              updateStatus("waitlist", item.id, "booked")
                            }
                            disabled={updating === item.id}
                            className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/20"
                          >
                            <Check size={12} />
                            Booked
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Services */}
        {!loading && tab === "services" && (
          <div className="space-y-2">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="flex items-center justify-between rounded-xl border border-[rgba(255,255,255,0.10)] bg-[#292A26] px-5 py-3.5"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-medium text-[#F4EFE8]">
                      {svc.name}
                    </p>
                    <span className="text-[11px] text-[#D6D0C8]/50">
                      {svc.category_name}
                    </span>
                  </div>
                  <div className="mt-0.5 flex gap-3 text-[12px] text-[#D6D0C8]">
                    <span>{formatPrice(svc.price_cents)}</span>
                    <span>{svc.duration_minutes} min</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleService(svc.id, !svc.active)}
                  disabled={updating === svc.id}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                    svc.active
                      ? "bg-emerald-500/10 text-emerald-400 hover:bg-red-500/10 hover:text-red-400"
                      : "bg-red-500/10 text-red-400 hover:bg-emerald-500/10 hover:text-emerald-400"
                  }`}
                >
                  {svc.active ? "Active" : "Inactive"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
