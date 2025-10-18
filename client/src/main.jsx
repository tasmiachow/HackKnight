import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import App from './App.jsx'
import Login from './(auth)/Login.jsx'
import Dashboard from './componets/Dashboard.jsx'
import Protected from './(auth)/Protected.jsx'
import SignUp from './(auth)/SignUp.jsx'
import SignOut from './(auth)/SignOut.jsx'
import HomeRedirect from './routes/HomeRedirect.jsx'
import DashboardView from './routes/DashboardView.jsx'


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<App/>}>
        <Route index element={<HomeRedirect/>} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="signout" element={<SignOut />} />
        <Route
          path="dashboard"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
