import React from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../componets/layout/AuthLayout.jsx";
import { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'


export default function RegisterPage ()  {
  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [retypePassword, setRetypePassword] = useState('')
  const [status,    setStatus]    = useState(null)
  const [loading,   setLoading]   = useState(false)

  const navigate = useNavigate()

  const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '')

  const emailPasswordSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    if (password !== retypePassword) {
      setStatus("Passwords do not match.");
      return;
    }
    setLoading(true)

    try {
      const formattedFirstName = cap(firstName)
      const formattedLastName  = cap(lastName)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: formattedFirstName,
            last_name:  formattedLastName,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })

      if (error) {
        setStatus(error.message)
        return
      }

      if (!data?.user) {
        setStatus('Check your email to confirm your account.')
        navigate('/login', { replace: true, state: { fromSignup: true, email }, })
        return
      }

      await supabase.from('profiles').upsert({
        id: data.user.id,
        first_name: formattedFirstName,
        last_name:  formattedLastName,
        email,
      })

      navigate('/login', { replace: true, state: { fromSignup: true, email },})
    } catch (err) {
      console.error('signup error:', err)
      setStatus(err?.message || 'Something went wrong while creating your account.')
    } finally {
      
      setLoading(false)
    }
  }

  const google = async () => { setStatus('Redirecting to Google…') 
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' }) 
    if (error) setStatus(error.message) }

  return (
    <AuthLayout title="Create Account">
      <button
        type="button"
        onClick={google}
        disabled={loading}
        className="mb-6 w-full rounded-md bg-white/90 px-4 py-3 font-semibold text-slate-900 transition hover:bg-white disabled:opacity-60"
      >
        Continue with Google
      </button>
      <p className="text-center text-slate-400 mb-4">or</p>
      <form className="space-y-6" onSubmit={emailPasswordSignUp}>
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
              className="mt-1 block w-full px-4 py-3 bg-[var(--color-green-slate-2)] border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Jane"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoComplete="given-name"
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
              className="mt-1 block w-full px-4 py-3 bg-[var(--color-green-slate-2)] border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              autoComplete="family-name"
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
            autoComplete="new-password"
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
            className="mt-1 block w-full px-4 py-3 bg-[var(--color-green-slate-2)] border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="••••••••"
            value={retypePassword}
            onChange={(e) => setRetypePassword(e.target.value)}
            required
            autoComplete="new-password"
            
          />
        </div>

        {status && (
          <p
            className={`text-center text-sm ${
              status.includes("match")
                ? "text-red-400"
                : "text-cyan-300"
            }`}
          >
            {status}
          </p>
        )}
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--color-button)] hover:bg-[var(--color-logo-dark)] text-[var(--color-background-start)] font-bold py-3 px-4 rounded-md transition duration-300"
        >
          {loading ? "Creating…" : "Sign up"}
        </button>

        {/* Link to Login Page */}
        <p className="text-sm text-center text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-[var(--color-accent)] hover:text-[var(--color-logo-dark)]"
          >
            Login here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

