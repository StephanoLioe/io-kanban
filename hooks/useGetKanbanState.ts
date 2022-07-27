import { useQuery } from 'react-query'
import { supabase } from '../utils/supabaseClient'

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
      position,  
      tasks(
        id,
        title,
        content,
        position,
        column_id
    )`
    )
    .eq('user_id', user.id)
    .order('position')
    .order('position', { foreignTable: 'tasks' })

  if (columnErr && columnStatus !== 406) {
    throw columnErr
  }

  return {
    columns: datacolumns,
  } as KanbanState
}

export const useGetKanbanState = () =>
  useQuery<KanbanState>('kanbanState', fetchKanbanState)
