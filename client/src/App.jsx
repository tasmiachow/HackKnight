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

function App() {
  return (
    <Routes>
      {/* 1. PUBLIC ROUTES (Website) */}
      {/* These are wrapped in MainLayout and have the Navbar/Footer */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Homepage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* 2. PRIVATE ROUTES (Main App) */}
      {/* These are wrapped in ProtectedRoute to check for a user */}
      <Route element={<ProtectedRoute />}>
        {/* If user is logged in, show AppLayout (no Navbar/Footer) */}
        <Route path="/dashboard" element={<AppLayout />}>
          {/* The default page for /dashboard is our DashboardPage */}
          <Route index element={<DashboardPage />} />
          {/* You could add more app pages here later, like: */}
          {/* <Route path="profile" element={<ProfilePage />} /> */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
