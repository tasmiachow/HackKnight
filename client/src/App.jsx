import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './componets/Navbar'

function App() {
  return (
    <>
    <Navbar/>
   <h1> Feel the market vibe </h1>
      <Outlet />
    </>
  )
}

export default App
