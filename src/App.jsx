import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Container, Box } from "@mui/material";
import BottomFooter from "./components/BottomFooter";
// User Pages

import Home from "./pages/User/Home";
import UserPlans from "./pages/User/Plans";
import PlanDetails from "./pages/User/PlanDetails";
import UserOffers from "./pages/User/Offers";
import UserComplaints from "./pages/User/Complaints";
import Wallet from "./pages/User/Wallet";
// Admin Pages
import Dashboard from "./pages/Admin/Dashboard";
import AdminUsers from "./pages/Admin/Users";
import AdminPlans from "./pages/Admin/Plans";
import AdminOffers from "./pages/Admin/Offers";
import AdminComplaints from "./pages/Admin/Complaints";
import Profile from "./pages/User/Profile";
import Speedtest from "./pages/User/VipPlan";
import Notification from "./pages/User/Notification";
import { AuthProvider } from "./context/AuthContext.jsx";
import VipDetails from "./pages/User/VipDetails.jsx";
import TermsPage from "./pages/Terms.jsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicy.jsx";


import Signin from "./Auth/Signin.jsx";
import Signup from "./Auth/Signup.jsx";
import { applyThemeColor } from "./utils/theme.js";
import { fetchAppSettings } from "./utils/settings.js";

// Default route component that redirects based on auth
function DefaultRoute() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.id) {
    return <Navigate to="/user/dashboard" replace />;
  }
  return <Navigate to="/signin" replace />;
}

function AppRoutes() {
  const location = useLocation();
  const hideFooter = [
    "/signin",
    "/signup",
    "/terms",
    "/privacy-policy",
    "/admin/dashboard",
    "/admin/users",
    "/admin/plans",
    "/admin/offers",
    "/admin/complaints",
    "/user/plans/", // Hide footer on plan details page
  ].some((path) => location.pathname.startsWith(path));

  // Protect user dashboard and user pages
  useEffect(() => {
    const protectedUserRoutes = [
      "/user/dashboard",
      "/user/plans",
      "/user/plans/",
      "/user/offers",
      "/user/complaints",
      "/user/wallet",
      "/user/profile",
      "/user/speedtest",
      "/user/notifications",
    ];
    if (
      protectedUserRoutes.some((path) => location.pathname.startsWith(path))
    ) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        window.location.href = "/signin";
      }
    }
  }, [location]);

  // Redirect authenticated users away from auth pages
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (
      user &&
      user.id &&
      ["/signin", "/signup"].some((path) => location.pathname.startsWith(path))
    ) {
      window.location.href = "/user/dashboard";
    }
  }, [location]);

  // Check if current route is signin or signup
  const isAuthPage = ["/signin", "/signup", "/terms", "/privacy-policy"].some((path) =>
    location.pathname.startsWith(path),
  );

  return (
    <>
      {isAuthPage ? (
        // Render auth pages without Container/Box
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        </Routes>
      ) : (
        // All other pages inside Container/Box
        <Container disableGutters>
          <Box sx={{ m: 0, p: 0 }}>
            <Routes>
              {/* Default route */}
              <Route path="/" element={<DefaultRoute />} />

              {/* Auth Pages */}
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

              {/* User Pages (all protected) */}
              <Route path="/user/dashboard" element={<Home />} />
              <Route path="/user/plans" element={<UserPlans />} />
              <Route path="/user/plans/:id" element={<PlanDetails />} />
              <Route path="/user/offers" element={<UserOffers />} />
              <Route path="/user/complaints" element={<UserComplaints />} />
              <Route path="/user/wallet" element={<Wallet />} />
              <Route path="/user/profile" element={<Profile />} />
              <Route path="/user/speedtest" element={<Speedtest />} />
              <Route path="/user/notifications" element={<Notification />} />
              <Route path="/user/vipdetails/:id" element={<VipDetails />} />


              {/* Admin Pages (if you want to protect them too) */}
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/plans" element={<AdminPlans />} />
              <Route path="/admin/offers" element={<AdminOffers />} />
              <Route path="/admin/complaints" element={<AdminComplaints />} />
            </Routes>
          </Box>
        </Container>
      )}
      {!hideFooter && <BottomFooter />}
    </>
  );
}

function App() {
  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    const applyStoredTheme = () => {
      const stored = window.localStorage.getItem("app_theme_color");
      if (stored) {
        applyThemeColor(stored);
      }
    };

    const cacheSettings = (settings) => {
      window.localStorage.setItem("app_settings", JSON.stringify(settings));
    };

    const fetchTheme = async () => {
      try {
        const settings = await fetchAppSettings(baseUrl);
        cacheSettings(settings);
        const themeColor =
          settings?.theme_color ||
          window.localStorage.getItem("app_theme_color") ||
          "blue";
        applyThemeColor(themeColor);
        window.localStorage.setItem("app_theme_color", themeColor);
      } catch {
        applyStoredTheme();
      }
    };

    fetchTheme();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
