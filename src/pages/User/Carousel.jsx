import React, { useState, useEffect } from "react";
import { Percent, Wrench, Zap } from "lucide-react";

export default function OfferCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/carousel");
        if (res.ok) {
          const data = await res.json();
          // Filter only active slides and sort by position
          const activeSlides = data
            .filter(slide => slide.is_active)
            .sort((a, b) => a.position - b.position);
          setSlides(activeSlides);
        }
      } catch (error) {
        console.error("Error fetching slides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  const offers = [
    {
      id: 1,
      title: "20% Off",
      subtitle: "On First Recharge",
      description: "New users get instant discount",
      icon: Percent,
      accentColor: "from-cyan-400 to-blue-500",
    },
    {
      id: 2,
      title: "No Installation",
      subtitle: "Fees",
      description: "Free setup for all new connections",
      icon: Wrench,
      accentColor: "from-purple-400 to-pink-500",
    },
    {
      id: 3,
      title: "Unbeatable",
      subtitle: "Speed",
      description: "Up to 1 Gbps fiber connection",
      icon: Zap,
      accentColor: "from-orange-400 to-red-500",
    },
  ];

  // Use API slides if available, otherwise fallback to default offers
  const displaySlides = slides.length > 0 ? slides : offers;

  useEffect(() => {
    if (displaySlides.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
    }, 2000);
    
    return () => clearInterval(timer);
  }, [displaySlides]);

  // Show loading state
  if (loading) {
    return (
      <div className="relative px-3 pt-0 pb-2">
        <div className="relative overflow-hidden rounded-2xl bg-blue-900 h-48 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Root container – NO top spacing */}
      <div className="relative px-3 pt-0 pb-2">
        {/* Carousel */}
        <div className="relative overflow-hidden rounded-2xl">
          {/* Solid background */}
          <div className="absolute inset-0 bg-white" />

          {/* Slides */}
          <div
            className="flex transition-transform duration-700 ease-in-out relative"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {displaySlides.map((item, index) => {
              // For API slides, render image
              if (item.image_url) {
                return (
                  <div key={item.id || index} className="min-w-full">
                    <div className="relative px-4 pt-3 pb-4 overflow-hidden">
                      <div className="w-full h-40 rounded-xl overflow-hidden bg-blue-900">
                        <img
                          src={item.image_url.startsWith('http') ? item.image_url : `http://localhost:5000${item.image_url}`}
                          alt={`Slide ${item.position}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Image failed to load:', item.image_url);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              }

              // For default offers, render the glass card design
              const Icon = item.icon;
              return (
                <div key={item.id} className="min-w-full">
                  {/* Slide padding (controlled, not top margin) */}
                  <div className="relative px-4 pt-3 pb-4 overflow-hidden">
                    {/* Glow blobs */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div
                        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.accentColor} opacity-20 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse`}
                      />
                      <div
                        className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br ${item.accentColor} opacity-15 rounded-full blur-3xl -ml-12 -mb-12`}
                      />
                    </div>

                    {/* Glass card */}
                    <div className="relative backdrop-blur-xl bg-white/10 rounded-xl p-4 shadow-2xl">
                      {/* Badge */}
                      <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1 mb-3">
                        <Icon className="w-3 h-3 text-white" />
                        <span className="text-white text-xs font-semibold tracking-wide">
                          SPECIAL OFFER
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h2 className="text-white text-2xl font-bold leading-tight">
                            {item.title}
                          </h2>
                          <h3 className="text-white/90 text-base font-semibold mb-2">
                            {item.subtitle}
                          </h3>
                          <p className="text-white/80 text-xs leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        <div
                          className={`ml-3 bg-gradient-to-br ${item.accentColor} w-11 h-11 rounded-xl flex items-center justify-center shadow-lg`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                      </div>

                      {/* CTA */}
                      <button className="bg-white/95 text-blue-900 px-5 py-2 rounded-full font-bold text-xs shadow-lg hover:scale-105 transition">
                        Claim Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-2">
          {displaySlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all rounded-full ${
                currentSlide === index
                  ? "bg-blue-600 w-6 h-1.5"
                  : "bg-gray-300 w-1.5 h-1.5"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}