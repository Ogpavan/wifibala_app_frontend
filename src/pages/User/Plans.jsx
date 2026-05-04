import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBolt,
  FaCalendarDays,
  FaCheck,
  FaCircleQuestion,
  FaDatabase,
  FaFaceFrown,
  FaTriangleExclamation,
} from "react-icons/fa6";
import { resolveOttLogo } from "../../utils/ott";

// Reusable feature box component
const FeatureBox = ({ icon, label, value, color = "blue" }) => {
  const colors = {
    blue: "text-blue-500",
    purple: "text-purple-500",
    green: "text-green-500",
  };

  const icons = {
    bolt: FaBolt,
    data: FaDatabase,
    calendar: FaCalendarDays,
  };
  const Icon = icons[icon] || FaBolt;

  return (
    <div className="bg-gray-50 rounded-md p-3 text-center">
      <Icon className={`w-5 h-5 ${colors[color]} mx-auto mb-1`} />
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
};

export default function Plans() {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState("all");
  const [sortBy, setSortBy] = useState("price-asc");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [subscribedPlans, setSubscribedPlans] = useState([]);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const getOperatorLogo = (operator) => {
    const name = operator?.name?.trim().toLowerCase();
    const logos = {
      airtel: "/airtel.png",
      jio: "/jio.png",
      bsnl: "/bsnl.png",
      vi: "/vi.png",
      voda: "/vi.png",
      vodafone: "/vi.png",
    };

    if (name && logos[name]) {
      return logos[name];
    }

    return operator?.logo_url || "";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch operators and plans in parallel
        const [operatorsRes, plansRes] = await Promise.all([
          fetch(`${BASE_URL}/api/plans/operators`),
          fetch(`${BASE_URL}/api/plans`),
        ]);

        if (!operatorsRes.ok || !plansRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const operatorsData = await operatorsRes.json();
        const plansData = await plansRes.json();

        setOperators(operatorsData.operators || []);
        setPlans(plansData.plans || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [BASE_URL]);

  // Get operator details by ID
  const getOperator = (operatorId) => {
    return operators.find((op) => op.id === operatorId) || {};
  };

  // Filter and sort plans
  const filteredPlans = plans
    .filter((plan) => {
      if (
        selectedOperator !== "all" &&
        plan.operator_id !== parseInt(selectedOperator)
      ) {
        return false;
      }
      if (plan.price < priceRange[0] || plan.price > priceRange[1]) {
        return false;
      }
      return plan.is_active;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "speed-desc":
          return parseInt(b.speed) - parseInt(a.speed);
        case "validity-desc":
          return b.validity - a.validity;
        default:
          return 0;
      }
    });

  // Group plans by operator
  const groupedPlans = filteredPlans.reduce((acc, plan) => {
    const opId = plan.operator_id;
    if (!acc[opId]) {
      acc[opId] = [];
    }
    acc[opId].push(plan);
    return acc;
  }, {});

  const handleSubscribeClick = (plan) => {
    setSelectedPlan(plan);
    setShowConfirm(true);
  };

  const handleConfirmSubscribe = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      alert("Please sign in to subscribe.");
      navigate("/signin");
      return;
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + Number(selectedPlan.validity));

    try {
      const response = await fetch(`${BASE_URL}/api/plans/subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          plan_id: selectedPlan.plan_id,
          price_paid: selectedPlan.price,
          end_date: endDate.toISOString(),
          auto_renew: false,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSubscribedPlans([...subscribedPlans, selectedPlan.plan_id]);
        setShowConfirm(false);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setSelectedPlan(null);
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
        <div className="w-full max-w-md mx-auto mb-24 animate-slide-up rounded-3xl backdrop-blur-lg">
          <div className="flex flex-col items-center justify-center p-8">
            <div className="bg-white rounded-full p-8 mb-6 animate-bounce">
              <FaCheck className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-white text-xl font-bold mb-2 animate-fade-in text-center">
              Subscription Request Received!
            </h2>
            <p className="text-white/80 text-sm mb-6 animate-fade-in text-center">
              Our Agent will contact you soon to confirm the details.
            </p>
          </div>
        </div>
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
      <div className="wifi-page flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--color-text-muted)] font-medium">Loading plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wifi-page flex items-center justify-center p-4">
        <div className="wifi-card p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-md flex items-center justify-center mx-auto mb-4">
            <FaTriangleExclamation className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
            Failed to load plans
          </h3>
          <p className="text-[var(--color-text-muted)] text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="wifi-btn-primary px-6 py-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wifi-page pb-24">
      {/* Hero Section */}
      <div className="wifi-hero wifi-hero-primary px-4 pt-8 pb-16 rounded-b-[28px]">
        <div className="max-w-6xl mx-auto">
          <h1 className="wifi-page-title text-2xl md:text-3xl font-bold mb-2">
            Choose Your Perfect Plan
          </h1>
          <p className="wifi-hero-subtitle text-sm md:text-base">
            High-speed internet plans tailored for your needs
          </p>
        </div>
      </div>

      {/* Filters Section - Floating Card */}
      <div className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="wifi-card p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Operator Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Provider
              </label>
              <select
                value={selectedOperator}
                onChange={(e) => setSelectedOperator(e.target.value)}
                className="wifi-select px-4 py-2.5 text-sm text-[var(--color-text)]"
              >
                <option value="all">All Providers</option>
                {operators.map((op) => (
                  <option key={op.id} value={op.id}>
                    {op.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="wifi-select px-4 py-2.5 text-sm text-[var(--color-text)]"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="speed-desc">Speed: Fastest First</option>
                <option value="validity-desc">Validity: Longest First</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Max Price: ₹{priceRange[1]}
              </label>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[var(--color-primary)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-[var(--color-text-muted)]">
            Showing{" "}
            <span className="font-semibold text-[var(--color-text)]">
              {filteredPlans.length}
            </span>{" "}
            plans
          </p>
        </div>

        {filteredPlans.length === 0 ? (
          <div className="wifi-card p-12 text-center">
            <div className="w-20 h-20 bg-[var(--color-primary-soft)] rounded-md flex items-center justify-center mx-auto mb-4">
              <FaFaceFrown className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-1">
              No plans found
            </h3>
            <p className="text-[var(--color-text-muted)] text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedPlans).map(([operatorId, operatorPlans]) => {
              const operator = getOperator(parseInt(operatorId));
              const operatorLogo = getOperatorLogo(operator);
              return (
                <div key={operatorId}>
                  {/* Operator Header */}
                  <div className="flex items-center gap-3 mb-4">
                    {operatorLogo ? (
                      <img
                        src={operatorLogo}
                        alt={operator.name}
                        className="w-10 h-10 rounded-md object-cover bg-white shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-[var(--color-primary)] rounded-md flex items-center justify-center text-white font-bold">
                        {operator.name?.charAt(0) || "?"}
                      </div>
                    )}
                    <div>
                      <h2 className="font-semibold text-gray-800">
                        {operator.name || "Unknown Provider"}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {operatorPlans.length} plans available
                      </p>
                    </div>
                  </div>

                  {/* Plans Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {operatorPlans.map((plan) => (
                      <div
                        key={plan.plan_id}
                        className="wifi-card overflow-hidden hover:shadow-md transition-shadow"
                      >
                        {/* Plan Header */}
                        <div className="bg-[var(--color-primary)] p-4 text-white">
                          <div className="flex items-baseline justify-between">
                            <div>
                              <span className="text-3xl font-bold">
                                ₹{plan.price}
                              </span>
                              <span className="text-blue-100 text-sm ml-1">
                                /{plan.validity} days
                              </span>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                              <span className="text-sm font-medium">
                                {plan.speed}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Plan Details */}
                        <div className="p-4 space-y-4">
                          {/* Key Features */}
                          <div className="grid grid-cols-2 gap-3">
                            <FeatureBox
                              icon="bolt"
                              label="Speed"
                              value={plan.speed}
                              color="blue"
                            />
                            <FeatureBox
                              icon="data"
                              label="Data"
                              value={plan.data_limit || "Unlimited"}
                              color="purple"
                            />
                          </div>

                          {/* OTT Platforms */}
                          {plan.ott_platforms &&
                            plan.ott_platforms.length > 0 && (
                                  <div>
                                <p className="text-xs text-gray-500 mb-2">
                                  Included OTT
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {plan.ott_platforms.slice(0, 4).map((ott) => (
                                    <span
                                      key={ott.ott_id}
                                      className="inline-flex items-center gap-1.5 px-2 py-1 bg-[var(--color-primary-soft)] text-[var(--color-primary)] text-xs rounded-full font-medium"
                                    >
                                      {resolveOttLogo(ott) && (
                                        <img
                                          src={resolveOttLogo(ott)}
                                          alt={ott.ott_name}
                                          className="w-4 h-4 rounded-sm object-contain bg-white"
                                        />
                                      )}
                                      {ott.ott_name}
                                    </span>
                                  ))}
                                  {plan.ott_platforms.length > 4 && (
                                    <span className="px-2 py-1 bg-white border border-[var(--color-border)] text-[var(--color-text-muted)] text-xs rounded-full font-medium">
                                      +{plan.ott_platforms.length - 4} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                          {/* Description */}
                          {plan.description && (
                            <p className="text-xs text-[var(--color-text-muted)] line-clamp-2">
                              {plan.description}
                            </p>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() =>
                                navigate(`/user/plans/${plan.plan_id}`)
                              }
                              className="flex-1 px-4 py-2.5 bg-white border border-[var(--color-border)] text-[var(--color-text)] text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => handleSubscribeClick(plan)}
                              className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-md transition-opacity ${
                                subscribedPlans.includes(plan.plan_id)
                                ? "bg-green-600 text-white hover:bg-green-700 rounded-md"
                                  : "bg-[var(--color-primary)] text-white hover:opacity-90 rounded-md"
                              }`}
                            >
                              {subscribedPlans.includes(plan.plan_id)
                                ? "Subscribed"
                                : "Subscribe"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Popup */}
      {showConfirm && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="wifi-card p-6 w-96 mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-primary-soft)] rounded-md flex items-center justify-center mx-auto mb-4">
                <FaCircleQuestion className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">
                Confirm Subscription
              </h2>
              <p className="text-[var(--color-text-muted)] text-sm mb-6">
                Are you sure you want to subscribe to this plan?
              </p>

              <div className="bg-white border border-[var(--color-border)] rounded-md p-4 mb-6 text-left">
                <div className="flex items-center gap-3 mb-3">
                  {getOperatorLogo(getOperator(selectedPlan.operator_id)) ? (
                    <img
                      src={getOperatorLogo(getOperator(selectedPlan.operator_id))}
                      alt={getOperator(selectedPlan.operator_id).name}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-[var(--color-primary)] rounded-md flex items-center justify-center text-white font-bold">
                      {getOperator(selectedPlan.operator_id).name?.charAt(0) ||
                        "?"}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)]">
                      {getOperator(selectedPlan.operator_id).name ||
                        "Unknown Provider"}
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {selectedPlan.speed} • {selectedPlan.validity} days
                    </p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-[var(--color-primary)]">
                  ₹{selectedPlan.price}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    setSelectedPlan(null);
                  }}
                  className="flex-1 px-4 py-3 bg-white border border-[var(--color-border)] text-[var(--color-text)] font-medium rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSubscribe}
                  className="flex-1 px-4 py-3 bg-[var(--color-primary)] text-white font-medium rounded-md hover:opacity-90 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
