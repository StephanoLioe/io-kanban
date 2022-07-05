import { ReactNode } from 'react'

export const ColumnsWrapper = ({ children }: { children: ReactNode }) => {
  return <div className='flex flex-row gap-6'>{children}</div>
}
