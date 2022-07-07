import dynamic from 'next/dynamic'
import { ColumnsWrapper } from './ColumnsWrapper'

const Column = dynamic(() => import('./Column'), {
  ssr: false,
})

export const Columns = ({ state }: { state: KanbanState }) => {
  const columns = state.columnOrder.map((columnId) => {
    const column = state.columns[columnId]
    const tasks = column.taskIds.map((taskId) => state.tasks[taskId])

    return <Column key={column.id} column={column} tasks={tasks} />
  })

  return <ColumnsWrapper>{columns}</ColumnsWrapper>
}
