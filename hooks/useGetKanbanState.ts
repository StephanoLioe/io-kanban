import { useQuery } from 'react-query'
import { supabase } from '../utils/supabaseClient'

export const fetchKanbanState = async () => {
  const user = supabase.auth.user()

  if (!user) {
    throw { message: 'User not authenticated', status: 401 }
  }

  const {
    data: datatasks,
    error: tasksErr,
    status: tasksStatus,
  } = await supabase
    .from('tasks')
    .select(`id, title, content`)
    .eq('user_id', user.id)

  if (tasksErr && tasksStatus !== 406) {
    throw tasksErr
  }

  const {
    data: datacolumns,
    error: columnErr,
    status: columnStatus,
  } = await supabase
    .from('columns')
    .select(`id, title, task_ids`)
    .eq('user_id', user.id)

  if (columnErr && columnStatus !== 406) {
    throw columnErr
  }

  const tasks: Task[] = datatasks || []
  const columns: ColumnData[] = datacolumns || []

  const normalizedTasks: {
    [key: string]: Task
  } = tasks.reduce((obj, task: Task) => ({ ...obj, [task.id]: task }), {})

  const normalizedColumns: {
    [key: string]: Column
  } = columns.reduce(
    (obj, column: ColumnData) => ({
      ...obj,
      [column.id]: { ...column, taskIds: column.task_ids || [] },
    }),
    {}
  )

  return {
    columns: normalizedColumns,
    tasks: normalizedTasks,
    columnOrder: ['1', '2', '3'],
  } as KanbanState
}

export const useGetKanbanState = () =>
  useQuery<KanbanState>('kanbanState', fetchKanbanState)
