import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { ColumnsWrapper } from './ColumnsWrapper'

const Column = dynamic(() => import('./Column'), {
  ssr: false,
})

// This needed for issue react-beautiful-dnd with react 18
// https://github.com/atlassian/react-beautiful-dnd/issues/1756#issuecomment-1092690855
const useWinReady = () => {
  const [winReady, setWinready] = useState(false)

  useEffect(() => {
    setWinready(true)
  }, [])

  return winReady
}

export const Columns = ({ state }: { state: KanbanState }) => {
  const winReady = useWinReady()

  const columns = state.columnOrder.map((columnId) => {
    const column = state.columns[columnId]
    const tasks = column.taskIds.map((taskId) => state.tasks[taskId])

    return <Column key={column.id} column={column} tasks={tasks} />
  })

  return winReady ? <ColumnsWrapper>{columns}</ColumnsWrapper> : null
}
