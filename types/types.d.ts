type Column = {
  id: string
  title: string
  tasks: Tasks
  tasksOrder: Task[]
}

type Tasks = {
  [key: string]: Task
}

type Columns = {
  [key: string]: Column
}

type ColumnData = {
  id: string
  title: string
  tasks: Task[]
  taskCount: number
}

type Task = {
  id: string
  title: string
  content?: string
  prev: string | null
  next: string | null
}

type KanbanState = {
  tasks: Tasks
  columns: Columns
  columnOrder: string[]
}
