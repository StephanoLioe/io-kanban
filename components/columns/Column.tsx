import { Draggable, Droppable } from 'react-beautiful-dnd'
import { AddCardBtn } from '../add-card-btn'
import { Card } from '../card'

type ColumnsProps = {
  column: Column
  tasks: Task[]
}

const Column = ({ column, tasks }: ColumnsProps) => {
  return (
    <div className='flex flex-col h-full gap-4 w-80 bg-green-50 font-medium rounded-2xl p-3 pt-4'>
      <h3>{column.title}</h3>
      <AddCardBtn />
      <Droppable key={column.id} droppableId={column.id}>
        {(droppableProvided, droppableSnapshot) => (
          <div
            className='flex flex-col gap-6 h-full'
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                {(draggableProvided, draggableSnapshot) => (
                  <div
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                  >
                    <Card title={task.title} content={task.content} />
                  </div>
                )}
              </Draggable>
            ))}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}

export default Column
