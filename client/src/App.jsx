import React from "react";
import { Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "./componets/layout/MainLayout.jsx";
import AppLayout from "./componets/layout/AppLayout.jsx";
import ProtectedRoute from "./componets/auth/ProtectedRoute.jsx";

// Public Pages
import Homepage from "./pages/Homepage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

// App Pages
import DashboardPage from "./pages/DashboardPage.jsx";
import LogOut from "./componets/auth/LogOut.jsx";
import MarketMapPage from "./pages/MarketMapPage.jsx";

function App() {
  return (
    <Routes>
      {/* 1. PUBLIC ROUTES (Website) */}
      {/* These are wrapped in MainLayout and have the Navbar/Footer */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Homepage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="logout" element={<LogOut />} />

        <Route path="register" element={<RegisterPage />} />
        
      </Route>

      {/* 2. PRIVATE ROUTES (Main App) */}
      {/* These are wrapped in ProtectedRoute to check for a user */}
      <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/market-map" element={<MarketMapPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
