'use client'
import {
  LensPostType,
  MainContentFocus,
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
      <SignInWithLens
        theme={Theme.green}
        onConnectWallet={(address) => console.log('Wallet connected:', address)}
        onLogin={(account) => console.log('Logged in:', account)}
        onLogout={() => console.log('Logged out')}
      />
      {/* <div className="w-[500px] h-[800px] overflow-auto">
        <iframe
          src="https://lens-quick-widgets-web.vercel.app/embed/posts-list?theme=default&pageSize=TEN&postsOf=stani&mainContentFocus=IMAGE&visibleStats=upvotes%2Ccomments%2Creposts"
          width="100%"
          height="800px"
          style={{
            border: 'none'
          }}
        ></iframe>
      </div> */}
    </div>
  )
}

export default page
