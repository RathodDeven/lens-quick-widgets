import React from 'react'

import { APP_NAME } from '../utils/config'
import { Account } from '@lens-quick-widgets/ui'
import { Size, Theme } from '@lens-quick-widgets/ui/dist/types'
const Home = () => {
  return (
    <div className="h-full centered-col">
      <div className="text-xl font-bold py-10">Your Project : {APP_NAME} </div>

      <div className="flex gap-4 flex-wrap items-start">
        <Account
          size={Size.large}
          theme={Theme.peach}
          localName={'diversehq'}
        />
        <Account size={Size.medium} localName={'rathod'} />
        <Account size={Size.small} localName={'rathod'} />
        <Account size={Size.compact} localName={'rathod'} />
      </div>
    </div>
  )
}

export default Home
