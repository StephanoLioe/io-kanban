import type { NextPage } from 'next'
import Head from 'next/head'
import { Card } from '../components/card'
import { Column } from '../components/column'
import { ColumnsWrapper } from '../components/columns-wrapper'
import { DropSpace } from '../components/drop-space'

const Home: NextPage = () => {
  return (
    <div className='h-screen'>
      <Head>
        <title>IO Kanban</title>

        <meta name='description' content='Just another awesome kanban board' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='flex flex-column h-full bg-white p-5'>
        <ColumnsWrapper>
          <Column title='To do'>
            <Card title='Design'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed eum
              sapiente delectus unde libero? Eaque neque voluptate nobis
              dignissimos adipisci nostrum, eius maxime, enim provident iusto
              consequatur nesciunt saepe totam!
            </Card>
            <Card title='Testing'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed eum
              sapiente delectuo consequatur nesciunt saepe totam!
            </Card>
          </Column>
          <Column title='In progress'>
            <Card title='Development'>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde,
              ullam! Impedit, illum.
            </Card>
          </Column>
          <Column title='Complete'>
            <Card title='Wireframing'>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde,
              ullam! Impedit, illum. Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Magnam reprehenderit, illo eveniet totam
              explicabo atque corporis vitae consequuntur harum similique, quia
              ea distinctio modi aspernatur fugiat iste quas commodi beatae.
            </Card>
            <DropSpace />
          </Column>
        </ColumnsWrapper>
      </main>
    </div>
  )
}

export default Home
