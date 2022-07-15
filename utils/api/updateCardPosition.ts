import { supabase } from '../supabaseClient'

type UpdatePos = {
  positionsToUpdate: string[]
  newState: KanbanState
}

export const updateCardPosition = async (updatePos: UpdatePos) => {
  const tasks = updatePos.newState.columns['1'].tasks

  console.log('updateCard', tasks, updatePos)

  const user = supabase.auth.user()
  let response: Task[] = []
  updatePos.positionsToUpdate.forEach(async (id) => {
    const result = await supabase
      .from('tasks')
      .update({
        id: id,
        head: tasks[id].head || false,
        next: tasks[id].next,
      })
      .eq('id', id)
      .eq('user_id', user?.id)

    response.push(result.data)
  })
  return response
}
