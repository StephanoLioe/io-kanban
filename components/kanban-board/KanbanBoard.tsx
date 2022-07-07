import { useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { Columns } from '../columns'

export const KanbanBoard = ({ kanbanState }: { kanbanState: KanbanState }) => {
  const [state, setState] = useState(kanbanState)

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
    const startTaskIds = sourceCol.taskIds
    const [removed] = startTaskIds.splice(source.index, 1)
    const newStartCol = {
      ...sourceCol,
      taskIds: startTaskIds,
    }

    const endTaskIds = destinationCol.taskIds
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
      <main className='flex flex-column h-full bg-white p-5'>
        <Columns state={state} />
      </main>
    </DragDropContext>
  )
}

const reorderColumnList = (
  sourceCol: Column,
  startIndex: number,
  endIndex: number
) => {
  const newTaskIds = sourceCol.taskIds
  const [removed] = newTaskIds.splice(startIndex, 1)
  newTaskIds.splice(endIndex, 0, removed)

  const newColumn = {
    ...sourceCol,
    taskIds: newTaskIds,
  }

  return newColumn
}
