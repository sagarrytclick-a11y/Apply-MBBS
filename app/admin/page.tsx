"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  FaUsers,
  FaChartBar,
  FaPhone,
  FaEnvelope,
  FaGraduationCap,
  FaSearch,
  FaEye,
  FaTrash,
  FaCalendarDay,
  FaCalendarWeek,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import AuthWrapper from "./components/AuthWrapper";
import { ConfirmDeleteModal } from "./components/ConfirmDeleteModal";
import { ToastStack, type ToastItem, type ToastType } from "./components/Toast";

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  courseInterest: string;
  neetScore: string;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  totalEnquiries: number;
  todayEnquiries: number;
  weekEnquiries: number;
  monthEnquiries: number;
  courseStats: Record<string, number>;
  recentEnquiries: Enquiry[];
}

const cardCls =
  "rounded-[16px] border border-white/10 bg-[#13284f] shadow-[0_8px_28px_rgba(0,0,0,0.18)]";
const fieldCls =
  "rounded-[12px] border border-white/12 bg-primary/50 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-accent/45 focus:ring-2 focus:ring-accent/15";

function pageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push("…");
    out.push(sorted[i]);
  }
  return out;
}

const AdminPanel: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Enquiry | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string>("");

  const enquiriesPerPage = 10;

  const pushToast = useCallback((type: ToastType, message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev.slice(-3), { id, type, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    setUpdatedAt(new Date().toLocaleString());
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchStats();
    fetchEnquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, debouncedSearch]);

  // Soft auto-refresh so new form leads show without a full page reload
  useEffect(() => {
    const id = window.setInterval(() => {
      fetchEnquiries({ silent: true });
      fetchStats();
    }, 20000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, debouncedSearch]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats", { credentials: "include" });
      const data = await response.json();
      if (!response.ok) {
        setStats(null);
        return;
      }
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats(null);
    }
  };

  const fetchEnquiries = async (opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false;
    try {
      if (!silent) setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: enquiriesPerPage.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
      });

      const response = await fetch(`/api/admin/enquiries?${params}`, {
        credentials: "include",
      });
      const data = await response.json();

      setEnquiries(Array.isArray(data.enquiries) ? data.enquiries : []);
      setTotalPages(data.pagination?.pages || 1);
      setTotalResults(data.pagination?.total || 0);
      setUpdatedAt(new Date().toLocaleString());
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      if (!silent) {
        setEnquiries([]);
        setTotalPages(1);
        setTotalResults(0);
        pushToast("error", "Failed to load enquiries");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const confirmDeleteEnquiry = async () => {
    if (!deleteTarget) return;
    const enquiryId = deleteTarget._id;
    const enquiryName = deleteTarget.name;
    if (deletingId) return;

    setDeletingId(enquiryId);

    // Snap UI instantly — close modal + remove row before network finishes
    const previous = enquiries;
    const previousTotal = totalResults;
    const previousStats = stats;
    const wasLastOnPage = previous.length === 1 && currentPage > 1;

    setDeleteTarget(null);
    setEnquiries((list) => list.filter((e) => e._id !== enquiryId));
    setTotalResults((n) => Math.max(0, n - 1));
    setTotalPages((pages) => {
      const nextTotal = Math.max(0, previousTotal - 1);
      return Math.max(1, Math.ceil(nextTotal / enquiriesPerPage));
    });
    if (selectedEnquiry?._id === enquiryId) {
      setShowDetails(false);
      setSelectedEnquiry(null);
    }
    // Optimistic stats so cards don't wait on Mongo aggregates
    if (stats) {
      setStats({
        ...stats,
        totalEnquiries: Math.max(0, (stats.totalEnquiries || 0) - 1),
      });
    }
    pushToast("success", `${enquiryName} deleted`);
    setDeletingId(null);

    if (wasLastOnPage) {
      setCurrentPage((p) => p - 1);
    }

    try {
      const response = await fetch(
        `/api/admin/enquiries?id=${encodeURIComponent(enquiryId)}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: enquiryId }),
        }
      );

      if (!response.ok) {
        setEnquiries(previous);
        setTotalResults(previousTotal);
        setStats(previousStats);
        const data = await response.json().catch(() => ({}));
        pushToast("error", data.error || "Failed to delete enquiry");
        return;
      }

      // Quiet background sync — don't block UI / spinner
      if (!wasLastOnPage) {
        void fetchEnquiries({ silent: true });
        void fetchStats();
      }
    } catch (error) {
      console.error("Error deleting enquiry:", error);
      setEnquiries(previous);
      setTotalResults(previousTotal);
      setStats(previousStats);
      pushToast("error", "Failed to delete enquiry");
    }
  };

  const rangeStart =
    totalResults === 0 ? 0 : (currentPage - 1) * enquiriesPerPage + 1;
  const rangeEnd = Math.min(currentPage * enquiriesPerPage, totalResults);

  const statCards = [
    {
      label: "Total Enquiries",
      value: stats?.totalEnquiries ?? "—",
      icon: FaUsers,
      accent: "text-accent",
      glow: "bg-accent/15",
    },
    {
      label: "Today",
      value: stats?.todayEnquiries ?? "—",
      icon: FaCalendarDay,
      accent: "text-sky-300",
      glow: "bg-sky-400/10",
    },
    {
      label: "This Week",
      value: stats?.weekEnquiries ?? "—",
      icon: FaCalendarWeek,
      accent: "text-accent",
      glow: "bg-accent/10",
    },
    {
      label: "This Month",
      value: stats?.monthEnquiries ?? "—",
      icon: FaCalendarAlt,
      accent: "text-emerald-300",
      glow: "bg-emerald-400/10",
    },
  ];

  return (
    <AuthWrapper>
      <div className="relative min-h-[calc(100vh-4rem)] bg-primary text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-white/5 blur-[90px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 font-body text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                Overview
              </p>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-white">
                Dashboard
              </h2>
              <p className="mt-1 font-body text-sm text-white/55">
                Manage student enquiries
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="font-body text-[11px] uppercase tracking-wider text-white/40">
                Last updated
              </p>
              <p className="font-body text-sm text-white/65">{updatedAt || "—"}</p>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => (
              <div
                key={card.label}
                className={`${cardCls} p-5 transition hover:border-accent/30`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-[12px] ${card.glow}`}
                  >
                    <card.icon className={`text-lg ${card.accent}`} />
                  </div>
                  <div>
                    <p className="font-body text-[11px] uppercase tracking-wider text-white/45">
                      {card.label}
                    </p>
                    <p className="mt-1 font-display text-2xl font-extrabold tracking-tight text-white">
                      {card.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`${cardCls} mb-6 p-4 sm:p-5`}>
            <div className="relative">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-white/35" />
              <input
                type="text"
                placeholder="Search by name, email, phone, course…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className={`${fieldCls} w-full py-3 pl-10 pr-4`}
              />
            </div>
          </div>

          <div className={`overflow-hidden ${cardCls}`}>
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h3 className="font-display text-sm font-extrabold text-white">
                  Enquiries
                </h3>
                <p className="font-body text-xs text-white/45">
                  {totalResults === 0
                    ? "No records"
                    : `Showing ${rangeStart}–${rangeEnd} of ${totalResults}`}
                  {" · "}
                  {enquiriesPerPage} per page
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full font-body">
                <thead>
                  <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-wider text-white/45">
                    <th className="px-5 py-3 font-semibold">Name</th>
                    <th className="px-5 py-3 font-semibold">Contact</th>
                    <th className="px-5 py-3 font-semibold">Course</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={`sk-${i}`} className="border-b border-white/5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <td key={j} className="px-5 py-4">
                            <div className="h-4 w-full max-w-[140px] animate-pulse rounded bg-white/10" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : enquiries.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-16 text-center">
                        <FaChartBar className="mx-auto mb-3 text-2xl text-white/25" />
                        <p className="text-sm text-white/55">No enquiries found</p>
                        <p className="mt-1 text-xs text-white/35">
                          New form submissions will appear here
                        </p>
                      </td>
                    </tr>
                  ) : (
                    enquiries.map((enquiry) => (
                      <tr
                        key={enquiry._id}
                        className="border-b border-white/5 transition hover:bg-white/[0.04]"
                      >
                        <td className="px-5 py-4">
                          <div className="text-sm font-semibold text-white">
                            {enquiry.name}
                          </div>
                          {enquiry.neetScore && (
                            <div className="mt-0.5 text-xs text-white/45">
                              NEET: {enquiry.neetScore}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-white/75">
                            <FaEnvelope className="text-[10px] text-accent/80" />
                            {enquiry.email}
                          </div>
                          {enquiry.mobile && (
                            <div className="mt-1 flex items-center gap-2 text-xs text-white/45">
                              <FaPhone className="text-[10px] text-accent/70" />
                              {enquiry.mobile}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-white/75">
                            <FaGraduationCap className="text-accent/80" />
                            {enquiry.courseInterest}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-white/45">
                          {new Date(enquiry.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedEnquiry(enquiry);
                                setShowDetails(true);
                              }}
                              className="rounded-[10px] border border-white/10 p-2 text-white/50 transition hover:border-accent/40 hover:text-accent"
                              title="View"
                            >
                              <FaEye className="text-xs" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(enquiry)}
                              disabled={deletingId === enquiry._id}
                              className="rounded-[10px] border border-white/10 p-2 text-white/50 transition hover:border-red-400/40 hover:text-red-300 disabled:opacity-40"
                              title="Delete"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination — always visible when there are results */}
            {totalResults > 0 && (
              <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-body text-xs text-white/45">
                  Page {currentPage} of {Math.max(totalPages, 1)} · {totalResults}{" "}
                  {totalResults === 1 ? "result" : "results"}
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || loading}
                    className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-white/10 px-3 font-body text-xs font-semibold text-white/70 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FaChevronLeft className="text-[10px]" />
                    Prev
                  </button>

                  {pageNumbers(currentPage, Math.max(totalPages, 1)).map(
                    (p, idx) =>
                      p === "…" ? (
                        <span
                          key={`e-${idx}`}
                          className="px-1.5 font-body text-xs text-white/35"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setCurrentPage(p)}
                          disabled={loading}
                          className={`inline-flex h-9 min-w-9 items-center justify-center rounded-[10px] border px-2.5 font-body text-xs font-bold transition ${
                            p === currentPage
                              ? "border-accent/50 bg-accent text-white"
                              : "border-white/10 text-white/70 hover:bg-white/5"
                          }`}
                        >
                          {p}
                        </button>
                      )
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(Math.max(totalPages, 1), p + 1))
                    }
                    disabled={currentPage >= totalPages || loading}
                    className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-white/10 px-3 font-body text-xs font-semibold text-white/70 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <FaChevronRight className="text-[10px]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDetails && selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/80 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[20px] border border-white/10 bg-[#13284f] shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
            <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-[#13284f]/95 px-6 py-4 backdrop-blur">
              <div>
                <h3 className="font-display text-lg font-extrabold text-white">
                  Enquiry Details
                </h3>
                <p className="font-body text-xs text-white/45">{selectedEnquiry.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="rounded-[10px] border border-white/10 px-3 py-1.5 font-body text-sm text-white/55 transition hover:bg-white/5 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 p-6 font-body">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  ["Name", selectedEnquiry.name],
                  ["Email", selectedEnquiry.email],
                  ["Mobile", selectedEnquiry.mobile || "Not provided"],
                  ["Course Interest", selectedEnquiry.courseInterest],
                  ["NEET Score", selectedEnquiry.neetScore || "Not provided"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="mb-1.5 text-[11px] uppercase tracking-wider text-white/45">
                      {label}
                    </p>
                    <p className="rounded-[12px] border border-white/10 bg-primary/40 px-3.5 py-3 text-sm text-white/85">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="mb-1.5 text-[11px] uppercase tracking-wider text-white/45">
                      Created
                    </p>
                    <p className="rounded-[12px] border border-white/10 bg-primary/40 px-3.5 py-3 text-sm text-white/75">
                      {new Date(selectedEnquiry.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1.5 text-[11px] uppercase tracking-wider text-white/45">
                      Last Updated
                    </p>
                    <p className="rounded-[12px] border border-white/10 bg-primary/40 px-3.5 py-3 text-sm text-white/75">
                      {new Date(selectedEnquiry.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(selectedEnquiry)}
                  className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm font-semibold text-red-200 transition hover:bg-red-400/20"
                >
                  <FaTrash className="text-xs" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        open={Boolean(deleteTarget)}
        name={deleteTarget?.name}
        loading={Boolean(deletingId)}
        onCancel={() => {
          if (!deletingId) setDeleteTarget(null);
        }}
        onConfirm={confirmDeleteEnquiry}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </AuthWrapper>
  );
};

export default AdminPanel;
