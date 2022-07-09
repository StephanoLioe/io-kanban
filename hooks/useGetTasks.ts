// import { useQuery } from 'react-query'
// import { supabase } from '../utils/supabaseClient'

// export const fetchTasks = async () => {
//   const user = supabase.auth.user()

//   console.log('USER: ', user)

//   if (!user) {
//     throw { message: 'User not authenticated', status: 401 }
//   }

//   let { data, error, status } = await supabase
//     .from('tasks')
//     .select(`id, title, content`)
//     .eq('user_id', user.id)

//   if (error && status !== 406) {
//     throw error
//   }

//   return data
// }

// export const useGetTasks = () => {
//   const output = useQuery('tasks', fetchTasks)

//   if (!output.isSuccess || !output?.data) {
//     return { ...output, data: null }
//   }

//   const normalizedData: KanbanState = output.data.reduce(
//     (obj, task: Task) => ({ ...obj, [task.id]: task }),
//     {}
//   )
//   return { ...output, data: normalizedData }
// }
