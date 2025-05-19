'use client'
import './globals.css'
import Wrappers from '../src/components/wrappers/Wrappers'

declare global {
  interface Navigator {
    standalone?: boolean
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ overflowY: 'auto', minHeight: '100vh' }}>
        <Wrappers>{children}</Wrappers>
      </body>
    </html>
  )
}
