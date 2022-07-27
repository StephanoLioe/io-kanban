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

export const Columns = ({ data }: { data: KanbanState }) => {
  const winReady = useWinReady()

  if (!winReady) {
    return null
  }

  return (
    <ColumnsWrapper>
      {data.columns.map((column) => (
        <Column key={column.id} column={column} />
      ))}
    </ColumnsWrapper>
  )
}
