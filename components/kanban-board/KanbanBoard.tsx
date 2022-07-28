import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { useGetKanbanState } from '../../hooks/useGetKanbanState'
import { useUpdateCardPosition } from '../../hooks/useUpdateCardPosition'
import { Columns } from '../columns'

export const KanbanBoard = () => {
  const { data, isSuccess } = useGetKanbanState()

  const { mutate: updatePosition } = useUpdateCardPosition()

  if (!data?.columns) return null

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

    const sourceCol = data.columns.find(
      (col) => String(col.id) === source.droppableId
    )
    const destinationCol = data.columns.find(
      (col) => String(col.id) === destination.droppableId
    )

    if (!sourceCol || !destinationCol) {
      return
    }

    const sourceColIndex = data.columns.findIndex(
      (col) => String(col.id) === source.droppableId
    )

    const destinationColIndex = data.columns.findIndex(
      (col) => String(col.id) === destination.droppableId
    )

    if (sourceColIndex === -1 || destinationColIndex === -1) {
      return
    }

    // If the user drops within the same column but in a different position
    if (sourceCol.id === destinationCol.id) {
      const newColumn = reorderColumnList(
        sourceCol,
        source.index,
        destination.index
      )

      const newState = { ...data }

      newState.columns[sourceColIndex] = newColumn

      const positionsToUpdateSource = newState.columns[
        sourceColIndex
      ].tasks.slice(Math.min(source.index, destination.index))

      updatePosition({
        newState,
        positionsToUpdate: positionsToUpdateSource,
      })
      return
    }

    // If the user moves from one column to another
    const startTasks = sourceCol.tasks
    const [removedTask] = startTasks.splice(source.index, 1)
    const newStartCol = {
      ...sourceCol,
      tasksId: startTasks
        .map((task, i) => ({
          ...task,
          column_id: sourceCol.id,
          position: i,
        }))
        .sort(sortPosition),
    }

    const endTasks = destinationCol.tasks
    endTasks.splice(destination.index, 0, removedTask)
    const newEndCol = {
      ...destinationCol,
      tasks: endTasks
        .map((task, i) => ({
          ...task,
          column_id: destinationCol.id,
          position: i,
        }))
        .sort(sortPosition),
    }

    const newState = { ...data }
    newState.columns[sourceColIndex] = newStartCol
    newState.columns[destinationColIndex] = newEndCol

    const positionsToUpdateSource = newState.columns[
      sourceColIndex
    ].tasks.slice(source.index)

    const positionsToUpdateDestination = newState.columns[
      destinationColIndex
    ].tasks.slice(destination.index)

    updatePosition({
      newState,
      positionsToUpdate: [
        ...positionsToUpdateSource,
        ...positionsToUpdateDestination,
      ],
    })
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <main className='flex flex-column h-full bg-white p-5'>
        <Columns data={data} />
      </main>
    </DragDropContext>
  )
}

const reorderColumnList = (
  sourceCol: Column,
  startIndex: number,
  endIndex: number
) => {
  const newTasks = [...sourceCol.tasks]
  const [removedTask] = newTasks.splice(startIndex, 1)
  newTasks.splice(endIndex, 0, removedTask)

  const newColumn = {
    ...sourceCol,
    tasks: newTasks
      .map((task, i) => ({ ...task, position: i }))
      .sort(sortPosition),
  }

  return newColumn
}

const sortPosition = (a: Task, b: Task) => a.position - b.position
