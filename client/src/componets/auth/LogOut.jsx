import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '/src/supabase.js'

export default function SignOut() {
  const navigate = useNavigate()
  useEffect(() => {
    (async () => {
      await supabase.auth.signOut()
      navigate('/login', { replace: true })
    })()
  }, [navigate])
  return <p>Signing you out…</p>
}
