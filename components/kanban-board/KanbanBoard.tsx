import {
  DragDropContext,
  DraggableLocation,
  DropResult,
} from 'react-beautiful-dnd'
import { useGetKanbanState } from '../../utils/hooks/useGetKanbanState'
import { useUpdateCardPosition } from '../../utils/hooks/useUpdateCardPosition'
import { Columns } from '../columns'
import { reorderColumnsLists } from './reorderColumnsLists'

export const KanbanBoard = () => {
  const { data, isSuccess } = useGetKanbanState()
  const { mutate: updatePosition } = useUpdateCardPosition()

  if (!isSuccess) {
    return null
  }

  if (!data || !data.columns) return null

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result
    console.log('source', source)
    console.log('destination', destination)

    // If user tries to drop in an unknown destination
    if (!destination) return

    // if the user drags and drops back in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const sourceCol = data.columns[source.droppableId]
    const destinationCol = data.columns[destination.droppableId]

    // If the user drops within the same column but in a different position
    if (sourceCol.id === destinationCol.id) {
      const newColumn = reorderColumnsLists({
        sourceColumn: sourceCol,
        startIndex: source.index,
        endIndex: destination.index,
      })

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      }
      console.log('newState', newState)

      updatePosition({
        newState,
        positionsToUpdate: newColumn.positionsToUpdate,
      })
      return
    }

    // If the user moves from one column to another
    // const startTasksOrder = sourceCol.tasksOrder
    // const [removed] = startTasksOrder.splice(source.index, 1)
    // const newStartCol = {
    //   ...sourceCol,
    //   tasks: normalizeTasks(startTasksOrder),
    //   tasksOrder: startTasksOrder,
    // }

    // const endTasksOrder = destinationCol.tasksOrder
    // endTasksOrder.splice(destination.index, 0, removed)
    // const newEndCol = {
    //   ...destinationCol,
    //   tasks: normalizeTasks(endTasksOrder),
    //   tasksOrder: endTasksOrder,
    // }

    // const newState = {
    //   ...data,
    //   columns: {
    //     ...data.columns,
    //     [newStartCol.id]: newStartCol,
    //     [newEndCol.id]: newEndCol,
    //   },
    // }

    // updatePosition({
    //   newState,
    //   positionToUpdate: [newStartCol, newEndCol],
    // })
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
