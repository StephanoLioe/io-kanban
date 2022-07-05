import { ReactNode } from 'react'
import { AddCardBtn } from '../add-card-btn'

type ColumnsProps = {
  title: string
  children: ReactNode
}

export const Column = ({ title, children }: ColumnsProps) => {
  return (
    <div className='flex flex-col h-full gap-4 w-80 bg-green-50 font-medium rounded-2xl p-3 pt-4'>
      <h3>{title}</h3>
      <AddCardBtn />
      {children}
    </div>
  )
}
