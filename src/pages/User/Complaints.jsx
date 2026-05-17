import { useEffect, useState } from "react";
import {
  FaCircleCheck,
  FaCircleExclamation,
  FaEnvelope,
  FaPaperPlane,
  FaPhone,
  FaTriangleExclamation,
} from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import {
  cacheAppSettings,
  fetchAppSettings,
  getTelHref,
  getWhatsAppHref,
  readCachedAppSettings,
} from "../../utils/settings";

export default function HelpComplaintCenter() {
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "general",
    priority: "medium",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [complaintId, setComplaintId] = useState(null);
  const [contactSettings, setContactSettings] = useState(() => readCachedAppSettings());

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = cacheAppSettings(
          await fetchAppSettings(import.meta.env.VITE_API_BASE_URL),
        );
        setContactSettings(settings);
      } catch (err) {
        console.error("Failed to load contact settings:", err);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear error when user makes changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get user info from localStorage
      const userInfo = JSON.parse(localStorage.getItem("user"));
      if (!userInfo || !userInfo.id) {
        throw new Error("User not logged in");
      }

      const complaintData = {
        user_id: userInfo.id,
        subject: formData.subject,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/complaints/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(complaintData),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit complaint");
      }

      console.log("Complaint submitted successfully:", result);
      setComplaintId(result.complaint.complaint_id);
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setComplaintId(null);
        setFormData({
          subject: "",
          description: "",
          category: "general",
          priority: "medium",
        });
      }, 3000);
    } catch (err) {
      console.error("Error submitting complaint:", err);
      setError(err.message || "Failed to submit complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    const href = getTelHref(contactSettings.primary_number);
    window.location.href = href || "tel:+1234567890";
  };

  const handleWhatsApp = () => {
    const href =
      getWhatsAppHref(contactSettings.whatsapp_number) ||
      getWhatsAppHref(contactSettings.primary_number) ||
      "https://wa.me/1234567890";
    window.open(`${href}?text=Hi, I need help with...`, "_blank");
  };

  const supportPhone = contactSettings.primary_number || "+1 (234) 567-890";
  const supportWhatsApp =
    contactSettings.whatsapp_number ||
    contactSettings.primary_number ||
    "24/7 Support";
  const supportEmail = contactSettings.email_id || "support@example.com";

  if (submitted) {
    return (
      <div className="wifi-page flex items-center justify-center px-6 pb-32">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-green-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <FaCircleCheck className="text-white text-[32px]" />
          </div>
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-1">
            Complaint Registered
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm mb-1">ID: #{complaintId}</p>
          <p className="text-[var(--color-text-muted)] text-xs">We'll respond within 24 hours</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wifi-page pb-32">
      {/* Header */}
      <div className="wifi-hero wifi-hero-primary px-6 py-6 rounded-b-[28px] text-center">
        <h1 className="wifi-page-title text-xl font-bold mb-1">Help & Support</h1>
        <p className="wifi-hero-subtitle text-xs">We're here to help</p>
      </div>

      <div className="px-6 py-6 max-w-lg mx-auto">
        {/* Register Complaint Form */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <FaTriangleExclamation className="text-[var(--color-primary)] text-base" />
            <h2 className="text-base font-bold text-[var(--color-text)]">Need Help?</h2>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
              <FaCircleExclamation className="text-red-500 mt-0.5 flex-shrink-0 text-[16px]" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Subject */}
            <div>
              <label className="block text-[var(--color-text)] font-medium mb-1.5 text-sm">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Brief description"
                maxLength="200"
                disabled={loading}
                className="wifi-input px-3 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[var(--color-text)] font-medium mb-1.5 text-sm">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
                className="wifi-select px-3 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="general">General</option>
                <option value="technical">Technical Issue</option>
                <option value="billing">Billing</option>
                <option value="connection">Connection Problem</option>
                <option value="speed">Speed Issue</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[var(--color-text)] font-medium mb-1.5 text-sm">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={loading}
                className="wifi-select px-3 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[var(--color-text)] font-medium mb-1.5 text-sm">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your issue..."
                rows="4"
                disabled={loading}
                className="wifi-textarea px-3 py-2.5 text-sm resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="wifi-btn-primary w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <FaPaperPlane className="text-[18px]" />
                  Submit Complaint
                </>
              )}
            </button>
          </form>
        </div>

        {/* Need More Help Section */}
        <div className="border-t border-[var(--color-border)] pt-6 mb-10">
          <h2 className="text-base font-bold text-[var(--color-text)] mb-3">
            Need More Help?
          </h2>

          <div className="space-y-3">
            {/* Call Option */}
            <button
              onClick={handleCall}
              className="w-full flex items-center gap-3 p-3 bg-[var(--color-primary-soft)] border border-[var(--color-border)] rounded-md hover:scale-[1.01] transition-all"
            >
              <div className="w-10 h-10 bg-[var(--color-primary)] rounded-md flex items-center justify-center flex-shrink-0">
                <FaPhone className="text-white text-[20px]" />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-[var(--color-text)] text-sm">Call Us</p>
                <p className="text-xs text-[var(--color-text-muted)]">{supportPhone}</p>
              </div>
            </button>

            {/* WhatsApp Option */}
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-md hover:scale-[1.01] transition-all"
            >
              <div className="w-10 h-10 bg-green-600 rounded-md flex items-center justify-center flex-shrink-0">
                <FaWhatsapp className="text-white text-[20px]" />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-[var(--color-text)] text-sm">WhatsApp</p>
                <p className="text-xs text-[var(--color-text-muted)]">{supportWhatsApp}</p>
              </div>
            </button>

            {/* Email Support */}
            <div className="flex items-center gap-3 p-3 bg-white border border-[var(--color-border)] rounded-md">
              <div className="w-10 h-10 bg-slate-600 rounded-md flex items-center justify-center flex-shrink-0">
                <FaEnvelope className="text-white text-[20px]" />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-[var(--color-text)] text-sm">Email</p>
                <p className="text-xs text-[var(--color-text-muted)]">{supportEmail}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
