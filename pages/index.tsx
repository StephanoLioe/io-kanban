import { useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { ColumnsWrapper } from '../components/columns-wrapper'
import { initialData } from '../data/initalData'

// TODO implement DropSpace
// import { DropSpace } from '../components/drop-space'

const Column = dynamic(() => import('../components/column/Column'), {
  ssr: false,
})

const Home: NextPage = () => {
  const [state, setState] = useState<KanbanState>(initialData)

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result

    // If user tries to drop in an unknown destination
    if (!destination) return

    // if the user drags and drops back in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    // If the user drops within the same column but in a different position
    const sourceCol = state.columns[source.droppableId]
    const destinationCol = state.columns[destination.droppableId]

    if (sourceCol.id === destinationCol.id) {
      const newColumn = reorderColumnList(
        sourceCol,
        source.index,
        destination.index
      )

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      }
      setState(newState)
      return
    }

    // If the user moves from one column to another
    const startTaskIds = Array.from(sourceCol.taskIds)
    const [removed] = startTaskIds.splice(source.index, 1)
    const newStartCol = {
      ...sourceCol,
      taskIds: startTaskIds,
    }

    const endTaskIds = Array.from(destinationCol.taskIds)
    endTaskIds.splice(destination.index, 0, removed)
    const newEndCol = {
      ...destinationCol,
      taskIds: endTaskIds,
    }

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      },
    }

    setState(newState)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Head>
        <title>IO Kanban</title>
        <meta name='description' content='Just another awesome kanban board' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='h-screen'>
        <main className='flex flex-column h-full bg-white p-5'>
          <ColumnsWrapper>
            {state.columnOrder.map((columnId) => {
              const column = state.columns[columnId]
              const tasks = column.taskIds.map((taskId) => state.tasks[taskId])

              return <Column key={column.id} column={column} tasks={tasks} />
            })}
          </ColumnsWrapper>
        </main>
      </div>
    </DragDropContext>
  )
}

const reorderColumnList = (
  sourceCol: SourceCol,
  startIndex: number,
  endIndex: number
) => {
  const newTaskIds = Array.from(sourceCol.taskIds)
  const [removed] = newTaskIds.splice(startIndex, 1)
  newTaskIds.splice(endIndex, 0, removed)

  const newColumn = {
    ...sourceCol,
    taskIds: newTaskIds,
  }

  return newColumn
}

export default Home
