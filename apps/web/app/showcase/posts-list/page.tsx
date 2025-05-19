'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Button,
  Switch,
  FormControlLabel,
  Stack,
  Divider
} from '@mui/material'
import {
  ContentWarning,
  EvmAddress,
  LensPostType,
  MainContentFocus,
  PageSize,
  PostId,
  PostsList,
  Theme
} from 'lens-quick-widgets'
import { APP_LINK } from '@/src/utils/config'

export default function PostsListShowcase() {
  // State for component props
  const [theme, setTheme] = useState<Theme>(Theme.default)
  const [pageSize, setPageSize] = useState<PageSize>(PageSize.Ten)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [postsOf, setPostsOf] = useState<string>('')
  const [widthOfPostCard, setWidthOfPostCard] = useState<string>('100%')
  const [hideInteractions, setHideInteractions] = useState<boolean>(false)
  const [showStats, setShowStats] = useState<boolean>(true)
  const [showFollow, setShowFollow] = useState<boolean>(true)
  const [showUnfollowButton, setShowUnfollowButton] = useState<boolean>(false)
  const [contentPreviewLimit, setContentPreviewLimit] = useState<number>(400)
  const [visibleStats, setVisibleStats] = useState<string[]>([
    'upvotes',
    'comments',
    'reposts'
  ])
  const [visibleButtons, setVisibleButtons] = useState<string[]>([
    'like',
    'repost',
    'comment'
  ])

  // New state variables for additional parameters
  const [minAccountScore, setMinAccountScore] = useState<number>(0)
  const [maxAccountScore, setMaxAccountScore] = useState<number>(0)
  const [useAccountScore, setUseAccountScore] = useState<string>('none')
  const [apps, setApps] = useState<string>('')
  const [authors, setAuthors] = useState<string>('')
  const [contentWarnings, setContentWarnings] = useState<ContentWarning[]>([])
  const [tags, setTags] = useState<string>('')
  const [mainContentFocus, setMainContentFocus] = useState<MainContentFocus[]>(
    []
  )
  const [postIds, setPostIds] = useState<string>('')
  const [postTypes, setPostTypes] = useState<LensPostType[]>([])

  // Style customization
  const [containerStyleJSON, setContainerStyleJSON] = useState<string>('{}')
  const [postStyleJSON, setPostStyleJSON] = useState<string>('{}')
  const [postContainerStyleJSON, setPostContainerStyleJSON] =
    useState<string>('{}')

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  }

  // Event handlers
  const handlePostClick = (post: any) => {
    console.log('Post clicked:', post.id)
  }

  const handleLike = (post: any) => {
    console.log('Post liked:', post.id)
  }

  const handleRepost = (post: any) => {
    console.log('Post reposted:', post.id)
  }

  // Options for multi selects
  const availableStats = [
    { value: 'upvotes', label: 'Upvotes' },
    { value: 'comments', label: 'Comments' },
    { value: 'reposts', label: 'Reposts' },
    { value: 'quotes', label: 'Quotes' },
    { value: 'bookmarks', label: 'Bookmarks' },
    { value: 'collects', label: 'Collects' },
    { value: 'tips', label: 'Tips' }
  ]

  const availableButtons = [
    { value: 'like', label: 'Like' },
    { value: 'repost', label: 'Repost' },
    { value: 'comment', label: 'Comment' }
  ]

  const availableContentWarnings = [
    { value: ContentWarning.Nsfw, label: 'NSFW' },
    { value: ContentWarning.Sensitive, label: 'Sensitive' },
    { value: ContentWarning.Spoiler, label: 'Spoiler' }
  ]

  const availableContentFocus = [
    { value: MainContentFocus.Image, label: 'Image' },
    { value: MainContentFocus.Video, label: 'Video' },
    { value: MainContentFocus.Article, label: 'Article' },
    { value: MainContentFocus.TextOnly, label: 'Text Only' },
    { value: MainContentFocus.Audio, label: 'Audio' },
    { value: MainContentFocus.Livestream, label: 'Livestream' }
  ]

  const availablePostTypes = [
    { value: LensPostType.Root, label: 'Post' },
    { value: LensPostType.Comment, label: 'Comment' },
    { value: LensPostType.Repost, label: 'Repost' },
    { value: LensPostType.Quote, label: 'Quote' }
  ]

  // Function to generate iframe code
  const generateIframeCode = () => {
    let params = new URLSearchParams()

    if (theme) params.append('theme', theme)
    if (pageSize) params.append('pageSize', pageSize.toString())
    if (searchQuery) params.append('searchQuery', searchQuery)
    if (postsOf) params.append('postsOf', postsOf)
    if (widthOfPostCard !== '100%') params.append('width', widthOfPostCard)
    if (hideInteractions) params.append('hideInteractions', 'true')
    if (!showStats) params.append('showStats', 'false')
    if (!showFollow) params.append('showFollow', 'false')
    if (showUnfollowButton) params.append('showUnfollowButton', 'true')
    if (contentPreviewLimit !== 400)
      params.append('previewLimit', contentPreviewLimit.toString())

    // Add new parameters
    if (useAccountScore === 'min' && minAccountScore > 0)
      params.append('minAccountScore', minAccountScore.toString())
    if (useAccountScore === 'max' && maxAccountScore > 0)
      params.append('maxAccountScore', maxAccountScore.toString())
    if (apps) params.append('apps', apps)
    if (authors) params.append('authors', authors)
    if (contentWarnings.length > 0)
      params.append('contentWarnings', contentWarnings.join(','))
    if (tags) params.append('tags', tags)
    if (mainContentFocus.length > 0)
      params.append('mainContentFocus', mainContentFocus.join(','))
    if (postIds) params.append('postIds', postIds)
    if (postTypes.length > 0) params.append('postTypes', postTypes.join(','))

    // Add style parameters if they differ from defaults
    if (containerStyleJSON !== '{}')
      params.append('containerStyle', encodeURIComponent(containerStyleJSON))
    if (postStyleJSON !== '{}')
      params.append('postStyle', encodeURIComponent(postStyleJSON))
    if (postContainerStyleJSON !== '{}')
      params.append(
        'postContainerStyle',
        encodeURIComponent(postContainerStyleJSON)
      )

    // Add visible stats and buttons
    if (visibleStats.length > 0 && visibleStats.length < availableStats.length)
      params.append('visibleStats', visibleStats.join(','))
    if (
      visibleButtons.length > 0 &&
      visibleButtons.length < availableButtons.length
    )
      params.append('visibleButtons', visibleButtons.join(','))

    // Safely access window.location.origin for browser environments only
    const baseUrl =
      typeof window !== 'undefined' ? window.location.origin : APP_LINK

    return `<iframe 
  src="${baseUrl}/embed/posts-list?${params.toString()}" 
  width="100%" 
  height="800px" 
  frameborder="0">
</iframe>`
  }

  // Prepare account score for component
  const getAccountScore = () => {
    if (useAccountScore === 'min' && minAccountScore > 0) {
      return { atLeast: minAccountScore }
    } else if (useAccountScore === 'max' && maxAccountScore > 0) {
      return { lessThan: maxAccountScore }
    }
    return undefined
  }

  // Prepare metadata for component
  const getMetadata = () => {
    const metadata: any = {}

    if (contentWarnings.length > 0) {
      metadata.contentWarning = { oneOf: contentWarnings }
    }

    if (tags) {
      metadata.tags = { oneOf: tags.split(',').map((tag) => tag.trim()) }
    }

    if (mainContentFocus.length > 0) {
      metadata.mainContentFocus = mainContentFocus
    }

    return Object.keys(metadata).length > 0 ? metadata : undefined
  }

  // Parse comma-separated addresses
  const parseAddresses = (input: string) => {
    if (!input) return undefined
    return input
      .split(',')
      .map((addr) => addr.trim())
      .filter((addr) => addr)
  }

  // Parse post IDs
  const parsePostIds = (input: string) => {
    if (!input) return undefined
    return input
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id)
  }

  // Parse JSON style objects
  const parseStyle = (input: string) => {
    try {
      return JSON.parse(input)
    } catch (e) {
      return {}
    }
  }

  // JSX code for the component
  const componentCode = `import { PostsList, PageSize, Theme, LensPostType, ContentWarning, MainContentFocus } from "lens-quick-widgets"

<PostsList 
  theme={Theme.${Object.keys(Theme).find((k) => Theme[k as keyof typeof Theme] === theme)}}
  pageSize={PageSize.${Object.keys(PageSize).find((k) => PageSize[k as keyof typeof PageSize] === pageSize)}}
  ${searchQuery ? `searchQuery="${searchQuery}"` : ''}
  ${postsOf ? `postsOf="${postsOf}"` : ''}
  widthOfPostCard="${widthOfPostCard}"
  ${hideInteractions ? 'hideInteractions={true}' : ''}
  showStats={${showStats}}
  showFollow={${showFollow}}
  showUnfollowButton={${showUnfollowButton}}
  contentPreviewLimit={${contentPreviewLimit}}
  visibleStats={[${visibleStats.map((s) => `"${s}"`).join(', ')}]}
  visibleButtons={[${visibleButtons.map((b) => `"${b}"`).join(', ')}]}
  ${useAccountScore !== 'none' ? `accountScore={{ ${useAccountScore === 'min' ? `atLeast: ${minAccountScore}` : `lessThan: ${maxAccountScore}`} }}` : ''}
  ${
    apps
      ? `apps={[${parseAddresses(apps)
          ?.map((app) => `"${app}"`)
          .join(', ')}]}`
      : ''
  }
  ${
    authors
      ? `authors={[${parseAddresses(authors)
          ?.map((author) => `"${author}"`)
          .join(', ')}]}`
      : ''
  }
  ${
    getMetadata()
      ? `metadata={{
    ${contentWarnings.length > 0 ? `contentWarning: { oneOf: [${contentWarnings.map((warning) => `ContentWarning.${Object.keys(ContentWarning).find((k) => ContentWarning[k as keyof typeof ContentWarning] === warning)}`).join(', ')}] },` : ''}
    ${
      tags
        ? `tags: { oneOf: [${tags
            .split(',')
            .map((tag) => `"${tag.trim()}"`)
            .join(', ')}] },`
        : ''
    }
    ${mainContentFocus.length > 0 ? `mainContentFocus: [${mainContentFocus.map((focus) => `MainContentFocus.${Object.keys(MainContentFocus).find((k) => MainContentFocus[k as keyof typeof MainContentFocus] === focus)}`).join(', ')}]` : ''}
  }}`
      : ''
  }
  ${
    postIds
      ? `posts={[${parsePostIds(postIds)
          ?.map((id) => `"${id}"`)
          .join(', ')}]}`
      : ''
  }
  ${postTypes.length > 0 ? `postTypes={[${postTypes.map((type) => `LensPostType.${Object.keys(LensPostType).find((k) => LensPostType[k as keyof typeof LensPostType] === type)}`).join(', ')}]}` : ''}
  ${containerStyleJSON !== '{}' ? `containerStyle={${containerStyleJSON}}` : ''}
  ${postStyleJSON !== '{}' ? `postStyle={${postStyleJSON}}` : ''}
  ${postContainerStyleJSON !== '{}' ? `postContainerStyle={${postContainerStyleJSON}}` : ''}
  onPostClick={(post) => console.log("Post clicked:", post.id)}
  onLike={(post) => console.log("Post liked:", post.id)}
  onRepost={(post) => console.log("Post reposted:", post.id)}
/>`

  return (
    <Container maxWidth="lg" className="py-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <motion.div variants={itemVariants}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight="bold"
            className="mb-4"
          >
            Posts List
          </Typography>
          <Typography variant="body1" className="mb-8">
            Display a customizable feed of Lens Protocol posts with infinite
            scrolling, filtering options, and interactive features like liking
            and reposting.
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {/* Configurator */}
          <Grid item xs={12} md={5}>
            <motion.div variants={itemVariants}>
              <Paper className="p-6 overflow-y-auto max-h-[800px]">
                <Typography variant="h6" component="h2" className="mb-4">
                  Configurator
                </Typography>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Theme</InputLabel>
                  <Select
                    value={theme}
                    label="Theme"
                    onChange={(e) => setTheme(e.target.value as Theme)}
                  >
                    <MenuItem value={Theme.default}>Default</MenuItem>
                    <MenuItem value={Theme.light}>Light</MenuItem>
                    <MenuItem value={Theme.dark}>Dark</MenuItem>
                    <MenuItem value={Theme.green}>Green</MenuItem>
                    <MenuItem value={Theme.blonde}>Blonde</MenuItem>
                    <MenuItem value={Theme.lavender}>Lavender</MenuItem>
                    <MenuItem value={Theme.mint}>Mint</MenuItem>
                    <MenuItem value={Theme.peach}>Peach</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Page Size</InputLabel>
                  <Select
                    value={pageSize}
                    label="Page Size"
                    onChange={(e) => setPageSize(e.target.value as PageSize)}
                  >
                    <MenuItem value={PageSize.Ten}>Ten</MenuItem>
                    <MenuItem value={PageSize.Fifty}>Fifty</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  margin="normal"
                  label="Search Query"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  helperText="Search for posts with specific content"
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Posts Of (username)"
                  value={postsOf}
                  onChange={(e) => setPostsOf(e.target.value)}
                  helperText="Show posts from a specific Lens user"
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Post Card Width"
                  value={widthOfPostCard}
                  onChange={(e) => setWidthOfPostCard(e.target.value)}
                  helperText="Width of each post card (px, %, etc)"
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Content Preview Limit"
                  type="number"
                  value={contentPreviewLimit}
                  onChange={(e) =>
                    setContentPreviewLimit(Number(e.target.value))
                  }
                  helperText="Characters to show before 'show more' button"
                />

                <Box mt={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={hideInteractions}
                        onChange={(e) => setHideInteractions(e.target.checked)}
                      />
                    }
                    label="Hide Interactions"
                  />
                </Box>

                <Box mt={1}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showStats}
                        onChange={(e) => setShowStats(e.target.checked)}
                      />
                    }
                    label="Show Stats"
                  />
                </Box>

                <Box mt={1}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showFollow}
                        onChange={(e) => setShowFollow(e.target.checked)}
                      />
                    }
                    label="Show Follow Button"
                  />
                </Box>

                <Box mt={1}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showUnfollowButton}
                        onChange={(e) =>
                          setShowUnfollowButton(e.target.checked)
                        }
                      />
                    }
                    label="Show Unfollow Button"
                  />
                </Box>

                <Box mt={3}>
                  <InputLabel sx={{ mb: 1 }}>Visible Stats</InputLabel>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {availableStats.map((stat) => (
                      <Chip
                        key={stat.value}
                        label={stat.label}
                        onClick={() => {
                          if (visibleStats.includes(stat.value)) {
                            setVisibleStats(
                              visibleStats.filter((s) => s !== stat.value)
                            )
                          } else {
                            setVisibleStats([...visibleStats, stat.value])
                          }
                        }}
                        color={
                          visibleStats.includes(stat.value)
                            ? 'primary'
                            : 'default'
                        }
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Stack>
                </Box>

                <Box mt={3}>
                  <InputLabel sx={{ mb: 1 }}>Visible Buttons</InputLabel>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {availableButtons.map((button) => (
                      <Chip
                        key={button.value}
                        label={button.label}
                        onClick={() => {
                          if (visibleButtons.includes(button.value)) {
                            setVisibleButtons(
                              visibleButtons.filter((b) => b !== button.value)
                            )
                          } else {
                            setVisibleButtons([...visibleButtons, button.value])
                          }
                        }}
                        color={
                          visibleButtons.includes(button.value)
                            ? 'primary'
                            : 'default'
                        }
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Stack>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Advanced Filtering Options */}
                <Typography variant="h6" component="h3" className="mb-3">
                  Advanced Filtering
                </Typography>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Account Score filter</InputLabel>
                  <Select
                    value={useAccountScore}
                    label="Account score filter"
                    onChange={(e) => setUseAccountScore(e.target.value)}
                  >
                    <MenuItem value="none">{"Don't filter by score"}</MenuItem>
                    <MenuItem value="min">Minimum score</MenuItem>
                    <MenuItem value="max">Maximum score</MenuItem>
                  </Select>
                </FormControl>

                {useAccountScore === 'min' && (
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Minimum Account Score"
                    type="number"
                    value={minAccountScore}
                    onChange={(e) => setMinAccountScore(Number(e.target.value))}
                  />
                )}

                {useAccountScore === 'max' && (
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Maximum Account Score"
                    type="number"
                    value={maxAccountScore}
                    onChange={(e) => setMaxAccountScore(Number(e.target.value))}
                  />
                )}

                <TextField
                  fullWidth
                  margin="normal"
                  label="Apps (comma-separated EVM addresses)"
                  value={apps}
                  onChange={(e) => setApps(e.target.value)}
                  helperText="Filter by posts created with specific apps"
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Authors (comma-separated EVM addresses)"
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                  helperText="Filter by specific author addresses"
                />

                <Box mt={3}>
                  <InputLabel sx={{ mb: 1 }}>Content Warnings</InputLabel>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {availableContentWarnings.map((warning) => (
                      <Chip
                        key={warning.value}
                        label={warning.label}
                        onClick={() => {
                          if (contentWarnings.includes(warning.value)) {
                            setContentWarnings(
                              contentWarnings.filter((w) => w !== warning.value)
                            )
                          } else {
                            setContentWarnings([
                              ...contentWarnings,
                              warning.value
                            ])
                          }
                        }}
                        color={
                          contentWarnings.includes(warning.value)
                            ? 'primary'
                            : 'default'
                        }
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Stack>
                </Box>

                <TextField
                  fullWidth
                  margin="normal"
                  label="Tags (comma-separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  helperText="Filter by post tags"
                />

                <Box mt={3}>
                  <InputLabel sx={{ mb: 1 }}>Main Content Focus</InputLabel>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {availableContentFocus.map((focus) => (
                      <Chip
                        key={focus.value}
                        label={focus.label}
                        onClick={() => {
                          if (mainContentFocus.includes(focus.value)) {
                            setMainContentFocus(
                              mainContentFocus.filter((f) => f !== focus.value)
                            )
                          } else {
                            setMainContentFocus((prev) => [
                              ...prev,
                              focus.value
                            ])
                          }
                        }}
                        color={
                          mainContentFocus.includes(focus.value)
                            ? 'primary'
                            : 'default'
                        }
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Stack>
                </Box>

                <TextField
                  fullWidth
                  margin="normal"
                  label="Post IDs (comma-separated)"
                  value={postIds}
                  onChange={(e) => setPostIds(e.target.value)}
                  helperText="Filter by specific post IDs"
                />

                <Box mt={3}>
                  <InputLabel sx={{ mb: 1 }}>Post Types</InputLabel>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {availablePostTypes.map((type) => (
                      <Chip
                        key={type.value}
                        label={type.label}
                        onClick={() => {
                          if (postTypes.includes(type.value)) {
                            setPostTypes(
                              postTypes.filter((t) => t !== type.value)
                            )
                          } else {
                            setPostTypes([...postTypes, type.value])
                          }
                        }}
                        color={
                          postTypes.includes(type.value) ? 'primary' : 'default'
                        }
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Stack>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Style Customization */}
                <Typography variant="h6" component="h3" className="mb-3">
                  Style Customization
                </Typography>

                <TextField
                  fullWidth
                  margin="normal"
                  label="Container Style (JSON)"
                  multiline
                  rows={2}
                  value={containerStyleJSON}
                  onChange={(e) => setContainerStyleJSON(e.target.value)}
                  helperText="CSS styles for main container in JSON format"
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Post Style (JSON)"
                  multiline
                  rows={2}
                  value={postStyleJSON}
                  onChange={(e) => setPostStyleJSON(e.target.value)}
                  helperText="CSS styles for posts in JSON format"
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Post Container Style (JSON)"
                  multiline
                  rows={2}
                  value={postContainerStyleJSON}
                  onChange={(e) => setPostContainerStyleJSON(e.target.value)}
                  helperText="CSS styles for post containers in JSON format"
                />

                {/* Code display */}
                <Typography variant="subtitle1" className="mt-6 mb-2">
                  Component Code:
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    bgcolor: 'background.paper',
                    p: 2,
                    borderRadius: 1,
                    overflowX: 'auto',
                    fontSize: '0.875rem'
                  }}
                >
                  <code>{componentCode}</code>
                </Box>

                {/* IFrame code */}
                <Typography variant="subtitle1" className="mt-6 mb-2">
                  Embed Code:
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    bgcolor: 'background.paper',
                    p: 2,
                    borderRadius: 1,
                    overflowX: 'auto',
                    fontSize: '0.875rem'
                  }}
                >
                  <code>{generateIframeCode()}</code>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Preview */}
          <Grid item xs={12} md={7}>
            <motion.div variants={itemVariants}>
              <Paper className="p-6 max-h-[800px] overflow-y-auto">
                <Typography variant="h6" component="h2" className="mb-6">
                  Preview
                </Typography>
                <Box>
                  <PostsList
                    theme={theme}
                    pageSize={pageSize}
                    searchQuery={searchQuery || undefined}
                    postsOf={postsOf || undefined}
                    widthOfPostCard={widthOfPostCard}
                    hideInteractions={hideInteractions}
                    showStats={showStats}
                    showFollow={showFollow}
                    showUnfollowButton={showUnfollowButton}
                    contentPreviewLimit={contentPreviewLimit}
                    visibleStats={visibleStats as any}
                    visibleButtons={visibleButtons as any}
                    accountScore={getAccountScore()}
                    apps={
                      parseAddresses(apps) as EvmAddress[] | null | undefined
                    }
                    authors={
                      parseAddresses(authors) as EvmAddress[] | null | undefined
                    }
                    metadata={getMetadata()}
                    posts={parsePostIds(postIds) as PostId[] | null | undefined}
                    postTypes={postTypes.length > 0 ? postTypes : undefined}
                    containerStyle={parseStyle(containerStyleJSON)}
                    postStyle={parseStyle(postStyleJSON)}
                    postContainerStyle={parseStyle(postContainerStyleJSON)}
                    onPostClick={handlePostClick}
                    onLike={handleLike}
                    onRepost={handleRepost}
                  />
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  )
}
