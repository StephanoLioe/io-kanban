import type { NextPage } from 'next'
import Head from 'next/head'
import { Auth } from '../components/auth'
import { KanbanBoard } from '../components/kanban-board'
import { useGetAuthenticationSession } from '../hooks/useGetAuthenicationSession'
import { supabase } from '../utils/supabaseClient'

const Home: NextPage = () => {
  const session = useGetAuthenticationSession()

  if (!session) {
    return <Auth />
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.warn('Could not sign out')
    }
  }

  return (
    <>
      <Head>
        <title>IO Kanban</title>
        <meta name='description' content='Just another awesome kanban board' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='h-screen'>
        <div>
          <button
            className='h-9 rounded-xl bg-red-300 drop-shadow-sm duration-300 hover:bg-red-200 px-4'
            onClick={signOut}
          >
            Sign out
          </button>
        </div>
        <KanbanBoard />
      </div>
    </>
  )
}

export default Home
