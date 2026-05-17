import { useEffect, useMemo, useState } from "react";
import {
  FaArrowRotateRight,
  FaCircleCheck,
  FaClock,
  FaMagnifyingGlass,
  FaRotate,
  FaTriangleExclamation,
  FaWifi,
} from "react-icons/fa6";

const PORT_REQUEST_STORAGE_KEY = "wifi_port_change_requests";

function readPortRequests() {
  try {
    const raw = localStorage.getItem(PORT_REQUEST_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writePortRequests(requests) {
  localStorage.setItem(PORT_REQUEST_STORAGE_KEY, JSON.stringify(requests));
}

function formatDateTime(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusStyles(status) {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-700 border-green-200";
    case "completed":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "rejected":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-amber-100 text-amber-700 border-amber-200";
  }
}

export default function PortChangeRequests() {
  const [requests, setRequests] = useState(() => readPortRequests());
  const [search, setSearch] = useState("");

  useEffect(() => {
    const syncRequests = () => setRequests(readPortRequests());
    window.addEventListener("storage", syncRequests);
    return () => window.removeEventListener("storage", syncRequests);
  }, []);

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return requests;

    return requests.filter((request) => {
      const haystack = [
        request.id,
        request.user_name,
        request.user_phone,
        request.current_provider,
        request.requested_provider,
        request.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [requests, search]);

  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((request) => request.status === "pending").length;
    const approved = requests.filter((request) => request.status === "approved").length;
    const completed = requests.filter((request) => request.status === "completed").length;

    return { total, pending, approved, completed };
  }, [requests]);

  const updateStatus = (requestId, nextStatus) => {
    const nextRequests = requests.map((request) =>
      request.id === requestId
        ? {
            ...request,
            status: nextStatus,
            reviewed_at: new Date().toISOString(),
          }
        : request,
    );

    setRequests(nextRequests);
    writePortRequests(nextRequests);
  };

  return (
    <div className="wifi-page bg-white">
      <div className="wifi-hero wifi-hero-primary px-6 py-6 rounded-b-[28px]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 wifi-badge bg-white/10 text-white border border-white/15 mb-3">
              <FaWifi className="h-3.5 w-3.5" />
              Admin Console
            </div>
            <h1 className="wifi-page-title text-2xl font-bold mb-1">
              Port Change Requests
            </h1>
            <p className="wifi-hero-subtitle text-sm">
              Review and manage the port change requests submitted by users.
            </p>
          </div>

          <button
            onClick={() => setRequests(readPortRequests())}
            className="wifi-btn-secondary bg-white/10 border-white/15 text-white hover:bg-white/15"
          >
            <FaArrowRotateRight className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="wifi-page-shell px-4 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <div className="wifi-card-strong p-4">
            <p className="text-xs text-[var(--color-text-muted)] mb-1">Total Requests</p>
            <h3 className="text-2xl font-bold text-[var(--color-text)]">{stats.total}</h3>
          </div>
          <div className="wifi-card-strong p-4">
            <p className="text-xs text-[var(--color-text-muted)] mb-1">Pending</p>
            <h3 className="text-2xl font-bold text-amber-600">{stats.pending}</h3>
          </div>
          <div className="wifi-card-strong p-4">
            <p className="text-xs text-[var(--color-text-muted)] mb-1">Approved</p>
            <h3 className="text-2xl font-bold text-green-600">{stats.approved}</h3>
          </div>
          <div className="wifi-card-strong p-4">
            <p className="text-xs text-[var(--color-text-muted)] mb-1">Completed</p>
            <h3 className="text-2xl font-bold text-blue-600">{stats.completed}</h3>
          </div>
        </div>

        <div className="wifi-card-strong p-4 mb-5">
          <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">
            Search requests
          </label>
          <div className="relative">
            <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] h-4 w-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by user, provider, phone, or status"
              className="wifi-input pl-10"
            />
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="wifi-card-strong p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center mx-auto mb-4">
              <FaTriangleExclamation className="h-6 w-6 text-[var(--color-primary)]" />
            </div>
            <h2 className="text-lg font-bold text-[var(--color-text)] mb-1">
              No port requests found
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              User submissions will appear here after they request a port change.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRequests.map((request) => (
              <div key={request.id} className="wifi-card-strong p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`wifi-badge border ${getStatusStyles(request.status)}`}
                      >
                        {request.status}
                      </span>
                      <span className="text-xs font-medium text-[var(--color-text-muted)]">
                        Request ID: {request.id}
                      </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="text-xs text-[var(--color-text-muted)] mb-1">User</p>
                        <p className="font-semibold text-[var(--color-text)]">
                          {request.user_name || "Unknown User"}
                        </p>
                        <p className="text-sm text-[var(--color-text-muted)]">
                          {request.user_phone || "No phone saved"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--color-text-muted)] mb-1">Current Port</p>
                        <p className="font-semibold text-[var(--color-text)]">
                          {request.current_provider || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--color-text-muted)] mb-1">
                          Requested Port
                        </p>
                        <p className="font-semibold text-[var(--color-text)]">
                          {request.requested_provider || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--color-text-muted)] mb-1">Submitted</p>
                        <p className="font-semibold text-[var(--color-text)]">
                          {formatDateTime(request.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                      <FaClock className="h-3.5 w-3.5" />
                      <span>
                        Reviewed: {request.reviewed_at ? formatDateTime(request.reviewed_at) : "Not reviewed yet"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <button
                      onClick={() => updateStatus(request.id, "approved")}
                      className="wifi-btn-secondary text-sm"
                    >
                      <FaCircleCheck className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(request.id, "completed")}
                      className="wifi-btn-primary text-sm"
                    >
                      <FaRotate className="h-4 w-4" />
                      Complete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
