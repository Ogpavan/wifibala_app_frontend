import React, { useState, useEffect } from "react";
import { FaBolt, FaCircleCheck, FaCrown, FaStar, FaWifi } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { resolveMediaUrl } from "../../utils/ott";

export default function VipPlans() {
  const navigate = useNavigate();
  const [vipPlans, setVipPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVipPlans();
  }, []);

  const fetchVipPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/vip-plans`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch VIP plans");
      }

      const data = await response.json();
      setVipPlans(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching VIP plans:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMore = (planId) => {
    navigate(`/user/vipdetails/${planId}`);
  };

  // Helper function to parse JSON fields safely
  const parseJsonField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === "string") {
      try {
        return JSON.parse(field);
      } catch {
        return [];
      }
    }
    return [];
  };

  const getOttName = (ott) => {
    if (typeof ott === "string") return ott;
    if (ott && typeof ott === "object") {
      return ott.ott_name || ott.name || ott.title || "";
    }
    return "";
  };

  // Helper to build features array from backend data
  const buildFeatures = (plan) => {
    const features = [];

    if (plan.speed_mbps) {
      features.push(`${plan.speed_mbps} Mbps Speed`);
    }

    if (plan.data_policy) {
      features.push(plan.data_policy);
    }

    if (plan.validity_days) {
      features.push(`${plan.validity_days} Days Validity`);
    }

    const ottPlatforms = parseJsonField(plan.ott_platforms);
    if (ottPlatforms.length > 0) {
      const ottNames = ottPlatforms.map(getOttName).filter(Boolean);
      if (ottNames.length > 0) {
        features.push(`OTT: ${ottNames.join(", ")}`);
      }
    }

    const additionalBenefits = parseJsonField(plan.additional_benefits);
    if (additionalBenefits.length > 0) {
      features.push(...additionalBenefits);
    }

    return features;
  };

  // Determine if plan should be marked as popular (e.g., second plan)
  const isPopular = (index) => {
    return index === 1; // Mark second plan as popular
  };

  if (loading) {
    return (
      <div className="wifi-page flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
          <p className="text-[var(--color-text-muted)]">Loading VIP plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wifi-page flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-[color-mix(in_srgb,var(--color-error)_10%,white)] border border-[color-mix(in_srgb,var(--color-error)_20%,white)] rounded-md p-4 mb-4">
            <p className="text-[var(--color-error)] font-semibold">Error loading plans</p>
            <p className="text-[var(--color-error)] text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={fetchVipPlans}
            className="wifi-btn-primary px-4 py-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wifi-page pb-4">
      {/* Header */}
      <div className="wifi-hero wifi-hero-primary rounded-b-[28px]">
        <div className="max-w-md mx-auto px-3 py-3">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-md shadow-lg border border-white/20">
              <FaCrown className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h1 className="wifi-page-title text-base font-bold">VIP Membership</h1>
              <p className="wifi-hero-subtitle text-[10px]">
                Exclusive benefits & features
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-3 py-3 pb-12 space-y-3">
        {/* VIP Plans Section */}
        <div>
          <div className="mb-2">
            <h2 className="text-base font-bold text-[var(--color-text)]">
              Choose Your Plan
            </h2>
            <p className="text-[var(--color-text-muted)] text-[10px]">
              Select the perfect plan
            </p>
          </div>

          {vipPlans.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-[var(--color-text-muted)] text-sm">
                No VIP plans available at the moment
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {vipPlans.map((plan, index) => {
                const features = buildFeatures(plan);
                const popular = isPopular(index);
                const imageUrl = resolveMediaUrl(plan.image_url);

                return (
                  <div
                    key={plan.id}
                    className={`wifi-card overflow-hidden relative ${
                      popular ? "border-[var(--color-primary)]" : "border-[var(--color-border)]"
                    }`}
                  >
                    {popular && (
                      <div className="absolute top-1.5 right-1.5 bg-[var(--color-primary)] text-white px-2 py-0.5 rounded-full text-[10px] font-bold z-10 shadow-md flex items-center gap-0.5">
                        <FaStar className="w-2 h-2" />
                        POPULAR
                      </div>
                    )}

                    {/* Image Section */}
                    <div className="relative h-36 overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={plan.plan_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to Unsplash if image fails to load
                            e.target.src = `https://images.unsplash.com/photo-${
                              index % 3 === 0
                                ? "1544197150-ae1b46b04a9a"
                                : index % 3 === 1
                                  ? "1451187580459-43490279c0fa"
                                  : "1558618666-fcd25c85cd64"
                            }?w=800&q=80`;
                          }}
                        />
                      ) : (
                        <img
                          src={`https://images.unsplash.com/photo-${
                            index % 3 === 0
                              ? "1544197150-ae1b46b04a9a"
                              : index % 3 === 1
                                ? "1451187580459-43490279c0fa"
                                : "1558618666-fcd25c85cd64"
                          }?w=800&q=80`}
                          alt={plan.plan_name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                      {/* Speed Badge */}
                      {plan.speed_mbps && (
                        <div className="absolute top-1.5 left-1.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full shadow-md">
                          <p className="text-[var(--color-primary)] font-bold text-[10px] flex items-center gap-0.5">
                            <FaBolt className="w-2.5 h-2.5" />
                            {plan.speed_mbps} Mbps
                          </p>
                        </div>
                      )}

                      {/* Plan Name */}
                      <div className="absolute bottom-1.5 left-1.5">
                        <h3 className="text-white font-bold text-base drop-shadow-lg">
                          {plan.plan_name}
                        </h3>
                        {plan.description && (
                          <p className="text-white/90 text-[10px] drop-shadow-md">
                            {plan.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-3">
                      {/* Validity Info */}
                      <div className="flex items-end gap-1 mb-2">
                        <span className="text-xl font-bold text-[var(--color-text)]">
                          {plan.validity_days} Days
                        </span>
                        <span className="text-[var(--color-text-muted)] text-[10px] mb-0.5">
                          validity
                        </span>
                      </div>

                      {/* Features */}
                      {features.length > 0 && (
                        <div className="space-y-1 mb-2">
                          {features.map((feature, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1.5"
                            >
                              <div className="bg-[var(--color-primary)] rounded-md p-0.5 flex-shrink-0">
                                <FaCircleCheck className="w-2.5 h-2.5 text-white" />
                              </div>
                              <span className="text-[var(--color-text)] text-[11px]">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Button */}
                      <button
                        onClick={() => handleViewMore(plan.id)}
                        className="w-full py-1.5 px-3 rounded-lg font-semibold text-[11px] transition-all duration-200 bg-[var(--color-primary)] text-white hover:opacity-90"
                      >
                        View More
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Info */}
      <div className="bg-[var(--color-primary-soft)] rounded-md p-2 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-muted)] text-[10px] text-center">
            <FaWifi className="w-2.5 h-2.5 inline-block mr-1 text-[var(--color-primary)]" />
            Need help? Contact support
          </p>
        </div>
      </div>
    </div>
  );
}
