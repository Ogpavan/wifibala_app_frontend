import React, { useState } from "react";
import { FaCircleCheck, FaClock, FaRotate, FaWifi } from "react-icons/fa6";

export default function PortManagement() {
  const [currentPort] = useState({
    provider: "Airtel",
    status: "active",
  });

  const [availablePorts] = useState([
    { provider: "Jio", status: "available" },
    { provider: "BSNL", status: "available" },
    { provider: "Vi", status: "available" },
  ]);

  const [selectedPort, setSelectedPort] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);

  const getProviderIcon = (provider) => {
    const icons = {
      Airtel: "/airtel.png",
      Jio: "/jio.png",
      BSNL: "/bsnl.png",
      Vi: "/vi.png",
    };
    return icons[provider] || "/main.png";
  };

  const handlePortChangeRequest = () => {
    if (!selectedPort) {
      alert("Please select a port");
      return;
    }

    alert(`Port change request to ${selectedPort} submitted successfully!`);
    setShowRequestForm(false);
    setSelectedPort(null);
  };

  return (
    <>
      <div className="bg-white px-4 pt-4 mb-0">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="mb-4" />

          {/* Current Port */}
          <div className="wifi-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <FaWifi className="w-5 h-5 text-[var(--color-primary)]" />
              <h2 className="font-semibold text-[var(--color-text)]">
                Your Current Port
              </h2>
            </div>

            <div className="flex items-center justify-between p-4 bg-[var(--color-primary-soft)] rounded-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center overflow-hidden border border-[var(--color-border)]">
                  <img
                    src={getProviderIcon(currentPort.provider)}
                    alt={`${currentPort.provider} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--color-text)]">
                    {currentPort.provider}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Primary Connection
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-green-100 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-medium text-green-700">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Button */}
          {!showRequestForm && (
            <button
              onClick={() => setShowRequestForm(true)}
              className="wifi-btn-primary w-full font-bold text-sm active:scale-95 mt-4"
            >
              <FaRotate className="w-4 h-4" />
              Request Port Change
            </button>
          )}

          {/* Available Ports */}
          {showRequestForm && (
            <div className="wifi-card p-5 mt-4">
              <h2 className="font-semibold text-[var(--color-text)] mb-1">
                Available Ports
              </h2>
              <p className="text-xs text-[var(--color-text-muted)] mb-3">
                Select a port to request a change
              </p>

              <div className="space-y-3">
                {availablePorts.map((port) => (
                  <div
                    key={port.provider}
                    onClick={() => setSelectedPort(port.provider)}
                    className={`border rounded-md p-3 cursor-pointer transition ${
                      selectedPort === port.provider
                        ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                        : "border-[var(--color-border)] hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-md flex items-center justify-center ${
                            selectedPort === port.provider
                              ? "bg-[var(--color-primary-soft)] border border-[var(--color-primary)]"
                              : "bg-white border border-[var(--color-border)]"
                          }`}
                        >
                          <img
                            src={getProviderIcon(port.provider)}
                            alt={`${port.provider} logo`}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[var(--color-text)]">
                            {port.provider}
                          </h3>
                          <p className="text-xs text-green-600">Available</p>
                        </div>
                      </div>

                      {selectedPort === port.provider && (
                        <FaCircleCheck className="w-5 h-5 text-[var(--color-primary)]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowRequestForm(false);
                    setSelectedPort(null);
                  }}
                  className="flex-1 bg-white text-[var(--color-text)] py-2.5 rounded-md border border-[var(--color-border)]"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePortChangeRequest}
                  className="flex-1 bg-[var(--color-primary)] text-white py-2.5 rounded-md font-bold"
                >
                  Submit Request
                </button>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="bg-[var(--color-primary-soft)] border border-[var(--color-border)] rounded-md p-4 flex gap-3 mt-4">
            <FaClock className="w-5 h-5 text-[var(--color-primary)] mt-0.5" />
            <p className="text-xs text-[var(--color-text-muted)]">
              Port change requests are reviewed within 24-48 hours.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
