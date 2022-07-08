import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../utils/supabaseClient'

export const useGetAuthenticationSession = () => {
  const [session, setSession] = useState<Session | null>(null)
  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return session
}
