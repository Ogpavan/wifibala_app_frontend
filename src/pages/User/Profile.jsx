/* global __APP_VERSION__ */
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaCreditCard,
  FaCalendarDays,
  FaLocationDot,
  FaPhone,
  FaPenToSquare,
  FaCircleXmark,
  FaRightFromBracket,
  FaUser,
} from "react-icons/fa6";

const APP_VERSION = __APP_VERSION__;

export default function Profile() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    // Get user data from localStorage
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        const nextUser = {
          id: parsedUser.id,
          name: parsedUser.name || "User Name",
          email: parsedUser.email || "user@email.com",
          phone: parsedUser.mobile || "+91 00000 00000",
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(parsedUser.name || "User")}&background=1e3a8a&color=fff&size=200`,
          joined: "Jan 2024", // Default since not in localStorage
          address: parsedUser.address || "Address not provided",
        };
        setUser(nextUser);
        setForm({
          name: parsedUser.name || "",
          email: parsedUser.email || "",
          address: parsedUser.address || "",
        });
      } else {
        // Fallback user data if localStorage is empty
        const fallbackUser = {
          id: null,
          name: "Guest User",
          email: "guest@email.com",
          phone: "+91 00000 00000",
          avatar:
            "https://ui-avatars.com/api/?name=Guest+User&background=1e3a8a&color=fff&size=200",
          joined: "Jan 2024",
          address: "Address not provided",
        };
        setUser(fallbackUser);
      setForm({
        name: fallbackUser.name,
        email: fallbackUser.email,
        address: "",
      });
    }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      // Set fallback user data
      const fallbackUser = {
        id: null,
        name: "Guest User",
        email: "guest@email.com",
        phone: "+91 00000 00000",
        avatar:
          "https://ui-avatars.com/api/?name=Guest+User&background=1e3a8a&color=fff&size=200",
        joined: "Jan 2024",
        address: "Address not provided",
      };
      setUser(fallbackUser);
      setForm({
        name: fallbackUser.name,
        email: fallbackUser.email,
        address: "",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsEditing(location.pathname.endsWith("/edit-profile"));
  }, [location.pathname]);

  useEffect(() => {
    if (!user?.id) {
      setSubscription(null);
      return;
    }

    let isMounted = true;

    const fetchLatestSubscription = async () => {
      try {
        setSubscriptionLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/plans/subscription/latest/${user.id}`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load plan details");
        }

        if (isMounted) {
          setSubscription(data.subscription || null);
        }
      } catch (subscriptionError) {
        if (isMounted) {
          setSubscription(null);
          console.error("Failed to load latest subscription:", subscriptionError);
        }
      } finally {
        if (isMounted) {
          setSubscriptionLoading(false);
        }
      }
    };

    fetchLatestSubscription();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleEdit = () => {
    setIsEditing(true);
    navigate("/user/edit-profile");
  };

  const handleCancel = () => {
    setIsEditing(false);
    navigate("/user/profile");
    setError("");
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      address: user?.address || "",
    });
  };

  const handleSave = async () => {
    if (!user?.id) {
      setError("Unable to update profile.");
      return;
    }

    if (!form.name.trim() || !form.email.trim() || !form.address.trim()) {
      setError("Full name, email and address are required.");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/admin/users/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name.trim(),
            mobile: user.phone,
            email: form.email.trim(),
            address: form.address.trim(),
            password: "",
          }),
        },
      );

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile");
      }

      const nextUser = {
        ...JSON.parse(localStorage.getItem("user") || "{}"),
        id: data.user?.user_id || user.id,
        name: data.user?.name || form.name.trim(),
        email: data.user?.email || form.email.trim(),
        address: data.user?.address || form.address.trim(),
        mobile: data.user?.phone_number || user.phone,
        wallet: data.user?.wallet ?? user.wallet ?? 0,
      };
      localStorage.setItem("user", JSON.stringify(nextUser));

      setUser((prev) =>
        prev
          ? {
              ...prev,
              name: nextUser.name,
              email: nextUser.email,
              address: nextUser.address,
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(nextUser.name || "User")}&background=1e3a8a&color=fff&size=200`,
            }
          : prev,
      );
      setIsEditing(false);
      navigate("/user/profile");
    } catch (saveError) {
      setError(saveError.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("isAuthenticated");

    // Redirect to home/login page
    window.location.href = "/";
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const endDateStart = subscription?.end_date ? new Date(subscription.end_date) : null;
  if (endDateStart) {
    endDateStart.setHours(0, 0, 0, 0);
  }
  const isSubscriptionActive = endDateStart ? endDateStart.getTime() >= todayStart.getTime() : false;
  const daysLeft = endDateStart
    ? Math.max(
        Math.ceil((endDateStart.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24)),
        0,
      )
    : null;
  if (loading) {
    return (
      <div className="wifi-page flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-[var(--color-primary-soft)] border-t-[var(--color-primary)] rounded-full animate-spin mb-3"></div>
          <p className="text-[var(--color-text-muted)]">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="wifi-page flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--color-text-muted)]">Unable to load profile data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wifi-page">
      {/* Header */}
      <div className="wifi-hero wifi-hero-primary px-6 py-5 rounded-b-[28px]">
        <h1 className="wifi-page-title text-xl font-bold">Profile</h1>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 pb-20">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-28 h-28 rounded-3xl shadow-lg"
            />
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-1">{user.name}</h2>
          <p className="text-[var(--color-text-muted)] text-sm mb-1">{user.email}</p>
          <p className="text-[var(--color-text-muted)] text-xs">Member since {user.joined}</p>
        </div>

        {/* Enrolled Plan Card */}
        <div className="mb-6 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#081120] via-[#123c8a] to-[#4cc3ff] text-white shadow-2xl ring-1 ring-white/10">
          <div className="p-5">
            {subscription ? (
              <div className="flex flex-col gap-5 md:flex-row md:items-stretch">
                <div className="flex min-w-0 flex-[1.25] flex-col justify-between gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-white/70 text-[11px] font-semibold uppercase tracking-[0.32em]">
                        Enrolled Plan
                      </p>
                      <p className="mt-2 text-sm text-white/80">
                        {subscriptionLoading
                          ? "Loading..."
                          : subscription?.operator_name || "Plan details appear here once enrolled"}
                      </p>
                    </div>

                    <div className="shrink-0 rounded-[18px] border border-white/15 bg-white/15 p-3 backdrop-blur">
                      <div className="h-8 w-12 rounded-[10px] border border-white/25 bg-white/20 shadow-inner" />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    {subscription.auto_renew ? (
                      <span className="rounded-full bg-white/15 px-3 py-1">
                        Auto renew enabled
                      </span>
                    ) : null}
                    <span className="rounded-full bg-white/15 px-3 py-1">
                      {isSubscriptionActive
                        ? `Active${daysLeft !== null ? ` • ${daysLeft} days left` : ""}`
                        : "Expired"}
                    </span>
                  </div>
                </div>

                <div className="grid flex-1 grid-cols-2 gap-3 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <div className="rounded-2xl bg-white/10 p-3">
                    <div className="flex items-center gap-2 text-white/70 text-xs">
                      <FaCalendarDays className="h-3.5 w-3.5" />
                      Start Date
                    </div>
                    <p className="mt-1 text-base font-semibold">{formatDate(subscription.created_at)}</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-3">
                    <div className="flex items-center gap-2 text-white/70 text-xs">
                      <FaCalendarDays className="h-3.5 w-3.5" />
                      End Date
                    </div>
                    <p className="mt-1 text-base font-semibold">{formatDate(subscription.end_date)}</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-3">
                    <p className="text-white/70 text-xs">Plan Amount</p>
                    <p className="mt-1 text-2xl font-black">
                      ₹{Number(subscription.price_paid ?? subscription.plan_price ?? 0).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-3">
                    <p className="text-white/70 text-xs">Speed</p>
                    <p className="mt-1 text-sm font-semibold">{subscription.speed || "-"}</p>
                    <p className="mt-3 text-white/70 text-xs">Data Limit</p>
                    <p className="mt-1 text-sm font-semibold">{subscription.data_limit || "-"}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm text-white/85 backdrop-blur">
                You do not have an enrolled plan yet. Once a subscription is created, the
                start date, end date, and amount will show here.
              </div>
            )}
          </div>
        </div>

        {error ? (
          <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : null}

        {/* Personal Details */}
        <div className="wifi-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[var(--color-text)]">
              Personal Details
            </h3>
            {isEditing ? (
              <div className="inline-flex items-center gap-2 text-xs text-[var(--color-primary)] font-semibold">
                <FaPenToSquare className="w-4 h-4" />
                Editing
              </div>
            ) : (
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex items-center gap-2 text-xs text-[var(--color-primary)] font-semibold"
              >
                <FaPenToSquare className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[var(--color-primary-soft)] rounded-md">
                <FaUser className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-[var(--color-text-muted)] mb-1">Full Name</p>
                {isEditing ? (
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="wifi-input w-full px-3 py-2 text-sm"
                    placeholder="Full name"
                  />
                ) : (
                  <p className="text-[var(--color-text)] font-medium">{user.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-[var(--color-primary-soft)] rounded-md">
                <FaEnvelope className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-[var(--color-text-muted)] mb-1">Email Address</p>
                {isEditing ? (
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="wifi-input w-full px-3 py-2 text-sm"
                    placeholder="Email address"
                  />
                ) : (
                  <p className="text-[var(--color-text)] font-medium break-all">{user.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-[var(--color-primary-soft)] rounded-md">
                <FaPhone className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-[var(--color-text-muted)] mb-1">Phone Number</p>
                <p className="text-[var(--color-text)] font-medium">{user.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-[var(--color-primary-soft)] rounded-md">
                <FaLocationDot className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-[var(--color-text-muted)] mb-1">Address</p>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows="3"
                    className="wifi-textarea w-full px-3 py-2 text-sm resize-none"
                    placeholder="Address"
                  />
                ) : (
                  <p className="text-[var(--color-text)] font-medium whitespace-pre-line">
                    {user.address}
                  </p>
                )}
              </div>
            </div>
          </div>

          {isEditing ? (
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="wifi-btn-primary flex-1 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="wifi-btn-secondary flex-1 disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                <FaCircleXmark className="w-4 h-4" />
                Cancel
              </button>
            </div>
          ) : null}
        </div>

        {/* Logout Button */}
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="wifi-btn-danger w-full"
          >
            <FaRightFromBracket className="w-5 h-5" />
            Logout
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs font-semibold text-[var(--color-text-muted)]">
            wifibala v{APP_VERSION}
          </p>
        </div>
      </div>
    </div>
  );
}
