import { useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import NoWorkResult from 'postcss/lib/no-work-result'
import { mockData } from '../../data/mockData'
import { useGetKanbanState } from '../../hooks/useGetKanbanState'
import { useUpdateCardPosition } from '../../hooks/useUpdateCardPosition'
import { Columns } from '../columns'

export const KanbanBoard = () => {
  const [data, setData] = useState<KanbanState>(mockData)
  // const { data, isSuccess } = useGetKanbanState()
  const { mutate: updatePosition } = useUpdateCardPosition()

  if (!data.columns) return null

  // if (!isSuccess) {
  //   return null
  // }

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

    console.log('Data:', data)
    console.log('source/destination:', source, destination)

    // If the user drops within the same column but in a different position
    const sourceCol = data.columns.find((col) => col.id === source.droppableId)
    const destinationCol = data.columns.find(
      (col) => col.id === destination.droppableId
    )

    const sourceColIndex = data.columns.findIndex(
      (col) => col.id === source.droppableId
    )

    if (!sourceCol || !destinationCol) {
      return
    }
    console.log('Col:', sourceCol, destinationCol)

    const destinationColIndex = data.columns.findIndex(
      (col) => col.id === destination.droppableId
    )

    if (sourceColIndex == -1 || destinationColIndex === -1) {
      return
    }
    console.log('ColInded:', sourceColIndex, destinationColIndex)

    if (sourceCol.id === destinationCol.id) {
      const newColumn = reorderColumnList(
        sourceCol,
        source.index,
        destination.index
      )

      const newState = { ...data }

      newState.columns[sourceColIndex] = newColumn

      setData(newState)

      // updatePosition({
      //   newState,
      //   positionToUpdate: [newColumn],
      // })
      return
    }

    // If the user moves from one column to another
    const startTasks = sourceCol.tasks
    const [removedTask] = startTasks.splice(source.index, 1)
    const newStartCol = {
      ...sourceCol,
      tasksId: startTasks,
    }

    const endTasks = destinationCol.tasks
    endTasks.splice(destination.index, 0, removedTask)
    const newEndCol = {
      ...destinationCol,
      tasks: endTasks,
    }

    const newState = { ...data }
    newState.columns[sourceColIndex] = newStartCol
    newState.columns[destinationColIndex] = newEndCol

    setData(newState)

    // updatePosition({
    //   newState,
    //   positionToUpdate: [newStartCol, newEndCol],
    // })
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <main className='flex flex-column h-full bg-white p-5'>
        <Columns data={data} />
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
  const newTasks = [...sourceCol.tasks]
  const [removedTask] = newTasks.splice(startIndex, 1)
  newTasks.splice(endIndex, 0, removedTask)

  const newColumn = {
    ...sourceCol,
    tasks: newTasks,
  }

  return newColumn
}
