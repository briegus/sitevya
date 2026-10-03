import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import ProtectedRoute from "./components/ProtectedRoute";
import BackgroundVideo from "./components/BackgroundVideo";
import { initLiquidGlassEffects } from "./lib/liquidGlassEffects";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ServicesPage from "./pages/ServicesPage";
import RealisationsPage from "./pages/RealisationsPage";
import AvisPage from "./pages/AvisPage";
import FAQPage from "./pages/FAQPage";
import AProposPage from "./pages/AProposPage";
import ContactPage from "./pages/ContactPage";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";

function AnimatedRoutes() {
  const location = useLocation();
  const isDashboardOrLogin = location.pathname === "/dashboard" || location.pathname === "/login";

  return (
    <>
      {!isDashboardOrLogin && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Hero />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/realisations" element={<RealisationsPage />} />
          <Route path="/avis" element={<AvisPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/a-propos" element={<AProposPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  useEffect(() => {
    initLiquidGlassEffects();
  }, []);

  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <BackgroundVideo />
          <AnimatedRoutes />
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
