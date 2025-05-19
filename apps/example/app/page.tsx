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
        <PostsList
          theme={Theme.default}
          pageSize={PageSize.Ten}
          postsOf="stani"
          widthOfPostCard="100%"
          showStats={true}
          showFollow={true}
          showUnfollowButton={false}
          contentPreviewLimit={400}
          visibleStats={['upvotes', 'comments', 'reposts']}
          visibleButtons={['like', 'repost', 'comment']}
          postTypes={[LensPostType.Comment]}
          onPostClick={(post) => console.log('Post clicked:', post.id)}
          onLike={(post) => console.log('Post liked:', post.id)}
          onRepost={(post) => console.log('Post reposted:', post.id)}
        />
      </div>
    </div>
  )
}

export default page
