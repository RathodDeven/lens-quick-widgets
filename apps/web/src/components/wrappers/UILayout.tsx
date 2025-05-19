'use client'
import clsx from 'clsx'
import React from 'react'
import { usePathname } from 'next/navigation'

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
  const pathname = usePathname()
  const isEmbedPage = pathname?.startsWith('/embed')

  // For embed pages, return children directly without any wrapper
  if (isEmbedPage) {
    return <>{props.children}</>
  }

  // For regular pages, use the normal layout structure
  return (
    <div className={clsx(inter.className, 'bg-p-bg text-p-text min-h-screen')}>
      <div className="relative min-h-screen w-full">
        <div className="w-full sticky left-0 right-0 top-0 z-10">
          <TopHeader />
        </div>
        <div className="w-full pt-[60px] overflow-y-auto">
          <div className="w-full">{props.children}</div>
        </div>
      </div>
    </div>
  )
}

export default UILayout
