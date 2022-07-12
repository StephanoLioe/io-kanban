import {
  DragDropContext,
  DraggableLocation,
  DropResult,
} from 'react-beautiful-dnd'
import {
  newNormalizeTasks,
  normalizeTasks,
  useGetKanbanState,
} from '../../hooks/useGetKanbanState'
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

    const sourceCol = data.columns[source.droppableId]
    const destinationCol = data.columns[destination.droppableId]
    // console.log('source', source)
    // console.log('destination', destination)

    // If the user drops within the same column but in a different position
    if (sourceCol.id === destinationCol.id) {
      const newColumn = reorderColumnsLists({
        destination,
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
        positionToUpdate: newColumn.positionsToUpdate,
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

type ReorderColumnsListProps = {
  source?: DraggableLocation
  destination: DraggableLocation
  sourceColumn: Column
  destinationColumn?: Column
  startIndex: number
  endIndex: number
}

// update state in react-query

const reorderColumnsLists = ({
  source,
  destination,
  sourceColumn,
  // destinationColumn,
  startIndex,
  endIndex,
}: ReorderColumnsListProps) => {
  console.log('sourceIndex', source?.index)
  console.log('destinationIndex', destination?.index)

  // update order in orderedTasks id's
  const newTasksOrder = sourceColumn.tasksOrder
  const newTasks = sourceColumn.tasks

  const lastIndex = newTasksOrder.length - 1

  let reorderedTask = newTasks[newTasksOrder[startIndex].id]
  console.log('reordererd task1', reorderedTask)

  const [removed] = newTasksOrder.splice(startIndex, 1)

  if (reorderedTask.prev) {
    newTasks[reorderedTask.prev].next = reorderedTask.next
  }

  if (reorderedTask.next) {
    newTasks[reorderedTask.next].prev = reorderedTask.prev
  }

  // when list of removed task is reorderd correctly,add the
  // removed tasks in the correct position
  newTasksOrder.splice(endIndex, 0, removed)

  reorderedTask = newTasks[newTasksOrder[startIndex].id]

  let repositionedTasks: string[] = []

  if (endIndex === 0) {
    newTasks[newTasksOrder[endIndex].id].prev = null

    newTasks[newTasksOrder[endIndex + 1].id].prev = reorderedTask.id

    newTasks[newTasksOrder[endIndex].id].next =
      newTasks[newTasksOrder[endIndex + 1].id].id

    repositionedTasks = [
      ...repositionedTasks,
      newTasks[newTasksOrder[endIndex].id].id,
      newTasks[newTasksOrder[endIndex + 1].id].id,
    ]
  }

  if (endIndex > 0 && endIndex < lastIndex) {
    newTasks[newTasksOrder[endIndex - 1].id].next = reorderedTask.id

    newTasks[newTasksOrder[endIndex].id].prev =
      newTasks[newTasksOrder[endIndex - 1].id].id

    newTasks[newTasksOrder[endIndex - 1].id].next =
      newTasks[newTasksOrder[endIndex].id].id

    newTasks[newTasksOrder[endIndex].id].next =
      newTasks[newTasksOrder[endIndex + 1].id].id

    newTasks[newTasksOrder[endIndex + 1].id].prev =
      newTasks[newTasksOrder[endIndex].id].id

    repositionedTasks = [
      ...repositionedTasks,
      newTasks[newTasksOrder[endIndex - 1].id].id,
      newTasks[newTasksOrder[endIndex].id].id,
      newTasks[newTasksOrder[endIndex + 1].id].id,
    ]
  }

  if (endIndex === lastIndex) {
    newTasks[newTasksOrder[endIndex].id].next = null

    newTasks[newTasksOrder[endIndex - 1].id].next = reorderedTask.id

    newTasks[newTasksOrder[endIndex].id].prev =
      newTasks[newTasksOrder[endIndex - 1].id].id

    repositionedTasks = [
      ...repositionedTasks,
      newTasks[newTasksOrder[endIndex].id].id,
      newTasks[newTasksOrder[endIndex - 1].id].id,
    ]
  }

  repositionedTasks = repositionedTasks.filter((v, i, a) => a.indexOf(v) === i)

  // log current task array in correct order for debuggin
  let tasksArr: Task[] = []
  newTasksOrder.forEach(({ id }) => {
    tasksArr.push(newTasks[id])
  })
  console.log('newOrderdTasks', tasksArr)

  // return data to update db
  const newColumn = {
    ...sourceColumn,
    tasks: newNormalizeTasks(newTasksOrder, newTasks),
    tasksOrder: newTasksOrder,
    positionsToUpdate: repositionedTasks,
  }
  console.log('new column', newColumn)
  return newColumn
}
