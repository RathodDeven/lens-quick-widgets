'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { PostsList, PageSize, Theme } from 'lens-quick-widgets'

// Client component that uses useSearchParams hook
function PostsListClient() {
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
  const showHeyButton = searchParams?.get('showHeyButton') === 'true'
  const contentPreviewLimit = searchParams?.get('previewLimit')
    ? parseInt(searchParams.get('previewLimit') as string, 10)
    : 400

  // New parameters
  const minAccountScore = searchParams?.get('minAccountScore')
    ? parseInt(searchParams.get('minAccountScore') as string, 10)
    : undefined
  const maxAccountScore = searchParams?.get('maxAccountScore')
    ? parseInt(searchParams.get('maxAccountScore') as string, 10)
    : undefined
  const apps = searchParams?.get('apps')
    ? searchParams
        .get('apps')
        ?.split(',')
        .map((app) => app.trim())
    : undefined
  const authors = searchParams?.get('authors')
    ? searchParams
        .get('authors')
        ?.split(',')
        .map((author) => author.trim())
    : undefined
  const contentWarnings = searchParams?.get('contentWarnings')
    ? searchParams.get('contentWarnings')?.split(',')
    : undefined
  const tags = searchParams?.get('tags')
    ? searchParams
        .get('tags')
        ?.split(',')
        .map((tag) => tag.trim())
    : undefined
  const mainContentFocus = searchParams?.get('mainContentFocus')
    ? searchParams.get('mainContentFocus')?.split(',')
    : undefined
  const postIds = searchParams?.get('postIds')
    ? searchParams
        .get('postIds')
        ?.split(',')
        .map((id) => id.trim())
    : undefined
  const postTypes = searchParams?.get('postTypes')
    ? searchParams.get('postTypes')?.split(',')
    : undefined

  // Style parameters
  let containerStyle = undefined
  let postStyle = undefined
  let postContainerStyle = undefined

  try {
    if (searchParams?.get('containerStyle')) {
      containerStyle = JSON.parse(
        decodeURIComponent(searchParams.get('containerStyle') as string)
      )
    }
    if (searchParams?.get('postStyle')) {
      postStyle = JSON.parse(
        decodeURIComponent(searchParams.get('postStyle') as string)
      )
    }
    if (searchParams?.get('postContainerStyle')) {
      postContainerStyle = JSON.parse(
        decodeURIComponent(searchParams.get('postContainerStyle') as string)
      )
    }
  } catch (e) {
    console.error('Error parsing style JSON:', e)
  }

  // Parse visible stats and buttons
  const visibleStats = searchParams?.get('visibleStats')
    ? searchParams.get('visibleStats')?.split(',')
    : ['upvotes', 'comments', 'reposts']

  const visibleButtons = searchParams?.get('visibleButtons')
    ? searchParams.get('visibleButtons')?.split(',')
    : ['like', 'repost', 'comment']

  // Prepare account score parameter
  const getAccountScore = () => {
    if (minAccountScore !== undefined) {
      return { atLeast: minAccountScore }
    } else if (maxAccountScore !== undefined) {
      return { lessThan: maxAccountScore }
    }
    return undefined
  }

  // Prepare metadata parameter
  const getMetadata = () => {
    if (!contentWarnings && !tags && !mainContentFocus) return undefined

    const metadata: any = {}

    if (contentWarnings && contentWarnings.length > 0) {
      metadata.contentWarning = { oneOf: contentWarnings }
    }

    if (tags && tags.length > 0) {
      metadata.tags = { oneOf: tags }
    }

    if (mainContentFocus && mainContentFocus.length > 0) {
      metadata.mainContentFocus = mainContentFocus
    }

    return metadata
  }

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
      showHeyButton={showHeyButton}
      contentPreviewLimit={contentPreviewLimit}
      visibleStats={visibleStats as any}
      visibleButtons={visibleButtons as any}
      accountScore={getAccountScore()}
      apps={apps as any}
      authors={authors as any}
      metadata={getMetadata()}
      posts={postIds as any}
      postTypes={postTypes as any}
      containerStyle={containerStyle}
      postStyle={postStyle}
      postContainerStyle={postContainerStyle}
      onPostClick={handlePostClick}
      onLike={handleLike}
      onRepost={handleRepost}
    />
  )
}

// Page component with Suspense boundary
export default function PostsListEmbed() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostsListClient />
    </Suspense>
  )
}
