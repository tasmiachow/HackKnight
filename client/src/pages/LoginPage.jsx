import React from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../componets/layout/AuthLayout.jsx"; 
import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { useSession } from '../useSession'
import { useNavigate, useLocation } from 'react-router-dom'


export default function LogInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const session = useSession()
  const navigate = useNavigate()
  const location = useLocation();                              
  const fromSignup =
    location.state?.fromSignup ||
    new URLSearchParams(location.search).get('fromSignup') === '1'; 
    const signupEmail = location.state?.email ||
    new URLSearchParams(location.search).get('email') || '';

  useEffect(() => {
    if (session?.user) navigate('/dashboard', { replace: true })
  }, [session, navigate])

  const emailPasswordSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)


    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setStatus(error.message)
      return
    }

    
    if (data?.user) {
      navigate('/dashboard', { replace: true })
    }
  }

  // const google = async () => {
  //   setStatus('Redirecting to Google…')
  //   const { error } = await supabase.auth.signInWithOAuth({
  //     provider: 'google',
  //     options: {
  //       redirectTo: `${window.location.origin}/dashboard`,
  //     },
  //   })
  //   if (error) setStatus(error.message)
  // }

  return (
    <AuthLayout title="Login">
      {/* Signup success banner */}
      {fromSignup && (
        <div className="mb-6 rounded-lg border border-cyan-400/40 bg-cyan-500/10 p-3 text-sm text-cyan-200">
          Account created! Please confirm your email before signing in.
          {signupEmail && (
            <>
              <br />
              <span className="opacity-90">
                We sent a link to <b>{signupEmail}</b>.
              </span>
            </>
          )}
        </div>
      )}

      {/* OAuth button */}
      {/* <button
        type="button"
        onClick={google}
        className="mb-6 w-full rounded-md bg-white/90 px-4 py-3 font-semibold text-slate-900 hover:bg-white transition"
      >
        Continue with Google
      </button>
      <p className="text-center text-slate-400 mb-4">or</p> */}
      <form className="space-y-6" onSubmit={emailPasswordSignIn}>
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
            className="mt-1 block w-full px-4 py-3 bg-[var(--color-green-slate-2)] border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
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
            className="mt-1 block w-full px-4 py-3 bg-[var(--color-green-slate-2)] border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--color-button)] hover:bg-[var(--color-logo-dark)] text-[var(--color-background-start)] font-bold py-3 px-4 rounded-md transition duration-300"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>

        {/* Link to Register Page */}
        <p className="text-sm text-center text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-[var(--color-accent)] hover:text-[var(--color-logo-dark)]"
          >
            Register here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};


