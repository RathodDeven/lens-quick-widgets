'use client'

import { useSearchParams } from 'next/navigation'
import { PostsList, PageSize, Theme } from '@lens-quick-widgets/ui'

export default function PostsListEmbed() {
  const searchParams = useSearchParams()

  // Extract parameters from URL with null check
  const theme = (searchParams?.get('theme') as Theme) || Theme.default
  const pageSize =
    searchParams?.get('pageSize') === 'fifty' ? PageSize.Fifty : PageSize.Ten
  const searchQuery = searchParams?.get('searchQuery') || undefined
  const postsOf = searchParams?.get('postsOf') || undefined
  const widthOfPostCard = searchParams?.get('width') || '100%'
  const hideInteractions = searchParams?.get('hideInteractions') === 'true'
  const showStats = searchParams?.get('showStats') !== 'false'
  const showFollow = searchParams?.get('showFollow') !== 'false'
  const showUnfollowButton = searchParams?.get('showUnfollowButton') === 'true'
  const contentPreviewLimit = searchParams?.get('previewLimit')
    ? parseInt(searchParams.get('previewLimit') as string, 10)
    : 400

  // Handle callbacks
  const handlePostClick = (post: any) => {
    console.log('Post clicked:', post.id)
  }

  const handleLike = (post: any) => {
    console.log('Post liked:', post.id)
  }

  const handleRepost = (post: any) => {
    console.log('Post reposted:', post.id)
  }

  // Default visible stats and buttons
  const visibleStats = ['upvotes', 'comments', 'reposts']
  const visibleButtons = ['like', 'repost', 'comment']

  return (
    <PostsList
      theme={theme}
      pageSize={pageSize}
      searchQuery={searchQuery}
      postsOf={postsOf}
      widthOfPostCard={widthOfPostCard}
      hideInteractions={hideInteractions}
      showStats={showStats}
      showFollow={showFollow}
      showUnfollowButton={showUnfollowButton}
      contentPreviewLimit={contentPreviewLimit}
      visibleStats={visibleStats as any}
      visibleButtons={visibleButtons as any}
      onPostClick={handlePostClick}
      onLike={handleLike}
      onRepost={handleRepost}
    />
  )
}
