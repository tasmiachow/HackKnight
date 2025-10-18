import { Link, Outlet } from 'react-router-dom'
import '../App.css'
import { useSession } from '../useSession'
import { useLocation } from 'react-router-dom'
import Dashboard from './Dashboard'



const Navbar = () => {
    const session = useSession()
  const location = useLocation()
  const path = location.pathname

  const onLogin = path === '/login'
  const onSignup = path === '/signup'
  const onDashboard = path === '/dashboard'
    return (
        <>
            <nav style={{ display: 'flex', gap: 12 }}>
            {session  && <Link to="/dashboard">NarrativeTrader</Link>}
            {!session && !onLogin && <Link to="/login">Login</Link>}
            {!session && !onSignup && <Link to="/signup">Sign up</Link>}
            
            {session && <Link to="/dashboard">Dashboard</Link>}
            {session && <span>Market Map</span>}
            {session && <span>Explore</span>}
            {session && <span>Signals</span>}
            {session && <span>Settings</span>}
    
            {session  && <Link to="/signout">Sign out</Link>}
        
            
            </nav>
        
        </>
    );
};

export default Navbar;