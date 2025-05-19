import React from 'react'

import { APP_NAME } from '../utils/config'
import { EvmAddress, PostsList, Size, Theme } from '@lens-quick-widgets/ui'

const Home = () => {
  return (
    <div className="h-full centered-col overflow-auto">
      <div className="text-xl font-bold py-10">Your Project : {APP_NAME} </div>

      <div className="w-[500px] h-[500px] mb-20 mt-20 overflow-auto">
        <PostsList
          theme={Theme.light}
          apps={['0x5eD76435f79E025Ca5c534e17184FEC29b681DB5' as EvmAddress]}
        />
      </div>

      {/* <div className="w-[900px] h-[500px] mb-20 mt-20 overflow-auto">
        <AccountsList
          followingsOf="rathod"
          orderBy={AccountsOrderBy.AccountScore}
          accountSize={Size.compact}
          pageSize={PageSize.Fifty}
          theme={Theme.blonde}
        />
      </div> */}

      {/* <div className="w-[500px] mb-20 mt-4">
        <Post
          theme={Theme.dark}
          postId="2h62fqz2q8nrntq29zt"
          showUnfollowButton
        />
      </div> */}

      {/* <div>
        <Account size={Size.large} localName="rathod" />
      </div> */}
    </div>
  )
}

export default Home
