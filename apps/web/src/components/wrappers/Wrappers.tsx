'use client'
import React from 'react'
import UILayout from './UILayout'
import MuiThemeWrapper from './MuiThemeWrapper'
import ThemeProvider from './TailwindThemeProvider'
import { Toaster } from 'react-hot-toast'
import WagmiWrapper from './WagmiWrapper'

const Wrappers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <MuiThemeWrapper>
        <WagmiWrapper>
          <Toaster position={'top-center'} />
          <UILayout>{children}</UILayout>
        </WagmiWrapper>
      </MuiThemeWrapper>
    </ThemeProvider>
  )
}

export default Wrappers
