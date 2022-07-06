import React, { ReactNode } from 'react'

export type CardProps = {
  title: string
  content: string
}

export const Card = ({ title, content }: CardProps) => {
  return (
    <div className='flex flex-col w-full rounded-xl p-4 pt-3 bg-white drop-shadow'>
      <h4 className='mb-2 font-semibold'>{title}</h4>
      <p className='text-sm text-gray-500 leading-5'>{content}</p>
    </div>
  )
}
