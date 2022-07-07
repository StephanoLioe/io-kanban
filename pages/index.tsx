import type { NextPage } from 'next'
import Head from 'next/head'
import { KanbanBoard } from '../components/kanban-board'
import { mockData } from '../data/mockData'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>IO Kanban</title>
        <meta name='description' content='Just another awesome kanban board' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='h-screen'>
        <KanbanBoard kanbanState={mockData} />
      </div>
    </>
  )
}

export default Home
