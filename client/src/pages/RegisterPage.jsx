import React from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../componets/layout/AuthLayout.jsx"; // <-- This path must also match

const RegisterPage = () => {
  return (
    <AuthLayout title="Create Account">
      <form className="space-y-6">
        {/* Name Fields */}
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <div className="sm:w-1/2">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-slate-300"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              className="mt-1 block w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Jane"
            />
          </div>
          <div className="sm:w-1/2 mt-6 sm:mt-0">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-slate-300"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              className="mt-1 block w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Doe"
            />
          </div>
        </div>

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

        {/* Retype Password Input */}
        <div>
          <label
            htmlFor="retypePassword"
            className="block text-sm font-medium text-slate-300"
          >
            Retype Password
          </label>
          <input
            type="password"
            id="retypePassword"
            className="mt-1 block w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="••••••••"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 px-4 rounded-md transition duration-300"
        >
          Create Account
        </button>

        {/* Link to Login Page */}
        <p className="text-sm text-center text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-cyan-400 hover:text-cyan-300"
          >
            Login here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
