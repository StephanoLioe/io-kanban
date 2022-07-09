import { useState } from 'react'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import { Session } from '@supabase/supabase-js'
import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { supabase } from '../utils/supabaseClient'

// Create a client
const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}

export default MyApp
