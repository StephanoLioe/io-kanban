import { useQueryClient, useMutation } from 'react-query'
import { supabase } from '../utils/supabaseClient'

type UpdatePos = {
  positionsToUpdate: Task[]
  newState: KanbanState
}

export const updateCardPosition = async (updatePos: UpdatePos) => {
  const user = supabase.auth.user()
  if (!user) {
    console.error('Not authenticated')
    return
  }
  const positionsToUpdate = updatePos.positionsToUpdate.map((task) => ({
    ...task,
    user_id: user.id,
  }))

  const { data } = await supabase
    .from('tasks')
    .upsert(positionsToUpdate)
    .eq('user_id', user.id)

  return data
}

export const useUpdateCardPosition = () => {
  const queryClient = useQueryClient()
  return useMutation(updateCardPosition, {
    // When mutate is called:
    onMutate: async (updatePos) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(['kanbanState'])

      // Snapshot the previous value
      const previousState: KanbanState | undefined = queryClient.getQueryData([
        'kanbanState',
      ])

      // Optimistically update to the new value
      previousState &&
        queryClient.setQueryData(['kanbanState'], {
          ...updatePos.newState,
        })

      // Return a context with the previous and new todo
      return { previousState }
    },
    // If the mutation fails, use the context we returned above
    onError: (_err, _positionsToUpdate, context) => {
      queryClient.setQueryData(['kanbanState'], context?.previousState)
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(['kanbanState'])
    },
  })
}
