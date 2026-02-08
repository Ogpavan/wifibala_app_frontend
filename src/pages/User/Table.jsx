import React, { useState, useEffect } from "react";
import { Wifi, Zap, DollarSign, ChevronDown } from "lucide-react";

export default function PlansTable() {
  const [activeTab, setActiveTab] = useState("company");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState([]);
  const [operators, setOperators] = useState([]);
  const [speeds, setSpeeds] = useState([]);
  const [prices, setPrices] = useState([]);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch plans and operators in parallel
        const [plansResponse, operatorsResponse] = await Promise.all([
          fetch(`${BASE_URL}/api/plans`),
          fetch(`${BASE_URL}/api/plans/operators`),
        ]);

        if (!plansResponse.ok || !operatorsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const plansData = await plansResponse.json();
        const operatorsData = await operatorsResponse.json();

        setOperators(operatorsData.operators || []);

        // Helper function to get operator name
        const getOperatorName = (operatorId) => {
          const operator = operatorsData.operators?.find(
            (op) => op.id === operatorId,
          );
          return operator?.name || `Operator ${operatorId}`;
        };

        const formattedPlans = plansData.plans.map((plan) => ({
          id: plan.plan_id,
          company: getOperatorName(plan.operator_id),
          speed: plan.speed
            ? plan.speed.toString().replace(/[^0-9]/g, "")
            : "0",
          price: plan.price,
          validity: `${plan.validity || 0} days`,
          operatorId: plan.operator_id,
        }));

        setPlans(formattedPlans);

        const uniqueProviders = [
          ...new Set(formattedPlans.map((p) => p.company)),
        ].filter(Boolean);
        setProviders(uniqueProviders);

        const uniqueSpeeds = [...new Set(formattedPlans.map((p) => p.speed))]
          .filter((speed) => speed && speed !== "0")
          .sort((a, b) => parseInt(a) - parseInt(b));
        setSpeeds(uniqueSpeeds);

        const uniquePrices = [...new Set(formattedPlans.map((p) => p.price))]
          .filter(Boolean)
          .sort((a, b) => parseFloat(a) - parseFloat(b));
        setPrices(uniquePrices);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [BASE_URL]);

  const companyFilters = ["All", ...providers];
  const speedFilters = ["All", ...speeds.map((s) => `${s} Mbps`)];
  const priceFilters = [
    "All",
    ...prices.map((p) => `₹${parseFloat(p).toFixed(0)}`),
  ];

  const getFilteredPlans = () => {
    if (selectedFilter === "all") return plans;

    if (activeTab === "company") {
      return plans.filter(
        (plan) => plan.company?.toLowerCase() === selectedFilter.toLowerCase(),
      );
    } else if (activeTab === "speed") {
      return plans.filter(
        (plan) => plan.speed === selectedFilter.replace(" Mbps", ""),
      );
    } else if (activeTab === "price") {
      return plans.filter(
        (plan) =>
          parseFloat(plan.price) ===
          parseFloat(selectedFilter.replace("₹", "")),
      );
    }
  };

  const filteredPlans = getFilteredPlans();
  const filters =
    activeTab === "company"
      ? companyFilters
      : activeTab === "speed"
        ? speedFilters
        : priceFilters;

  const getCompanyColor = (company) => {
    const colors = {
      Airtel: "text-red-600 bg-red-50",
      Jio: "text-blue-600 bg-blue-50",
      BSNL: "text-green-600 bg-green-50",
      ACT: "text-purple-600 bg-purple-50",
      Hathway: "text-orange-600 bg-orange-50",
    };
    return colors[company] || "text-gray-600 bg-gray-50";
  };

  const handleSelectPlan = (planId) => {
    window.location.href = `/user/plans/${planId}`;
  };

  const renderTableHeaders = () => {
    if (activeTab === "company") {
      return (
        <>
          <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-700 uppercase">
            Provider
          </th>
          <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-700 uppercase">
            Speed
          </th>
          <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-700 uppercase">
            Price
          </th>
          <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-700 uppercase">
            Validity
          </th>
        </>
      );
    } else if (activeTab === "speed") {
      return (
        <>
          <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-700 uppercase">
            Speed
          </th>
          <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-700 uppercase">
            Provider
          </th>
          <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-700 uppercase">
            Price
          </th>
          <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-700 uppercase">
            Validity
          </th>
        </>
      );
    } else {
      return (
        <>
          <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-700 uppercase">
            Price
          </th>
          <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-700 uppercase">
            Provider
          </th>
          <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-700 uppercase">
            Speed
          </th>
          <th className="px-3 py-2.5 text-left text-xs font-bold text-gray-700 uppercase">
            Validity
          </th>
        </>
      );
    }
  };

  const renderTableRow = (plan) => {
    if (activeTab === "company") {
      return (
        <>
          <td className="px-3 py-3">
            <span
              className={`inline-flex px-2 py-1 rounded-md text-xs font-bold ${getCompanyColor(plan.company)}`}
            >
              {plan.company}
            </span>
          </td>
          <td className="px-3 py-3 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-bold">{plan.speed}</span> Mbps
          </td>
          <td className="px-3 py-3 font-bold text-blue-600">
            ₹{parseFloat(plan.price).toFixed(0)}
          </td>
          <td className="px-3 py-3 text-xs">{plan.validity}</td>
        </>
      );
    } else if (activeTab === "speed") {
      return (
        <>
          <td className="px-3 py-3 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-bold">{plan.speed}</span> Mbps
          </td>
          <td className="px-3 py-3">
            <span
              className={`inline-flex px-2 py-1 rounded-md text-xs font-bold ${getCompanyColor(plan.company)}`}
            >
              {plan.company}
            </span>
          </td>
          <td className="px-3 py-3 font-bold text-blue-600">
            ₹{parseFloat(plan.price).toFixed(0)}
          </td>
          <td className="px-3 py-3 text-xs">{plan.validity}</td>
        </>
      );
    } else {
      return (
        <>
          <td className="px-3 py-3 font-bold text-blue-600">
            ₹{parseFloat(plan.price).toFixed(0)}
          </td>
          <td className="px-3 py-3">
            <span
              className={`inline-flex px-2 py-1 rounded-md text-xs font-bold ${getCompanyColor(plan.company)}`}
            >
              {plan.company}
            </span>
          </td>
          <td className="px-3 py-3 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-bold">{plan.speed}</span> Mbps
          </td>
          <td className="px-3 py-3 text-xs">{plan.validity}</td>
        </>
      );
    }
  };

  if (loading) {
    return (
      <div className="px-3 py-3 pb-20">
        <div className="flex items-center justify-center py-10">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-gray-600 text-sm">Loading plans...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 py-3 pb-20">
      {/* Header */}
      <div className="mb-3">
        <h2 className="text-gray-900 text-xl font-bold">Available Plans</h2>
        <p className="text-gray-500 text-xs mt-0.5">Find your perfect plan</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => {
            setActiveTab("company");
            setSelectedFilter("all");
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs transition-all ${
            activeTab === "company"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-600 border border-gray-200"
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Wifi className="w-3.5 h-3.5" />
            Company
          </div>
        </button>

        <button
          onClick={() => {
            setActiveTab("speed");
            setSelectedFilter("all");
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs transition-all ${
            activeTab === "speed"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-600 border border-gray-200"
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            Speed
          </div>
        </button>

        <button
          onClick={() => {
            setActiveTab("price");
            setSelectedFilter("all");
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs transition-all ${
            activeTab === "price"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-600 border border-gray-200"
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5" />
            Price
          </div>
        </button>
      </div>

      {/* Dropdown */}
      <div className="mb-3">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 flex items-center justify-between hover:border-blue-300 transition-all text-sm"
          >
            <span className="text-gray-700 font-medium capitalize text-sm">
              {selectedFilter === "all" ? "All Plans" : selectedFilter}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
              {filters.map((filter, index) => (
                <button
                  key={filter}
                  onClick={() => {
                    setSelectedFilter(filter.toLowerCase());
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-blue-50 transition-all ${
                    selectedFilter === filter.toLowerCase()
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700"
                  } ${index !== filters.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {renderTableHeaders()}
                <th className="px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPlans.length ? (
                filteredPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    {renderTableRow(plan)}
                    <td className="px-3 py-3 text-right">
                      <button
                        onClick={() => handleSelectPlan(plan.id)}
                        className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-3 py-6 text-center text-gray-500 text-sm"
                  >
                    No plans available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
