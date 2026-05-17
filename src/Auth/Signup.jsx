import React, { useEffect, useState } from "react";
import { User, Phone, Mail, MapPin } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  cacheAppSettings,
  fetchAppSettings,
  readCachedAppSettings,
} from "../utils/settings";

export default function WiFiSignUp() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    password: "",
    referral_code: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

    const loadLogo = async () => {
      const cached = readCachedAppSettings();
      if (cached?.logo_url) {
        setLogoUrl(`${baseUrl}${cached.logo_url}`);
        return;
      }

      try {
        const settings = cacheAppSettings(await fetchAppSettings(baseUrl));
        if (settings.logo_url) {
          setLogoUrl(`${baseUrl}${settings.logo_url}`);
        }
      } catch {
        setLogoUrl("");
      }
    };

    loadLogo();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const referral = params.get("ref");
    if (referral) {
      setForm((prev) => ({
        ...prev,
        referral_code: referral.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6),
      }));
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      const numbersOnly = value.replace(/\D/g, "").slice(0, 10);
      setForm({ ...form, [name]: numbersOnly });
    } else if (name === "referral_code") {
      const code = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
      setForm({ ...form, [name]: code });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!form.mobile.trim()) {
      setError("Mobile number is required");
      return false;
    }
    if (form.mobile.length !== 10) {
      setError("Mobile number must be 10 digits");
      return false;
    }
    if (!form.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!form.address.trim()) {
      setError("Address is required");
      return false;
    }
    if (!form.password.trim()) {
      setError("Password is required");
      return false;
    }
    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          },
        );
        const data = await response.json();
        if (data.success) {
          setLoading(false);
          navigate("/signin");
        } else {
          setLoading(false);
          setError(data.message || "Signup failed");
        }
      } catch {
        setLoading(false);
        setError("Server error. Please try again.");
      }
    }
  };

  return (
    <div className="wifi-page flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="wifibala"
              className="h-16 w-auto object-contain"
            />
          ) : (
            <img
              src="/main.png"
              alt="wifibala"
              className="h-16 w-auto object-contain"
            />
          )}
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-1">
            Create Account
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">Sign up to get started</p>
        </div>

        {/* Form Card */}
        <div className="wifi-card p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-xs font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="wifi-input pl-10 pr-3 py-2.5"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  name="mobile"
                  type="tel"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="Enter 10-digit number"
                  maxLength="10"
                  className="wifi-input pl-10 pr-3 py-2.5"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="wifi-input pl-10 pr-3 py-2.5"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  rows="2"
                  className="wifi-textarea pl-10 pr-3 py-2.5 resize-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type="password"
                  value={form.password || ""}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="wifi-input pl-3 pr-3 py-2.5"
                />
              </div>
            </div>

            {/* Referral Code */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                Referral Code
              </label>
              <div className="relative">
                <input
                  name="referral_code"
                  type="text"
                  value={form.referral_code}
                  onChange={handleChange}
                  placeholder="Optional 6-character code"
                  maxLength="6"
                  className="wifi-input pl-3 pr-3 py-2.5 uppercase"
                />
              </div>
              <p className="text-[10px] text-[var(--color-text-muted)] mt-1">
                Optional. Enter a friend&apos;s code if you have one.
              </p>
            </div>

            {/* Sign Up Button */}
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="wifi-btn-primary w-full mt-4 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing Up...
                </div>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[var(--color-text-muted)] mt-4 px-2">
          Already have an account?{" "}
          <span
            className="text-[var(--color-primary)] hover:text-[var(--color-primary-strong)] font-semibold cursor-pointer"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </span>
        </p>

        <p className="text-center text-xs text-[var(--color-text-muted)] mt-3 px-2">
          By continuing, you agree to our{" "}
          <span
            className="text-[var(--color-primary)] cursor-pointer"
            onClick={() => navigate("/terms")}
          >
            Terms
          </span>{" "}
          and{" "}
          <span
            className="text-[var(--color-primary)] cursor-pointer"
            onClick={() => navigate("/privacy-policy")}
          >
            Privacy Policy
          </span>
        </p>
      </div>
    </div>
  );
}
