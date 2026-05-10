import React, { useEffect, useState } from "react";
import { Phone, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  cacheAppSettings,
  fetchAppSettings,
  getTelHref,
  getWhatsAppHref,
  readCachedAppSettings,
} from "../utils/settings";

export default function WiFiSignIn() {
  const [form, setForm] = useState({
    mobile: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [appSettings, setAppSettings] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

    const loadLogo = async () => {
      const cached = readCachedAppSettings();
      setAppSettings(cached);
      if (cached?.logo_url) {
        try {
          setLogoUrl(`${baseUrl}${cached.logo_url}`);
        } catch {
          // Ignore malformed cached URL values and fetch fresh settings.
        }
      }

      try {
        const settings = cacheAppSettings(await fetchAppSettings(baseUrl));
        setAppSettings(settings);
        if (settings.logo_url) {
          setLogoUrl(`${baseUrl}${settings.logo_url}`);
        }
      } catch {
        setLogoUrl("");
      }
    };

    loadLogo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      const numbersOnly = value.replace(/\D/g, "").slice(0, 10);
      setForm({ ...form, [name]: numbersOnly });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validateForm = () => {
    if (!form.mobile.trim()) {
      setError("Mobile number is required");
      return false;
    }
    if (form.mobile.length !== 10) {
      setError("Mobile number must be 10 digits");
      return false;
    }
    if (!form.password) {
      setError("Password is required");
      return false;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/signin`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          },
        );
        const data = await response.json();
        if (data.success) {
          setLoading(false);
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/user/dashboard");
        } else {
          setLoading(false);
          setError(data.message || "Signin failed");
        }
      } catch (err) {
        setLoading(false);
        setError("Server error. Please try again.");
      }
    }
  };

  const supportPhone = appSettings.primary_number || "";
  const supportWhatsapp =
    appSettings.whatsapp_number || appSettings.primary_number || "";
  const supportPhoneHref = getTelHref(supportPhone);
  const supportWhatsappHref = getWhatsAppHref(supportWhatsapp);

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
            Welcome Back
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">Sign in to your account</p>
        </div>

        {/* Form Card */}
        <div className="wifi-card p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-xs font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-4">
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

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="wifi-input pl-10 pr-10 py-2.5"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[var(--color-primary)]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="wifi-btn-primary w-full mt-4 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-[var(--color-text-muted)] text-xs">
              Don't have an account?{" "}
              <span
                className="text-[var(--color-primary)] hover:text-[var(--color-primary-strong)] font-semibold cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </p>
          </div>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-[var(--color-text-muted)] mt-4 px-2">
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

        {(supportPhone || supportWhatsapp) && (
          <div className="mt-4 text-center space-y-1">
            {supportPhone && (
              <a
                href={supportPhoneHref || undefined}
                className="block text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
              >
                Contact: {supportPhone}
              </a>
            )}
            {supportWhatsapp && (
              <a
                href={supportWhatsappHref || undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
              >
                WhatsApp: {supportWhatsapp}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
