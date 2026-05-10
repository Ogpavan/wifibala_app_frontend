import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarDays,
  FaCheck,
  FaDatabase,
  FaGaugeHigh,
  FaTv,
  FaWifi,
} from "react-icons/fa6";
import { resolveMediaUrl, resolveOttLogo } from "../../utils/ott";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export default function VipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${BASE_URL}/api/vip-plans/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch plan: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.plan_name) {
          throw new Error("Invalid plan data received");
        }

        setPlanData(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPlanDetails();
    } else {
      setError("No plan ID provided");
      setLoading(false);
    }
  }, [id]);

  const parseJsonField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      const parsed = typeof field === "string" ? JSON.parse(field) : field;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const getOttName = (ott) => {
    if (typeof ott === "string") return ott;
    if (ott && typeof ott === "object") {
      return ott.ott_name || ott.name || ott.title || "";
    }
    return "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" />
        <div className="text-[var(--color-text)] text-xl font-semibold tracking-wide animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="text-[var(--color-text)] text-xl mb-4">{error}</div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-white text-[var(--color-primary)] rounded-md text-sm font-semibold"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!planData) return null;

  const ottPlatforms = parseJsonField(planData.ott_platforms);
  const additionalBenefits = parseJsonField(planData.additional_benefits);
  const planImageUrl = resolveMediaUrl(planData.image_url);

  const features = [
    {
      title: "Lightning Fast Speed",
      description: `${planData.speed_mbps || 0} Mbps speed for seamless streaming, gaming, and browsing.`,
    },
    {
      title: "Unlimited Data",
      description: `${planData.data_policy || "Data included"} with no restrictions. Stream and download freely.`,
    },
    {
      title: "OTT Subscriptions",
      description:
        ottPlatforms.map(getOttName).filter(Boolean).length > 0
          ? `Free access to ${ottPlatforms
              .map(getOttName)
              .filter(Boolean)
              .slice(0, 2)
              .join(", ")} and more premium platforms.`
          : "OTT subscriptions included with this plan.",
    },
    {
      title: "24/7 Priority Support",
      description: "Dedicated VIP support team available round the clock for assistance.",
    },
    {
      title: "Secure Connection",
      description: "Bank-grade security with encrypted connection for safe browsing.",
    },
    {
      title: "Quick Installation",
      description: "Professional setup within 24-48 hours at your convenience.",
    },
  ];

  additionalBenefits.forEach((benefit) => {
    features.push({
      title: benefit,
      description: "Included as part of your VIP plan benefits.",
    });
  });

  return (
    <div className="wifi-page bg-white pb-20">
      <div className="wifi-hero wifi-hero-primary px-4 pt-4 pb-6 rounded-b-[28px]">
        <button
          onClick={() => navigate(-1)}
          className="mb-3 w-8 h-8 bg-white/15 rounded-md flex items-center justify-center text-white border border-white/20 backdrop-blur-sm"
        >
          <FaArrowLeft className="text-[18px]" />
        </button>
        <h1 className="wifi-page-title text-xl font-bold mb-1">VIP Plan Details</h1>
        <p className="wifi-hero-subtitle text-xs">
          Everything about this premium plan
        </p>
      </div>

      <div className="wifi-card-strong rounded-t-[32px] -mt-4 px-4 pt-5 pb-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 bg-[var(--color-primary-soft)] rounded-md flex items-center justify-center">
            <FaWifi className="text-[var(--color-primary)] text-[20px]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text)]">
              {planData.plan_name}
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              Premium VIP Plan
            </p>
          </div>
        </div>

        {planImageUrl && (
          <div className="mb-5 rounded-md overflow-hidden">
            <img
              src={planImageUrl}
              alt={planData.plan_name}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1544197150-ae1b46b04a9a?w=800&q=80";
              }}
            />
          </div>
        )}

        {planData.description && (
          <p className="text-[var(--color-text-muted)] text-xs leading-relaxed mb-5">
            {planData.description}
          </p>
        )}

        <div className="bg-[var(--color-primary-soft)] rounded-md p-3.5 mb-5">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-[var(--color-primary)]">
              ₹{planData.price || "599"}
            </span>
            <span className="text-[var(--color-text-muted)] text-xs">/month</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 mb-5">
          <div className="bg-white border border-[var(--color-border)] rounded-md p-2.5 text-center">
            <FaGaugeHigh className="w-4 h-4 text-[var(--color-primary)] mx-auto mb-1" />
            <p className="text-[10px] text-[var(--color-text-muted)] mb-0.5">Speed</p>
            <p className="text-xs font-bold text-[var(--color-text)]">
              {planData.speed_mbps || 0} Mbps
            </p>
          </div>
          <div className="bg-white border border-[var(--color-border)] rounded-md p-2.5 text-center">
            <FaDatabase className="w-4 h-4 text-[var(--color-primary)] mx-auto mb-1" />
            <p className="text-[10px] text-[var(--color-text-muted)] mb-0.5">Data</p>
            <p className="text-xs font-bold text-[var(--color-text)]">
              {planData.data_policy || "Unlimited"}
            </p>
          </div>
          <div className="bg-white border border-[var(--color-border)] rounded-md p-2.5 text-center">
            <FaCalendarDays className="w-4 h-4 text-[var(--color-primary)] mx-auto mb-1" />
            <p className="text-[10px] text-[var(--color-text-muted)] mb-0.5">Validity</p>
            <p className="text-xs font-bold text-[var(--color-text)]">
              {planData.validity_days || 0} Days
            </p>
          </div>
        </div>

        {ottPlatforms.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[var(--color-primary-soft)] rounded-md flex items-center justify-center">
                <FaTv className="text-[var(--color-primary)] text-[16px]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--color-text)]">
                  OTT Subscriptions Included
                </h3>
                <p className="text-[10px] text-[var(--color-text-muted)]">
                  Stream unlimited content
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {ottPlatforms.map((ott, index) => (
                <div
                  key={ott.ott_id || index}
                  className="flex items-center gap-2 bg-white px-3 py-2 rounded-md border border-[var(--color-border)]"
                >
                  {resolveOttLogo(ott) ? (
                    <img
                      src={resolveOttLogo(ott)}
                      alt={ott.ott_name || ott}
                      className="w-6 h-6 rounded-md object-contain bg-white"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-[var(--color-primary-soft)] rounded-md flex items-center justify-center">
                      <FaTv className="text-[var(--color-primary)] text-[12px]" />
                    </div>
                  )}
                  <span className="text-xs font-medium text-[var(--color-text)]">
                    {getOttName(ott) || "OTT"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-5">
          <h3 className="text-sm font-bold text-[var(--color-text)] mb-3">
            Plan Features
          </h3>
          <div className="grid gap-3">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-3">
                <div className="w-6 h-6 bg-[var(--color-primary)] rounded-md flex items-center justify-center mt-0.5 flex-shrink-0">
                  <FaCheck className="text-white text-[14px]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[var(--color-text)]">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="w-full bg-[var(--color-primary)] text-white py-3 rounded-md font-semibold"
        >
          Back to Plans
        </button>
      </div>
    </div>
  );
}
