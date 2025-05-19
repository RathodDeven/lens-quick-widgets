'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Post, Theme } from 'lens-quick-widgets'

// Client component that uses useSearchParams hook
function PostClient() {
  const searchParams = useSearchParams()

  // Extract parameters from URL with null check
  const postId = searchParams?.get('postId') || '0x01d7-0x0f'
  const theme = (searchParams?.get('theme') as Theme) || Theme.default
  const hideInteractions = searchParams?.get('hideInteractions') === 'true'
  const showStats = searchParams?.get('showStats') !== 'false'
  const showFollow = searchParams?.get('showFollow') !== 'false'
  const showUnfollowButton = searchParams?.get('showUnfollowButton') === 'true'
  const contentPreviewLimit = searchParams?.get('previewLimit')
    ? parseInt(searchParams.get('previewLimit') as string, 10)
    : 400

  // Parse visible stats and buttons from URL
  const visibleStats = searchParams?.get('visibleStats')
    ? searchParams.get('visibleStats')?.split(',') || [
        'upvotes',
        'comments',
        'reposts'
      ]
    : ['upvotes', 'comments', 'reposts']

  const visibleButtons = searchParams?.get('visibleButtons')
    ? searchParams.get('visibleButtons')?.split(',') || [
        'like',
        'repost',
        'comment'
      ]
    : ['like', 'repost', 'comment']

  // Handle callbacks
  const handleLike = (post: any) => {
    console.log('Post liked:', post.id)
  }

  const handleRepost = (post: any) => {
    console.log('Post reposted:', post.id)
  }

  const handleComment = (post: any) => {
    console.log('Comment on post:', post.id)
  }

  const handlePostClick = (post: any) => {
    console.log('Post clicked:', post.id)
  }

  return (
    <Post
      postId={postId}
      theme={theme}
      hideInteractions={hideInteractions}
      showStats={showStats}
      showFollow={showFollow}
      showUnfollowButton={showUnfollowButton}
      contentPreviewLimit={contentPreviewLimit}
      visibleStats={visibleStats as any}
      visibleButtons={visibleButtons as any}
      onLike={handleLike}
      onRepost={handleRepost}
      onComment={handleComment}
      onClick={handlePostClick}
    />
  )
}

// Page component with Suspense boundary
export default function PostEmbed() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostClient />
    </Suspense>
  )
}
