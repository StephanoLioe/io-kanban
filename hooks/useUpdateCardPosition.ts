import { useQueryClient, useMutation } from 'react-query'
import { supabase } from '../utils/supabaseClient'

type UpdatePos = {
  positionToUpdate: string[]
  newState: KanbanState
}

export const updateCardPosition = async (updatePos: UpdatePos) => {
  const tasks = updatePos.newState.columns['1'].tasks
  console.log('updateCard', tasks)

  const user = supabase.auth.user()
  updatePos.positionToUpdate.forEach(async (id) => {
    await supabase
      .from('tasks')
      .update({
        id: id,
        prev: tasks[id].prev,
        next: tasks[id].next,
      })
      .eq('id', id)
      .eq('user_id', user?.id)
  })
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
    // onSettled: () => {
    //   queryClient.invalidateQueries(['kanbanState'])
    // },
  })
}
