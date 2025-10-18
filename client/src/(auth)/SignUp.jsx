import { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'
import Navbar from '../componets/Navbar.jsx'

export default function SignUp() {
  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [status,    setStatus]    = useState(null)
  const [loading,   setLoading]   = useState(false)

  const navigate = useNavigate()

  const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '')

  const emailPasswordSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

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
    <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <Navbar/>
      <h2>Create an account</h2>

      <button onClick={google} disabled={loading}>Continue with Google</button>

      <form onSubmit={emailPasswordSignUp} style={{ display: 'grid', gap: 8 }}>
        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating…' : 'Sign up'}
        </button>
      </form>

      {status && <small>{status}</small>}
    </div>
  )
}
