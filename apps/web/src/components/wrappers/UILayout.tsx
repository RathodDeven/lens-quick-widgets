'use client'
import clsx from 'clsx'
import React from 'react'

import { Inter } from 'next/font/google'
import TopHeader from '@/src/components/navigation/TopHeader'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

interface Props {
  // Define any props that the component will accept
  children: React.ReactNode
}

const inter = Inter({ subsets: ['latin'] })

const UILayout: React.FC<Props> = (props) => {
  // Define the component's logic and rendering here
  return (
    <div className={clsx(inter.className, 'bg-p-bg text-p-text')}>
      <div className="relative z-10 h-screen w-screen">
        <div className="w-full absolute left-0 right-0 top-0 ">
          <TopHeader />
        </div>
        <div className="start-center-row h-screen pt-[60px] overflow-hidden">
          <div className="h-full w-full">{props.children}</div>
        </div>
      </div>
    </div>
  )
}

export default UILayout
