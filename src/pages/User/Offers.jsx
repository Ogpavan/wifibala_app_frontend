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
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/offers/user`,
      );

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
      "bg-white border border-[var(--color-border)]",
      "bg-white border border-[var(--color-border)]",
      "bg-white border border-[var(--color-border)]",
      "bg-white border border-[var(--color-border)]",
      "bg-white border border-[var(--color-border)]",
      "bg-white border border-[var(--color-border)]",
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
      <div className="wifi-page pb-24">
        <div className="wifi-hero wifi-hero-primary px-4 pt-6 pb-10 rounded-b-[28px]">
          <div className="max-w-md mx-auto">
            <h1 className="wifi-page-title text-2xl font-bold mb-1">Offers</h1>
            <p className="wifi-hero-subtitle text-sm">Exclusive deals for you</p>
          </div>
        </div>
        <div className="max-w-md mx-auto px-4 pt-6">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wifi-page pb-24">
        <div className="wifi-hero wifi-hero-primary px-4 pt-6 pb-10 rounded-b-[28px]">
          <div className="max-w-md mx-auto">
            <h1 className="wifi-page-title text-2xl font-bold mb-1">Offers</h1>
            <p className="wifi-hero-subtitle text-sm">Exclusive deals for you</p>
          </div>
        </div>
        <div className="max-w-md mx-auto px-4 pt-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p className="text-sm">Failed to load offers. Please try again.</p>
            <button
              onClick={fetchOffers}
              className="mt-2 text-xs bg-red-600 text-white px-3 py-1 rounded-full"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wifi-page pb-24">
      <div className="wifi-hero wifi-hero-primary px-4 pt-6 pb-10 rounded-b-[28px]">
        <div className="max-w-md mx-auto">
          <h1 className="wifi-page-title text-2xl font-bold mb-1">Offers</h1>
          <p className="wifi-hero-subtitle text-sm">Exclusive deals for you</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-4">

        {offers.length === 0 ? (
          <div className="wifi-card text-center py-12 px-4">
            <div className="w-16 h-16 bg-[var(--color-primary-soft)] rounded-md flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎁</span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
              No Active Offers
            </h3>
            <p className="text-[var(--color-text-muted)] text-sm">
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
                  className={`${colorClass} rounded-md p-4 text-[var(--color-text)] shadow-sm`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-base leading-tight pr-2">
                      {offer.offer_name}
                    </h3>
                    <span className="text-xs bg-[var(--color-primary-soft)] text-[var(--color-primary)] px-2 py-1 rounded-full whitespace-nowrap">
                      {formatDate(offer.end_date)}
                    </span>
                  </div>

                  <div className="mb-2">
                    <span className="text-sm font-semibold bg-[var(--color-primary-soft)] text-[var(--color-primary)] px-2 py-1 rounded-full">
                      {formatDiscount(offer)}
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Plan: {offer.speed} • {offer.data_limit}
                      </p>
                      <div className="text-right">
                        {offer.savings > 0 && (
                          <p className="text-xs text-[var(--color-text-muted)] line-through">
                            ₹{offer.original_price}
                          </p>
                        )}
                        <p className="text-sm font-bold text-[var(--color-text)]">
                          ₹{offer.final_price}
                        </p>
                      </div>
                    </div>
                    {offer.savings > 0 && (
                      <p className="text-xs text-green-600 font-medium">
                        You save ₹{offer.savings} ({offer.discount_percentage}%)
                      </p>
                    )}
                    {offer.offer_description && (
                      <p className="text-xs text-[var(--color-text-muted)] mt-2">
                        {offer.offer_description.length > 80
                          ? `${offer.offer_description.substring(0, 80)}...`
                          : offer.offer_description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--color-text-muted)]">
                      Valid till {formatDate(offer.end_date)}
                    </span>
                    <button
                      onClick={() => handleUseOffer(offer)}
                      className="bg-white text-[var(--color-primary)] px-5 py-2 rounded-md text-xs font-bold shadow-md active:scale-95 transition-transform"
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
