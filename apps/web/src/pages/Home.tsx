import React from 'react'

import { APP_NAME } from '../utils/config'
import { Account, Post } from '@lens-quick-widgets/ui'
import { Size, Theme } from '@lens-quick-widgets/ui/dist/types'
const Home = () => {
  return (
    <div className="h-full centered-col overflow-auto">
      <div className="text-xl font-bold py-10">Your Project : {APP_NAME} </div>

      {/* <div className="w-[500px] mb-20 mt-4">
        <Post
          theme={Theme.dark}
          postId="2h62fqz2q8nrntq29zt"
          showUnfollowButton
        />
      </div> */}

      <div>
        <Account size={Size.large} localName="rathod" />
      </div>
    </div>
  )
}

export default Home
