import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Gauge,
  Calendar,
  Database,
  Tv,
  Wifi,
  Tag,
  Check,
  Shield,
  Zap,
  Clock,
  Star,
  Share2,
  Heart,
} from "lucide-react";

export default function PlanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [appliedOffer, setAppliedOffer] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!id) {
      setError("No plan ID found in URL");
      setLoading(false);
      return;
    }

    // Parse offer information from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const offerParam = urlParams.get("offer");
    if (offerParam) {
      try {
        const offerData = JSON.parse(atob(decodeURIComponent(offerParam)));
        setAppliedOffer(offerData);
      } catch (error) {
        console.error("Error parsing offer data:", error);
      }
    }

    const fetchPlan = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/plans/${id}`);
        if (!res.ok) throw new Error("Plan not found or API request failed");
        const data = await res.json();
        const planData = data.plan;

        if (!planData) throw new Error("Plan data is empty");

        setPlan(planData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id, BASE_URL]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${plan.operator?.name} - ${plan.speed} Plan`,
          text: `Check out this amazing internet plan: ₹${plan.price} for ${plan.validity} days`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    }
  };

  const handleSubscribe = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      alert("Please sign in to subscribe.");
      navigate("/signin");
      return;
    }
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + Number(plan.validity));

    // Use discounted price if offer is applied
    const finalPrice = appliedOffer ? appliedOffer.final_price : plan.price;

    try {
      const response = await fetch(`${BASE_URL}/api/plans/subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          plan_id: plan.plan_id,
          price_paid: finalPrice,
          end_date: endDate.toISOString(),
          auto_renew: false,
          offer_id: appliedOffer?.offer_id || null,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          // navigate("/user/dashboard");
        }, 3000);
      } else {
        alert(data.message || "Subscription failed.");
      }
    } catch (error) {
      alert("Error subscribing: " + error.message);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[999] flex items-end justify-center bg-gradient-to-br from-green-900 via-green-800 to-green-700">
        <div className="w-full max-w-md mx-auto mb-24 animate-slide-up rounded-3xl   backdrop-blur-lg">
          <div className="flex flex-col items-center justify-center p-8">
            <div className="bg-white rounded-full p-8   mb-6 animate-bounce">
              <Check className="text-green-500" size={64} />
            </div>
            <h2 className="text-white text-xl font-bold mb-2 animate-fade-in text-center">
              Subscription Request Received!
            </h2>
            <p className="text-white/80 text-sm mb-6 animate-fade-in text-center">
              Our Agent will contact you soon to confirm the details.
            </p>
          </div>
        </div>
        {/* Custom animation styles */}
        <style>{`
          .animate-slide-up {
            animation: slideUp 0.7s cubic-bezier(0.22, 1, 0.36, 1);
          }
          @keyframes slideUp {
            0% { transform: translateY(100%); opacity: 0; }
            60% { transform: translateY(-10px); opacity: 1; }
            80% { transform: translateY(0px); }
            100% { transform: translateY(0px); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-white/20 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <div className="text-white text-lg font-medium mt-6 animate-pulse">
          Loading plan details...
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex flex-col items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center max-w-sm">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wifi className="text-red-400" size={32} />
          </div>
          <h2 className="text-white text-xl font-bold mb-2">Oops!</h2>
          <p className="text-white/70 text-sm mb-6">
            {error || "Plan not found"}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-white text-blue-900 rounded-xl font-semibold text-sm hover:bg-blue-50 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const originalPrice = parseFloat(plan.price);
  const finalPrice = appliedOffer
    ? parseFloat(appliedOffer.final_price)
    : originalPrice;
  const pricePerDay = (finalPrice / plan.validity).toFixed(2);

  const highlights = [
    { icon: Zap, text: "Instant Activation" },
    { icon: Shield, text: "Secure Connection" },
    { icon: Clock, text: "24/7 Support" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 px-4 pt-4 pb-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                isFavorite
                  ? "bg-red-500 text-white"
                  : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
              }`}
            >
              <Heart size={20} fill={isFavorite ? "white" : "none"} />
            </button>
            <button
              onClick={handleShare}
              className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* Provider Info */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 bg-white rounded-2xl p-2 shadow-lg">
            {plan.operator?.logo_url ? (
              <img
                src={plan.operator.logo_url}
                alt={plan.operator.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-blue-100 rounded-xl flex items-center justify-center">
                <Wifi className="text-blue-900" size={24} />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold">
              {plan.operator?.name || "Internet Plan"}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                {plan.speed}
              </span>
              <span className="bg-green-500/20 text-green-300 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                <Star size={10} fill="currentColor" />
                Popular
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Card - Overlapping Header */}
      <div className="px-4 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Price Section */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-gray-500 text-xs mb-1">Plan Price</p>
                {appliedOffer ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-400 line-through">
                        ₹{originalPrice.toFixed(0)}
                      </span>
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                        {appliedOffer.discount_type === "percentage"
                          ? `${appliedOffer.discount_value}% OFF`
                          : `₹${appliedOffer.discount_value} OFF`}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-green-600">
                        ₹{parseFloat(appliedOffer.final_price).toFixed(0)}
                      </span>
                      <span className="text-gray-500 text-sm">
                        /{plan.validity} days
                      </span>
                    </div>
                    <p className="text-green-600 text-sm font-medium">
                      You save ₹{appliedOffer.savings} (
                      {appliedOffer.discount_percentage}%)
                    </p>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900">
                      ₹{originalPrice.toFixed(0)}
                    </span>
                    <span className="text-gray-500 text-sm">
                      /{plan.validity} days
                    </span>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-[10px]">That's just</p>
                <p className="text-blue-600 font-bold text-lg">
                  ₹{pricePerDay}/day
                </p>
              </div>
            </div>

            {/* Applied Offer Banner */}
            {appliedOffer && (
              <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Tag className="text-green-600" size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-green-800 font-semibold text-sm">
                    {appliedOffer.offer_name} Applied!
                  </p>
                  <p className="text-green-600 text-xs">
                    Discount applied successfully to this plan
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 divide-x divide-gray-100 bg-gray-50/50">
            <div className="p-4 text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Gauge className="text-blue-600" size={20} />
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
                Speed
              </p>
              <p className="text-sm font-bold text-gray-900">{plan.speed}</p>
            </div>
            <div className="p-4 text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Database className="text-purple-600" size={20} />
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
                Data
              </p>
              <p className="text-sm font-bold text-gray-900">
                {plan.data_limit || "Unlimited"}
              </p>
            </div>
            <div className="p-4 text-center">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Calendar className="text-orange-600" size={20} />
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
                Validity
              </p>
              <p className="text-sm font-bold text-gray-900">
                {plan.validity} Days
              </p>
            </div>
          </div>

          {/* OTT Platforms */}
          {plan.ott_platforms && plan.ott_platforms.length > 0 && (
            <div className="p-5 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Tv className="text-pink-600" size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    OTT Subscriptions Included
                  </h3>
                  <p className="text-[10px] text-gray-400">
                    Stream unlimited content
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {plan.ott_platforms.map((ott) => (
                  <div
                    key={ott.ott_id}
                    className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-2 rounded-xl"
                  >
                    <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Tv className="text-gray-600" size={12} />
                    </div>
                    <span className="text-xs font-medium text-gray-700">
                      {ott.ott_name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {plan.description && (
            <div className="p-5 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                Plan Details
              </h3>
              <div className="space-y-2.5">
                {plan.description.split("\n").map((line, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="text-green-600" size={12} />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {line}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Highlights */}
          <div className="p-5 border-t border-gray-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
            <div className="flex justify-around">
              {highlights.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-2">
                    <item.icon className="text-blue-600" size={20} />
                  </div>
                  <p className="text-[10px] font-medium text-gray-600">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Terms Note */}
        <div className="mt-4 z-1 bg-amber-50/80 border border-amber-200/50 rounded-2xl p-4">
          <p className="text-xs text-amber-700 leading-relaxed">
            <strong>Note:</strong> Service availability varies by location.
            Installation charges may apply for new connections. OTT
            subscriptions are subject to respective platform terms and
            conditions.
          </p>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-50">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex-1">
            <p className="text-xs text-gray-400">Total Amount</p>
            {appliedOffer ? (
              <div className="flex items-center gap-2">
                <p className="text-lg text-gray-400 line-through">
                  ₹{originalPrice.toFixed(0)}
                </p>
                <p className="text-xl font-bold text-green-600">
                  ₹{parseFloat(appliedOffer.final_price).toFixed(0)}
                </p>
              </div>
            ) : (
              <p className="text-xl font-bold text-gray-900">
                ₹{originalPrice.toFixed(0)}
              </p>
            )}
          </div>
          <button
            onClick={handleSubscribe}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 px-6 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all active:scale-[0.98]"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
