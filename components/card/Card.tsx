import React, { ReactNode } from 'react'

export type CardProps = {
  title: string
  children: ReactNode
}

export const Card = ({ title, children }: CardProps) => {
  return (
    <div className='flex flex-col w-full rounded-xl p-4 pt-3 bg-white drop-shadow mb-3'>
      <h4 className='mb-2 font-semibold'>{title}</h4>
      <p className='text-sm text-gray-500 leading-5'>{children}</p>
    </div>
  )
}
