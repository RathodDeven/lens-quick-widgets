'use client'
import React from 'react'
import { useState, useEffect } from 'react'
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
  Switch,
  FormControlLabel,
  Chip,
  Stack
} from '@mui/material'
import { Post, Theme } from 'lens-quick-widgets'
import { APP_LINK, EXAMPLE_POST_ID } from '@/src/utils/config'

const page = () => {
  // State for component props
  const [theme, setTheme] = useState<Theme>(Theme.default)
  const [postId, setPostId] = useState<string>(EXAMPLE_POST_ID)
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

  const handleComment = (post: any) => {
    console.log('Comment on post:', post.id)
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

  // Function to generate iframe code
  const generateIframeCode = () => {
    let params = new URLSearchParams()

    params.append('postId', postId)
    if (theme) params.append('theme', theme)
    if (hideInteractions) params.append('hideInteractions', 'true')
    if (!showStats) params.append('showStats', 'false')
    if (!showFollow) params.append('showFollow', 'false')
    if (showUnfollowButton) params.append('showUnfollowButton', 'true')
    if (contentPreviewLimit !== 400)
      params.append('previewLimit', contentPreviewLimit.toString())

    // Add visible stats and buttons parameters
    if (visibleStats.length > 0)
      params.append('visibleStats', visibleStats.join(','))

    if (visibleButtons.length > 0)
      params.append('visibleButtons', visibleButtons.join(','))

    // Safely access window.location.origin for browser environments only
    const baseUrl =
      typeof window !== 'undefined' ? window.location.origin : APP_LINK // Replace with your actual domain in production

    return `<iframe 
  src="${baseUrl}/embed/post?${params.toString()}" 
  width="100%" 
  height="auto" 
  frameborder="0">
</iframe>`
  }

  // JSX code for the component
  const componentCode = `import { Post } from "lens-quick-widgets"

<Post 
  postId="${postId}"
  theme="${theme}"
  ${hideInteractions ? 'hideInteractions={true}' : ''}
  showStats={${showStats}}
  showFollow={${showFollow}}
  showUnfollowButton={${showUnfollowButton}}
  contentPreviewLimit={${contentPreviewLimit}}
  visibleStats={[${visibleStats.map((s) => `"${s}"`).join(', ')}]}
  visibleButtons={[${visibleButtons.map((b) => `"${b}"`).join(', ')}]}
  onLike={(post) => console.log("Post liked:", post.id)}
  onRepost={(post) => console.log("Post reposted:", post.id)}
  onComment={(post) => console.log("Comment on post:", post.id)}
  onClick={(post) => console.log("Post clicked:", post.id)}
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
            Post
          </Typography>
          <Typography variant="body1" className="mb-8">
            Display a single Lens Protocol post with rich formatting, media
            support, and interactive features like liking, reposting, and
            commenting.
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

                <TextField
                  fullWidth
                  margin="normal"
                  label="Post ID"
                  value={postId}
                  onChange={(e) => setPostId(e.target.value)}
                  helperText={`Example: ${EXAMPLE_POST_ID}`}
                />

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
              <Paper className="p-6">
                <Typography variant="h6" component="h2" className="mb-6">
                  Preview
                </Typography>
                <Box>
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
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  )
}

export default page
