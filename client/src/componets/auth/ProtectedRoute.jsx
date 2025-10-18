import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// We'll use a fake auth check for now.
// LATER, you will replace this with your real Supabase `useSession()` hook
const useAuth = () => {
  // --- FAKE AUTH ---
  // Set this to `true` to test the dashboard
  // Set this to `false` or `null` to test the redirect to /login
  const user = { id: 1 };
  // -----------------

  // --- REAL SUPABASE AUTH (for later) ---
  // const { session } = useSession();
  // return { user: session?.user };
  // ------------------------------------

  return { user };
};

const ProtectedRoute = () => {
  const { user } = useAuth();

  // If the user is not authenticated, redirect them to the login page
  if (!user) {
    // 'replace' stops the user from using the "back" button to get back to the dashboard
    return <Navigate to="/login" replace />;
  }

  // If they ARE authenticated, render the child component (which will be our AppLayout)
  return <Outlet />;
};

export default ProtectedRoute;
