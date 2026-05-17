import React, { useEffect, useState } from "react";
import { FaCircleCheck, FaClock, FaRotate, FaWifi } from "react-icons/fa6";
import Popup from "../../components/Popup";

export default function PortManagement() {
  const [currentPort, setCurrentPort] = useState({
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
  const [requestRestriction, setRequestRestriction] = useState({
    canRequest: true,
    message: "",
    loading: false,
  });
  const [popupState, setPopupState] = useState({
    open: false,
    title: "",
    message: "",
    actions: null,
  });

  const getProviderIcon = (provider) => {
    const icons = {
      Airtel: "/airtel.png",
      Jio: "/jio.png",
      BSNL: "/bsnl.png",
      Vi: "/vi.png",
    };
    return icons[provider] || "/main.png";
  };

  const closePopup = () => {
    setPopupState({
      open: false,
      title: "",
      message: "",
      actions: null,
    });
  };

  useEffect(() => {
    const loadLatestRequest = async () => {
      const userInfo = JSON.parse(localStorage.getItem("user")) || {};
      if (!userInfo.id) return;

      setRequestRestriction((current) => ({ ...current, loading: true }));
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/port-change-requests/user/${userInfo.id}/latest`,
        );
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Failed to check request status");
        }

        setRequestRestriction({
          canRequest: Boolean(result.can_request),
          message: result.latest_request?.status === "pending"
            ? "You already have a pending request. Please wait for it to be reviewed before submitting another one."
            : "",
          loading: false,
        });

        setCurrentPort({
          provider: result.current_port_provider || "Airtel",
          status: "active",
        });
      } catch {
        setRequestRestriction({
          canRequest: true,
          message: "",
          loading: false,
        });
        setCurrentPort({
          provider: "Airtel",
          status: "active",
        });
      }
    };

    loadLatestRequest();
  }, []);

  const submitPortChangeRequest = async () => {
    const userInfo = JSON.parse(localStorage.getItem("user")) || {};
    if (!userInfo.id) {
      setPopupState({
        open: true,
        title: "Login Required",
        message: "Please sign in before submitting a port change request.",
        actions: null,
      });
      return;
    }

    const request = {
      user_id: userInfo.id || null,
      user_name: userInfo.name || "Unknown User",
      phone_number: userInfo.mobile || userInfo.phone || userInfo.phone_number || "",
      current_provider: currentPort.provider,
      requested_provider: selectedPort,
      remarks: "",
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/port-change-requests/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        },
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to submit port change request");
      }

      setShowRequestForm(false);
      setSelectedPort(null);
      setRequestRestriction({
        canRequest: false,
        message: "You already have a pending request. Please wait for it to be reviewed before submitting another one.",
        loading: false,
      });
      setCurrentPort((prev) => ({
        ...prev,
        status: "active",
      }));
      setPopupState({
        open: true,
        title: "Request Submitted",
        message: `Port change request to ${selectedPort} submitted successfully.`,
        actions: null,
      });
    } catch (error) {
      setPopupState({
        open: true,
        title: "Submission Failed",
        message: error.message || "Unable to submit request right now.",
        actions: null,
      });
    }
  };

  const handlePortChangeRequest = () => {
    if (!requestRestriction.canRequest) {
      setPopupState({
        open: true,
        title: "Request Locked",
        message: requestRestriction.message || "You already have a pending port change request.",
        actions: null,
      });
      return;
    }

    if (!selectedPort) {
      setPopupState({
        open: true,
        title: "Select a Port",
        message: "Please select a port before submitting your request.",
        actions: null,
      });
      return;
    }

    setPopupState({
      open: true,
      title: "Confirm Port Change",
      message: `Do you want to submit a port change request to ${selectedPort}?`,
      actions: [
        {
          label: "Confirm",
          variant: "primary",
          onClick: submitPortChangeRequest,
        },
        {
          label: "Cancel",
          variant: "secondary",
          onClick: closePopup,
        },
      ],
    });
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
                    {currentPort.status === "active" ? "Primary Connection" : "Primary Connection"}
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
              onClick={() => {
                if (!requestRestriction.canRequest) {
                  setPopupState({
                    open: true,
                    title: "Request Locked",
                    message: requestRestriction.message || "You already have a pending port change request.",
                    actions: null,
                  });
                  return;
                }
                setShowRequestForm(true);
              }}
              disabled={!requestRestriction.canRequest || requestRestriction.loading}
              className="wifi-btn-primary w-full font-bold text-sm active:scale-95 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaRotate className="w-4 h-4" />
              {requestRestriction.loading ? "Checking..." : "Request Port Change"}
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

          {!requestRestriction.canRequest && !requestRestriction.loading && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-4">
              <p className="text-xs text-amber-800">
                {requestRestriction.message || "You already have a pending port change request."}
              </p>
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
      <Popup
        open={popupState.open}
        title={popupState.title}
        message={popupState.message}
        onClose={closePopup}
        actions={popupState.actions}
      />
    </>
  );
}
