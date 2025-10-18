import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../supabase'
import { useSession } from '../useSession.js'
import Navbar from '../componets/Navbar.jsx'

export default function LogIn() {
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

  const google = async () => {
    setStatus('Redirecting to Google…')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) setStatus(error.message)
  }

  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <Navbar/>
      <h2>Log in</h2>
      {fromSignup && (
        <div
          style={{
            backgroundColor: '#e6f7ff',
            border: '1px solid #91d5ff',
            borderRadius: '8px',
            padding: '10px',
            color: '#0050b3',
            fontSize: '0.9rem',
          }}
        >
           Account created! Please confirm your email before signing in.
          {signupEmail && (
            <>
              <br />
              <small>We sent a link to <b>{signupEmail}</b>.</small>
            </>
          )}
        </div>
      )}

      <button onClick={google}>Continue with Google</button>

      <form onSubmit={emailPasswordSignIn} style={{ display: 'grid', gap: 8 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging on…' : 'Log in'}
        </button>
      </form>

      {status && <small>{status}</small>}
    </div>
  )
}
