import { useQuery } from 'react-query'
import { supabase } from '../utils/supabaseClient'

export const normalizeTasks = (tasks: Task[]): Tasks =>
  tasks.reduce((obj, task: Task) => ({ ...obj, [task.id]: task }), {})

export const newNormalizeTasks = (orderedTasks: Task[], tasks: Tasks): Tasks =>
  orderedTasks
    .map(({ id }) => tasks[id])
    .reduce((obj, task: Task) => ({ ...obj, [task.id]: task }), {})

export const fetchKanbanState = async () => {
  const user = supabase.auth.user()

  if (!user) {
    throw { message: 'User not authenticated', status: 401 }
  }

  const {
    data: datacolumns,
    error: columnErr,
    status: columnStatus,
  } = await supabase
    .from('columns')
    .select(
      `
      id,
      title, 
      task_ids,
      tasks(
        id,
        title,
        prev,
        next
      ),
      taskCount:tasks(count)
      `
    )
    .eq('user_id', user.id)

  if (columnErr && columnStatus !== 406) {
    throw columnErr
  }

  const columns: ColumnData[] = datacolumns || []

  const getTasksOrder = (head: Task, tasks: Task[]) => {
    const normalizedTasks = normalizeTasks(tasks)
    let orderTasks: Task[] = []

    recursiveList(head, orderTasks, normalizedTasks)

    return orderTasks
  }

  const recursiveList = (
    currentValue: Task,
    orderTasks: Task[],
    normalizedTasks: Tasks
  ) => {
    const nextValue = currentValue?.next
      ? normalizedTasks[currentValue?.next]
      : null

    if (!nextValue) {
      return
    }

    if (!currentValue || currentValue.next === null) {
      orderTasks.push(currentValue)
      return
    }

    orderTasks.push(currentValue)

    if (nextValue?.next === null) {
      orderTasks.push(nextValue)
      return
    }

    recursiveList(nextValue, orderTasks, normalizedTasks)
  }

  const normalizedColumns: {
    [key: string]: Column
  } = columns.reduce((obj, column: ColumnData) => {
    const head = column.tasks.find((task) => task.prev === null)

    return {
      ...obj,
      [column.id]: {
        ...column,
        tasks: normalizeTasks(column.tasks) || [],
        tasksOrder: head ? getTasksOrder(head, column.tasks) : [],
      },
    }
  }, {})

  // console.log('normalized columns: ', normalizedColumns)

  return {
    columns: normalizedColumns,
    columnOrder: ['1', '2', '3'],
  } as KanbanState
}

export const useGetKanbanState = () =>
  useQuery<KanbanState>('kanbanState', fetchKanbanState)
