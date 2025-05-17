import React, { useState } from 'react'
import CelebrationIcon from '@mui/icons-material/Celebration'
import { Button as MuiButton } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { APP_NAME } from '../utils/config'
import { DivComponent, Button, Card } from '@lens-quick-widgets/ui'

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

      {/* Basic UI Component Example */}
      <DivComponent
        style={{ marginBottom: '20px', width: '100%', maxWidth: '600px' }}
        backgroundColor="#f8f9fa"
        rounded
        shadow
      >
        This DivComponent is from the UI package! Edit it in
        packages/ui/src/DivComponent.tsx
      </DivComponent>

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

      {/* Button Examples */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          width: '100%',
          maxWidth: '600px'
        }}
      >
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
      </div>

      {/* Card Example */}
      <Card
        title="Example Card"
        style={{ marginBottom: '20px', width: '100%', maxWidth: '600px' }}
        footer={
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px'
            }}
          >
            <Button variant="outline" size="small">
              Cancel
            </Button>
            <Button variant="primary" size="small">
              Submit
            </Button>
          </div>
        }
      >
        <p>
          This is a card component from our UI package. It can contain any
          content.
        </p>
        <p style={{ marginTop: '10px' }}>
          You can edit this component in{' '}
          <code
            style={{
              fontFamily: 'monospace',
              backgroundColor: '#f0f0f0',
              padding: '2px 4px',
              borderRadius: '4px'
            }}
          >
            packages/ui/src/Card.tsx
          </code>
        </p>
      </Card>

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
