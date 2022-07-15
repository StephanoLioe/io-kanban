import { useQueryClient, useMutation } from 'react-query'
import { updateCardPosition } from '../api/updateCardPosition'

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
      // queryClient.invalidateQueries(['kanbanState'])
    },
  })
}
