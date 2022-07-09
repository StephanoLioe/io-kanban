import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { useGetKanbanState } from '../../hooks/useGetKanbanState'
import { useUpdateCardPosition } from '../../hooks/useUpdateCardPosition'
import { Columns } from '../columns'

export const KanbanBoard = () => {
  const { data, isSuccess } = useGetKanbanState()
  const { mutate: updatePosition } = useUpdateCardPosition()

  if (!data || (!data.columns && !data.columns)) return null

  if (!isSuccess) {
    return null
  }

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
    const sourceCol = data.columns[source.droppableId]
    const destinationCol = data.columns[destination.droppableId]

    if (sourceCol.id === destinationCol.id) {
      const newColumn = reorderColumnList(
        sourceCol,
        source.index,
        destination.index
      )

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      }

      updatePosition({
        newState,
        positionToUpdate: [newColumn],
      })
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
      ...data,
      columns: {
        ...data.columns,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      },
    }

    updatePosition({
      newState,
      positionToUpdate: [newStartCol, newEndCol],
    })
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <main className='flex flex-column h-full bg-white p-5'>
        <Columns state={data} />
      </main>
      <pre>{JSON.stringify(data, null, 2)}</pre>
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
