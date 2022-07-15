import { normalizeColumns } from '../helpers/normalizeTasks'
import { supabase } from '../supabaseClient'

export const getKanbanState = async () => {
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
      tasks(
        id,
        title,
        head,
        next
      ),
      taskCount:tasks(count)
      `
    )
    .eq('user_id', user.id)
    .order('head', { foreignTable: 'tasks' })

  if (columnErr && columnStatus !== 406) {
    throw columnErr
  }

  const columnsData: ColumnData[] = datacolumns || []
  const columns = normalizeColumns(columnsData)

  return {
    columns,
    columnOrder: ['1', '2', '3'],
  } as KanbanState
}
