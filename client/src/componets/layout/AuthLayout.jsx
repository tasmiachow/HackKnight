import React from "react";

const AuthLayout = ({ children, title }) => {
  return (
    // We removed 'py-12' from this className
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* This is the glassmorphism card */}
        <div className="bg-[var(--color-green-slate-1)] backdrop-blur-xl border border-slate-700 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            {title}
          </h2>
          {/* This is where the form inputs will go */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
