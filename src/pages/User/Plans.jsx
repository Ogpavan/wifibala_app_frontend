import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Reusable feature box component
const FeatureBox = ({ icon, label, value, color = "blue" }) => {
  const colors = {
    blue: "text-blue-500",
    purple: "text-purple-500",
    green: "text-green-500",
  };

  const icons = {
    bolt: "M13 10V3L4 14h7v7l9-11h-7z",
    data: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4",
    calendar:
      "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  };

  return (
    <div className="bg-gray-50 rounded-xl p-3 text-center">
      <svg
        className={`w-5 h-5 ${colors[color]} mx-auto mb-1`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={icons[icon]}
        />
      </svg>
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
              <svg
                className="w-16 h-16 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
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
      <div className="min-h-screen   flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Failed to load plans
          </h3>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  rounded pb-24">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white px-4 pt-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Choose Your Perfect Plan
          </h1>
          <p className="text-blue-100 text-sm md:text-base">
            High-speed internet plans tailored for your needs
          </p>
        </div>
      </div>

      {/* Filters Section - Floating Card */}
      <div className="max-w-6xl mx-auto px-4 -mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Operator Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Provider
              </label>
              <select
                value={selectedOperator}
                onChange={(e) => setSelectedOperator(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Plans Section */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredPlans.length}
            </span>{" "}
            plans
          </p>
        </div>

        {filteredPlans.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              No plans found
            </h3>
            <p className="text-gray-500 text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedPlans).map(([operatorId, operatorPlans]) => {
              const operator = getOperator(parseInt(operatorId));
              return (
                <div key={operatorId}>
                  {/* Operator Header */}
                  <div className="flex items-center gap-3 mb-4">
                    {operator.logo_url ? (
                      <img
                        src={operator.logo_url}
                        alt={operator.name}
                        className="w-10 h-10 rounded-lg object-cover bg-white shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold">
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
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        {/* Plan Header */}
                        <div className="bg-blue-700 p-4 text-white">
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
                                      className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-lg font-medium"
                                    >
                                      {ott.ott_name}
                                    </span>
                                  ))}
                                  {plan.ott_platforms.length > 4 && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium">
                                      +{plan.ott_platforms.length - 4} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                          {/* Description */}
                          {plan.description && (
                            <p className="text-xs text-gray-500 line-clamp-2">
                              {plan.description}
                            </p>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() =>
                                navigate(`/user/plans/${plan.plan_id}`)
                              }
                              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => handleSubscribeClick(plan)}
                              className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-xl transition-opacity ${
                                subscribedPlans.includes(plan.plan_id)
                                  ? "bg-green-600 text-white hover:bg-green-700"
                                  : "bg-blue-700 text-white hover:opacity-90"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-20">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Confirm Subscription
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Are you sure you want to subscribe to this plan?
              </p>

              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                <div className="flex items-center gap-3 mb-3">
                  {getOperator(selectedPlan.operator_id).logo_url ? (
                    <img
                      src={getOperator(selectedPlan.operator_id).logo_url}
                      alt={getOperator(selectedPlan.operator_id).name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {getOperator(selectedPlan.operator_id).name?.charAt(0) ||
                        "?"}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {getOperator(selectedPlan.operator_id).name ||
                        "Unknown Provider"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedPlan.speed} • {selectedPlan.validity} days
                    </p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  ₹{selectedPlan.price}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    setSelectedPlan(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSubscribe}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
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
