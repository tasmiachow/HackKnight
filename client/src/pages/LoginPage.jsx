import React from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../componets/layout/AuthLayout.jsx"; // <-- This path must match

const LoginPage = () => {
  return (
    <AuthLayout title="Login">
      <form className="space-y-6">
        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-300"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="you@example.com"
          />
        </div>

        {/* Password Input */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-300"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="mt-1 block w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="••••••••"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 px-4 rounded-md transition duration-300"
        >
          Sign In
        </button>

        {/* Link to Register Page */}
        <p className="text-sm text-center text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-cyan-400 hover:text-cyan-300"
          >
            Register here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
