type SourceCol = {
  id: string
  title: string
  taskIds: number[]
}

type Task = {
  id: number
  title: string
  content: string
}

type KanbanState = {
  tasks: {
    [key: number]: Task
  }
  columns: {
    [key: string]: SourceCol
  }
  columnOrder: string[]
}
