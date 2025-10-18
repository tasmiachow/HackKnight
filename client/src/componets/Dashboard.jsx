import React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useSession } from '../useSession.js'
import { supabase } from '../supabase.js'
import Navbar from './Navbar.jsx'

function Dashboard() {
    const session = useSession()
    const [loading, setLoading] = useState(true)
    const user = session?.user
    const meta = user?.user_metadata ?? {}
    
    const googleData =
      user?.identities?.find((i) => i.provider === 'google')?.identity_data ?? {}
  
    const { firstName, lastName } = useMemo(() => {
      const fn =
        meta.first_name ||
        googleData.given_name ||
        (meta.full_name?.split(' ')[0]) ||
        (googleData.name?.split(' ')[0]) ||
        ''
      const ln =
        meta.last_name ||
        googleData.family_name ||
        (meta.full_name?.split(' ').slice(1).join(' ')) ||
        (googleData.name?.split(' ').slice(1).join(' ')) ||
        ''
      return { firstName: fn, lastName: ln }
    }, [meta, googleData])

    useEffect(() => {
      if (session === undefined || session === null) {
        setLoading(true)
      } else {
        setLoading(false)
      }
    }, [session])


    useEffect(() => {
      if (!user) return
      const needsBackfill =
        (firstName && meta.first_name !== firstName) ||
        (lastName && meta.last_name !== lastName)
  
      if (needsBackfill) {
        supabase.auth.updateUser({
          data: { first_name: firstName || null, last_name: lastName || null }
        }).catch(() => {})
      }
    }, [user, firstName, lastName, meta.first_name, meta.last_name])
    if (loading) {
      return (
        <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
          <h2>Loading user data...</h2>
        </div>
      )
    }
  
    if (!user) return <p>No user found</p>

    return (
      <div>
        <Navbar/>
      <h2>Narrative Trader</h2>
      <p>
        Welcome{' '}
        {firstName || lastName
          ? `${firstName} ${lastName}`.trim()
          : user.email}
        !
      </p>
    </div>
    )
  }

export default Dashboard