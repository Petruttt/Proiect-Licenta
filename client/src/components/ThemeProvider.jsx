import React from 'react'
import {useSelector} from 'react-redux'

export default function ThemeProvider({children}) {
    const {tema} = useSelector(state => state.tema);
  return (
    <div className={tema}>
      <div className='text-gray-700 bg-white dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen'>
      {children}
      </div>
    </div>
  )
}
