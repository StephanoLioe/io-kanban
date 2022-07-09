type Column = {
  id: string
  title: string
  taskIds: string[]
}

type ColumnData = {
  id: string
  title: string
  task_ids: string[]
}

type Task = {
  id: string
  title: string
  content: string
}

type KanbanState = {
  tasks: {
    [key: string]: Task
  }
  columns: {
    [key: string]: Column
  }
  columnOrder: string[]
}
