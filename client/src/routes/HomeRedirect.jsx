import { Navigate } from "react-router-dom"
import { useSession } from "../useSession"
export default function HomeRedirect() {
    const session = useSession()
    if (session?.user) return <Navigate to="/dashboard" replace />
    return <Navigate to="/login" replace />
  }
  