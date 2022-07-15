import { useQuery } from 'react-query'
import { getKanbanState } from '../api/getKanbanState'

export const useGetKanbanState = () =>
  useQuery<KanbanState>('kanbanState', getKanbanState)
