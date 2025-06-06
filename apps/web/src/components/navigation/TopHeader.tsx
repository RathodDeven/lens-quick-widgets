import React from 'react'
import { APP_NAME } from '@/src/utils/config'
import { useTheme } from '../wrappers/TailwindThemeProvider'
import { IconButton } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'

import { SignInWithLens } from 'lens-quick-widgets'
import { Theme } from 'lens-quick-widgets/dist/types'

const TopHeader = () => {
  const { theme, toggleTheme } = useTheme()
  return (
    <div className="flex flex-row items-center justify-between px-5 py-3 bg-s-bg">
      <div className="flex flex-row items-center">
        <img
          src="/android-chrome-192x192.png"
          className="rounded-xl w-10 h-10 mr-3"
          alt="logo"
        />
        <div className="text-xl font-bold">{APP_NAME}</div>
      </div>
      <div className="flex flex-row items-center gap-x-3">
        <SignInWithLens theme={Theme.green} />

        <IconButton
          onClick={toggleTheme}
          color="primary"
          aria-label="toggle theme"
        >
          {theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </div>
    </div>
  )
}

export default TopHeader
