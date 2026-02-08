import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Offers() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/offers/user");

      if (!response.ok) {
        throw new Error("Failed to fetch offers");
      }

      const data = await response.json();
      setOffers(data.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching offers:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDiscount = (offer) => {
    if (offer.discount_type === "percentage") {
      return `${offer.discount_value}% OFF${offer.max_discount ? ` (Max ₹${offer.max_discount})` : ""}`;
    }
    return `₹${offer.discount_value} OFF`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  };

  const generateOfferCode = (offer) => {
    // Generate a code based on offer name or use a pattern
    const words = offer.offer_name.toUpperCase().split(" ");
    if (words.length >= 2) {
      return words[0].substring(0, 4) + words[1].substring(0, 2);
    }
    return offer.offer_name.substring(0, 6).toUpperCase();
  };

  const getOfferColor = (index) => {
    const colors = [
      "bg-gradient-to-br from-blue-500 to-blue-600",
      "bg-gradient-to-br from-indigo-500 to-indigo-600",
      "bg-gradient-to-br from-cyan-500 to-cyan-600",
      "bg-gradient-to-br from-purple-500 to-purple-600",
      "bg-gradient-to-br from-pink-500 to-pink-600",
      "bg-gradient-to-br from-green-500 to-green-600",
    ];
    return colors[index % colors.length];
  };

  const handleUseOffer = (offer) => {
    // Navigate to plan details with offer information
    const offerParams = new URLSearchParams({
      offer_id: offer.offer_id,
      offer_name: offer.offer_name,
      discount_type: offer.discount_type,
      discount_value: offer.discount_value,
      max_discount: offer.max_discount || "",
      final_price: offer.final_price,
      savings: offer.savings,
    }).toString();

    navigate(
      `/user/plans/${offer.plan_id}?offer=${encodeURIComponent(
        btoa(
          JSON.stringify({
            offer_id: offer.offer_id,
            offer_name: offer.offer_name,
            discount_type: offer.discount_type,
            discount_value: offer.discount_value,
            max_discount: offer.max_discount || null,
            final_price: offer.final_price,
            savings: offer.savings,
            discount_percentage: offer.discount_percentage,
          }),
        ),
      )}`,
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 pt-6 pb-24">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Offers</h1>
          <p className="text-sm text-gray-500 mb-6">Exclusive deals for you</p>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 pt-6 pb-24">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Offers</h1>
          <p className="text-sm text-gray-500 mb-6">Exclusive deals for you</p>
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">Failed to load offers. Please try again.</p>
            <button
              onClick={fetchOffers}
              className="mt-2 text-xs bg-red-600 text-white px-3 py-1 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-6 pb-24">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Offers</h1>
        <p className="text-sm text-gray-500 mb-6">Exclusive deals for you</p>

        {offers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎁</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No Active Offers
            </h3>
            <p className="text-gray-500 text-sm">
              Check back later for exciting deals!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {offers.map((offer, index) => {
              const offerCode = generateOfferCode(offer);
              const colorClass = getOfferColor(index);

              return (
                <div
                  key={offer.offer_id}
                  className={`${colorClass} rounded-2xl p-4 text-white shadow-lg`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-base leading-tight pr-2">
                      {offer.offer_name}
                    </h3>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full whitespace-nowrap">
                      {formatDate(offer.end_date)}
                    </span>
                  </div>

                  <div className="mb-2">
                    <span className="text-sm font-semibold bg-white/20 px-2 py-1 rounded-full">
                      {formatDiscount(offer)}
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-white/90">
                        Plan: {offer.speed} • {offer.data_limit}
                      </p>
                      <div className="text-right">
                        {offer.savings > 0 && (
                          <p className="text-xs text-white/70 line-through">
                            ₹{offer.original_price}
                          </p>
                        )}
                        <p className="text-sm font-bold text-white">
                          ₹{offer.final_price}
                        </p>
                      </div>
                    </div>
                    {offer.savings > 0 && (
                      <p className="text-xs text-green-200 font-medium">
                        You save ₹{offer.savings} ({offer.discount_percentage}%)
                      </p>
                    )}
                    {offer.offer_description && (
                      <p className="text-xs text-white/80 mt-2">
                        {offer.offer_description.length > 80
                          ? `${offer.offer_description.substring(0, 80)}...`
                          : offer.offer_description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/80">
                      Valid till {formatDate(offer.end_date)}
                    </span>
                    <button
                      onClick={() => handleUseOffer(offer)}
                      className="bg-white text-blue-600 px-5 py-2 rounded-lg text-xs font-bold shadow-md active:scale-95 transition-transform"
                    >
                      Use Offer
                    </button>
                  </div>

                  {/* <div className="mt-2 text-xs text-white/70 text-center">
                    Code: {offerCode}
                  </div> */}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
