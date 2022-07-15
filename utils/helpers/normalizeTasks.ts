import { ordenTasks } from './ordenTasks'

export const normalizeTasks = (tasks: Task[]): Tasks =>
  tasks.reduce((obj: Tasks, task: Task) => {
    obj[task.id] = task
    return obj
  }, {})

export const normalizeColumns = (columns: ColumnData[]) =>
  columns.reduce((obj: Columns, column: ColumnData) => {
    if (!column.tasks[0]) {
      obj[column.id] = {
        ...column,
        tasks: {},
        tasksOrder: [],
      }

      return obj
    }
    // the first item of the task should be head:true
    const head = column.tasks.find(({ head }) => head === true)

    if (!head) {
      return obj
    }

    const tasks = normalizeTasks(column.tasks)
    const tasksOrder = ordenTasks(head, tasks)

    obj[column.id] = {
      id: column.id,
      title: column.title,
      tasks,
      tasksOrder,
    }
    return obj
  }, {})
