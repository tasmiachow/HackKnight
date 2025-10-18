import { Navigate } from 'react-router-dom'
import { useSession } from '../useSession'

export default function Protected({ children }) {
  const session = useSession()
  if (session === null) return <div>Loading…</div>
  return session ? children : <Navigate to="/login" replace />
}
