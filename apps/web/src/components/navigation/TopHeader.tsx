import React from 'react'
import { APP_NAME } from '@/src/utils/config'
import { useTheme } from '../wrappers/TailwindThemeProvider'
import { Button } from '@mui/material'
import { ConnectKitButton } from 'connectkit'
const TopHeader = () => {
  const { theme, toggleTheme } = useTheme()
  return (
    <div className="flex flex-row items-center justify-between p-5 bg-s-bg">
      <div className="text-xl font-bold">{APP_NAME}</div>
      <ConnectKitButton />
      <Button variant="contained" onClick={toggleTheme}>
        {theme === 'light' ? 'Dark' : 'Light'}
      </Button>
    </div>
  )
}

export default TopHeader
