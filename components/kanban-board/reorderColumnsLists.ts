import { onlyUnique } from '../../utils/helpers/onlyUnique'

type ReorderColumnsListProps = {
  sourceColumn: Column
  startIndex: number
  endIndex: number
}

export const reorderColumnsLists = ({
  sourceColumn,
  startIndex,
  endIndex,
}: ReorderColumnsListProps) => {
  // if there is only one item in list, return column
  if (startIndex === endIndex) {
    return {
      ...sourceColumn,
      positionsToUpdate: [],
    }
  }

  // update order in orderedTasks id's
  const newTasksOrder = sourceColumn.tasksOrder
  const newTasks = sourceColumn.tasks

  const lastIndex = newTasksOrder.length - 1

  let repositionedTasks: string[] = []

  if (startIndex === 0) {
    newTasks[newTasksOrder[startIndex]].head = false
    newTasks[newTasksOrder[startIndex + 1]].head = true

    repositionedTasks.push(newTasks[newTasksOrder[startIndex]].id)
    repositionedTasks.push(newTasks[newTasksOrder[startIndex + 1]].id)
  }

  if (startIndex > 0 && startIndex < lastIndex) {
    newTasks[newTasksOrder[startIndex - 1]].next =
      newTasks[newTasksOrder[startIndex]].next

    repositionedTasks.push(newTasks[newTasksOrder[startIndex - 1]].id)
  }

  if (startIndex === lastIndex) {
    newTasks[newTasksOrder[startIndex - 1]].next = null

    repositionedTasks.push(newTasks[newTasksOrder[startIndex - 1]].id)
  }

  const taskOrderCopy = [...newTasksOrder]
  const [removedTaskId] = taskOrderCopy.splice(startIndex, 1)
  taskOrderCopy.splice(endIndex, 0, removedTaskId)

  if (endIndex === 0) {
    newTasks[taskOrderCopy[endIndex]].head = true
    newTasks[taskOrderCopy[endIndex + 1]].head = false
    newTasks[taskOrderCopy[endIndex]].next =
      newTasks[taskOrderCopy[endIndex + 1]].id

    repositionedTasks.push(newTasks[taskOrderCopy[endIndex]].id)
    repositionedTasks.push(newTasks[taskOrderCopy[endIndex + 1]].id)
  }

  if (endIndex > 0 && endIndex < lastIndex) {
    newTasks[taskOrderCopy[endIndex]].next =
      newTasks[taskOrderCopy[endIndex + 1]].id

    newTasks[taskOrderCopy[endIndex - 1]].next =
      newTasks[taskOrderCopy[endIndex]].id

    repositionedTasks.push(newTasks[taskOrderCopy[endIndex]].id)
    repositionedTasks.push(newTasks[taskOrderCopy[endIndex - 1]].id)
  }

  if (endIndex === lastIndex) {
    newTasks[taskOrderCopy[endIndex - 1]].next =
      newTasks[taskOrderCopy[endIndex]].id
    newTasks[taskOrderCopy[endIndex]].next = null

    repositionedTasks.push(newTasks[taskOrderCopy[endIndex]].id)
    repositionedTasks.push(newTasks[taskOrderCopy[endIndex - 1]].id)
  }

  const positionsToUpdate = repositionedTasks.filter(onlyUnique)

  // return data to update db
  const newColumn = {
    ...sourceColumn,
    tasks: newTasks,
    tasksOrder: taskOrderCopy,
    positionsToUpdate,
  }

  return newColumn
}
