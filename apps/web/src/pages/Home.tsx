import React, { useState } from 'react'
import CelebrationIcon from '@mui/icons-material/Celebration'
import { Button as MuiButton } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { APP_NAME } from '../utils/config'
import { DivComponent, Button, Card } from '@lens-quick-widgets/ui'
import { Account } from '@lens-quick-widgets/ui'
import { Size, Theme } from '@lens-quick-widgets/ui/dist/types'
const Home = () => {
  const [clickCount, setClickCount] = useState(0)

  return (
    <div className="h-full centered-col">
      <div className="text-xl font-bold py-10">Your Project : {APP_NAME} </div>
      <div className="text-xl mb-6">
        Start editing by modifying{' '}
        <code className="text-red-400">components/wrappers/UILayout.tsx</code> &{' '}
        <code className="text-red-400">app/page.tsx</code>
      </div>

      <div className="text-xl font-bold mb-4">UI Package Components:</div>

      <div className="flex gap-4 flex-wrap items-start">
        <Account size={Size.large} localName={'rathod'} />
        <Account size={Size.medium} localName={'rathod'} />
        <Account size={Size.small} localName={'rathod'} />
        <Account size={Size.compact} localName={'rathod'} />
      </div>

      {/* Interactive UI Component Example */}
      <DivComponent
        style={{
          marginBottom: '20px',
          padding: '20px',
          width: '100%',
          maxWidth: '600px'
        }}
        backgroundColor={clickCount % 2 === 0 ? '#e9f7fe' : '#fcf0ef'}
        rounded
        shadow
        onClick={() => setClickCount((prev) => prev + 1)}
      >
        I'm an interactive component from the UI package! Click me! (Clicked{' '}
        {clickCount} times)
      </DivComponent>

      <div className="text-xl font-bold py-6 between-row gap-x-2">
        MUI Examples:
      </div>

      <div className="text-xl between-row gap-x-2 mb-4">
        Mui Icon:{' '}
        <div className="text-blue-400">
          <CelebrationIcon />
        </div>
      </div>

      <div className="text-xl between-row gap-x-2">
        Mui Button:{' '}
        <MuiButton variant="contained" endIcon={<SendIcon />}>
          Send
        </MuiButton>
      </div>
    </div>
  )
}

export default Home
