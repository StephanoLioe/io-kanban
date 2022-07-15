export const ordenTasks = (head: Task, tasks: Tasks) => {
  let orderTasks: string[] = []

  let currentTask = head
  let next = head.next
  let hasNextTask = true

  while (hasNextTask) {
    orderTasks.push(currentTask.id)

    if (next !== null) {
      currentTask = tasks[next]
      next = currentTask?.next
    } else {
      hasNextTask = false
    }
  }

  return orderTasks
}
