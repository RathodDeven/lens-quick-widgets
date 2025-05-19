'use client'
import {
  LensPostType,
  PageSize,
  PostsList,
  SignInWithLens,
  Theme
} from 'lens-quick-widgets'
import './globals.css'

import React from 'react'

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <div className="w-[500px] h-[800px] overflow-auto">
        <SignInWithLens
          theme={Theme.green}
          onConnectWallet={(address) =>
            console.log('Wallet connected:', address)
          }
          onLogin={(account) => console.log('Logged in:', account)}
          onLogout={() => console.log('Logged out')}
        />
      </div>
    </div>
  )
}

export default page
