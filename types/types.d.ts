type KanbanState = {
  tasks: Tasks
  columns: Columns
  columnOrder: string[]
}

type Tasks = {
  [key: string]: Task
}

type Columns = {
  [key: string]: Column
}

type Column = {
  id: string
  title: string
  tasks: Tasks
  tasksOrder: string[]
}

type Task = {
  id: string
  title: string
  content: string
  head: boolean
  next: string | null
}

// Response data from db
type ColumnData = {
  id: string
  title: string
  tasks: Task[]
  taskCount: number
}
