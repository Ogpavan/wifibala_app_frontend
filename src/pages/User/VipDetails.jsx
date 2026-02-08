import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Gauge,
  Database,
  Calendar,
  Check,
  Tv,
  Wifi,
  Zap,
  Shield,
  Headphones,
} from "lucide-react";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-white text-xl font-semibold tracking-wide animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex flex-col items-center justify-center p-4">
        <div className="text-white text-xl mb-4">{error}</div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!planData) {
    return null;
  }

  // Safe parse for JSON fields
  const parseJsonField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      const parsed = typeof field === "string" ? JSON.parse(field) : field;
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn("Failed to parse JSON field:", field);
      return [];
    }
  };

  const ottPlatforms = parseJsonField(planData.ott_platforms);
  const additionalBenefits = parseJsonField(planData.additional_benefits);

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
        ottPlatforms.length > 0
          ? `Free access to ${ottPlatforms.slice(0, 2).join(", ")} and more premium platforms.`
          : "OTT subscriptions included with this plan.",
    },
    {
      title: "24/7 Priority Support",
      description:
        "Dedicated VIP support team available round the clock for assistance.",
    },
    {
      title: "Secure Connection",
      description:
        "Bank-grade security with encrypted connection for safe browsing.",
    },
    {
      title: "Quick Installation",
      description: "Professional setup within 24-48 hours at your convenience.",
    },
  ];

  // Add additional benefits to features if they exist
  if (additionalBenefits.length > 0) {
    additionalBenefits.forEach((benefit) => {
      features.push({
        title: benefit,
        description: "Included as part of your VIP plan benefits.",
      });
    });
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Blue Header */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 px-4 pt-4 pb-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-3 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-white text-xl font-bold mb-1">VIP Plan Details</h1>
        <p className="text-white/70 text-xs">
          Everything about this premium plan
        </p>
      </div>

      {/* White Card */}
      <div className="bg-white rounded-t-3xl -mt-4 px-4 pt-5 pb-6">
        {/* Provider/Plan Name */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Wifi className="text-blue-900" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {planData.plan_name}
            </h2>
            <p className="text-xs text-gray-500">Premium VIP Plan</p>
          </div>
        </div>

        {/* Plan Image */}
        {planData.image_url && (
          <div className="mb-5 rounded-2xl overflow-hidden">
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}/${planData.image_url}`}
              alt={planData.plan_name}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1544197150-ae1b46b04a9a?w=800&q=80";
              }}
            />
          </div>
        )}

        {/* Description */}
        {planData.description && (
          <p className="text-gray-600 text-xs leading-relaxed mb-5">
            {planData.description}
          </p>
        )}

        {/* Price */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-3.5 mb-5">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-blue-900">
              ₹{planData.price || "599"}
            </span>
            <span className="text-gray-600 text-xs">/month</span>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          <div className="bg-gray-50 rounded-xl p-2.5 text-center">
            <Gauge className="w-4 h-4 text-blue-900 mx-auto mb-1" />
            <p className="text-[10px] text-gray-500 mb-0.5">Speed</p>
            <p className="text-xs font-bold text-gray-900">
              {planData.speed_mbps || 0} Mbps
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5 text-center">
            <Database className="w-4 h-4 text-blue-900 mx-auto mb-1" />
            <p className="text-[10px] text-gray-500 mb-0.5">Data</p>
            <p className="text-xs font-bold text-gray-900">
              {planData.data_policy || "Unlimited"}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5 text-center">
            <Calendar className="w-4 h-4 text-blue-900 mx-auto mb-1" />
            <p className="text-[10px] text-gray-500 mb-0.5">Validity</p>
            <p className="text-xs font-bold text-gray-900">
              {planData.validity_days || 30} Days
            </p>
          </div>
        </div>

        {/* OTT Platforms */}
        {ottPlatforms.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2.5">
              <Tv className="w-4 h-4 text-blue-900" />
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                OTT INCLUDED
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ottPlatforms.map((platform, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-blue-50 text-blue-900 rounded-full text-[10px] font-medium"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mb-5">
          <h3 className="text-base font-bold text-gray-900 mb-3">
            What's Included
          </h3>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-2.5">
                <div className="w-1.5 h-1.5 bg-blue-900 rounded-full mt-1.5 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-xs mb-0.5">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 mb-5">
          <p className="text-[10px] text-amber-800 leading-relaxed">
            Plan validity starts from activation date. Fair usage policy
            applies. OTT subscriptions subject to availability and may vary by
            region. Prices are subject to change. Taxes may apply.
          </p>
        </div>

        {/* Buy Button */}
        <div className="mt-6">
          <button
            onClick={() =>
              alert(
                `Purchasing ${planData.plan_name} for ₹${planData.price || "599"}/month`,
              )
            }
            className="w-full text-white bg-blue-900 py-2.5 rounded-xl font-bold text-sm shadow-xl border-2 border-blue-900 hover:bg-blue-800 transition active:scale-95"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
