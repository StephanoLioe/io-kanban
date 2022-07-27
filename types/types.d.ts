type Column = {
  id: string
  title: string
  tasks: Task[]
  position: number
}

// type ColumnData = {
//   id: string
//   title: string
//   task_ids: string[]
// }

type Task = {
  id: string
  title: string
  content: string
  position: number
  column_id?: string
}

type KanbanState = {
  columns: Column[]
}
