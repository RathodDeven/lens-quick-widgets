'use client'
import React from 'react'
import UILayout from './UILayout'
import MuiThemeWrapper from './MuiThemeWrapper'
import ThemeProvider from './TailwindThemeProvider'
import WagmiWrapper from './WagmiWrapper'

const Wrappers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <MuiThemeWrapper>
        <WagmiWrapper>
          <UILayout>{children}</UILayout>
        </WagmiWrapper>
      </MuiThemeWrapper>
    </ThemeProvider>
  )
}

export default Wrappers
