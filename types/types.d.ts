type Column = {
  id: number
  title: string
  tasks: Task[]
  position: number
}

type Task = {
  id: number
  title: string
  content: string
  position: number
  column_id: number
}

type KanbanState = {
  columns: Column[]
}
