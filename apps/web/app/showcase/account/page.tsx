'use client'

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
  FormControlLabel
} from '@mui/material'
import { Account, Theme, Size } from 'lens-quick-widgets'
import { APP_LINK } from '@/src/utils/config'

export default function AccountShowcase() {
  // State for component props
  const [theme, setTheme] = useState<Theme>(Theme.light)
  const [size, setSize] = useState<Size>(Size.medium)
  const [localName, setLocalName] = useState<string>('stani')
  const [accountAddress, setAccountAddress] = useState<string>('')
  const [hideFollowButton, setHideFollowButton] = useState<boolean>(false)
  const [showUnfollowButton, setShowUnfollowButton] = useState<boolean>(false)
  const [fontSize, setFontSize] = useState<string>('')
  const [loadedAccount, setLoadedAccount] = useState<any>(null)

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
  const handleAccountLoad = (account: any) => {
    setLoadedAccount(account)
    console.log('Account loaded:', account)
  }

  const handleAccountClick = (account: any, stats: any) => {
    console.log(
      'Account clicked:',
      account.username?.localName,
      'Stats:',
      stats
    )
  }

  const handleFollowed = () => {
    console.log('Account followed/unfollowed')
  }

  // Function to generate iframe code
  const generateIframeCode = () => {
    let params = new URLSearchParams()

    params.append('localName', localName)
    if (accountAddress) params.append('accountAddress', accountAddress)
    if (theme) params.append('theme', theme)
    if (size) params.append('size', size)
    if (hideFollowButton) params.append('hideFollowButton', 'true')
    if (showUnfollowButton) params.append('showUnfollowButton', 'true')
    if (fontSize) params.append('fontSize', fontSize)

    // Safely access window.location.origin for browser environments only
    const baseUrl =
      typeof window !== 'undefined' ? window.location.origin : APP_LINK

    return `<iframe 
  src="${baseUrl}/embed/account?${params.toString()}" 
  width="100%" 
  height="${size === Size.large ? '400px' : size === Size.medium ? '300px' : '200px'}" 
  style={{border: 'none'}}>
</iframe>`
  }

  // JSX code for the component
  const componentCode = `import { Account, Theme, Size } from "lens-quick-widgets"

<Account 
  localName="${localName}"
  ${accountAddress ? `accountAddress="${accountAddress}"` : ''}
  theme={Theme.${Theme[theme]}}
  size={Size.${Size[size]}}
  ${hideFollowButton ? 'hideFollowButton={true}' : ''}
  ${showUnfollowButton ? 'showUnfollowButton={true}' : ''}
  ${fontSize ? `fontSize="${fontSize}"` : ''}
  onAccountLoad={(account) => console.log("Account loaded:", account)}
  onClick={(account, stats) => console.log("Account clicked:", account, stats)}
  onFollowed={() => console.log("Account followed/unfollowed")}
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
            Account
          </Typography>
          <Typography variant="body1" className="mb-8">
            Display a Lens Protocol user profile with customizable styling, size
            options, and interactive features like following/unfollowing.
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {/* Configurator */}
          <Grid item xs={12} md={5}>
            <motion.div variants={itemVariants}>
              <Paper className="p-6">
                <Typography variant="h6" component="h2" className="mb-4">
                  Configurator
                </Typography>

                <TextField
                  fullWidth
                  margin="normal"
                  label="Lens Handle"
                  value={localName}
                  onChange={(e) => setLocalName(e.target.value)}
                  helperText="Enter a Lens handle (without @)"
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Account Address"
                  value={accountAddress}
                  onChange={(e) => setAccountAddress(e.target.value)}
                  helperText="Enter an Ethereum address (overrides Lens handle if both provided)"
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

                <FormControl fullWidth margin="normal">
                  <InputLabel>Size</InputLabel>
                  <Select
                    value={size}
                    label="Size"
                    onChange={(e) => setSize(e.target.value as Size)}
                  >
                    <MenuItem value={Size.compact}>Compact</MenuItem>
                    <MenuItem value={Size.small}>Small</MenuItem>
                    <MenuItem value={Size.medium}>Medium</MenuItem>
                    <MenuItem value={Size.large}>Large</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  margin="normal"
                  label="Font Size"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  helperText="Custom font size (12px, 1rem, etc.)"
                />

                <Box mt={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={hideFollowButton}
                        onChange={(e) => setHideFollowButton(e.target.checked)}
                      />
                    }
                    label="Hide Follow Button"
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

                {/* Account data display */}
                {loadedAccount && (
                  <Box mt={3} p={2} bgcolor="action.hover" borderRadius={1}>
                    <Typography variant="subtitle2">Loaded Account:</Typography>
                    <Typography variant="body2" fontFamily="monospace">
                      @{loadedAccount.username?.localName || 'unnamed'}
                    </Typography>
                    <Typography variant="body2" fontFamily="monospace">
                      {loadedAccount.metadata?.name || 'No name'}
                    </Typography>
                  </Box>
                )}

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
                <Box className="flex justify-center">
                  <Account
                    localName={localName}
                    accountAddress={accountAddress || undefined}
                    theme={theme}
                    size={size}
                    hideFollowButton={hideFollowButton}
                    showUnfollowButton={showUnfollowButton}
                    fontSize={fontSize || undefined}
                    onAccountLoad={handleAccountLoad}
                    onClick={handleAccountClick}
                    onFollowed={handleFollowed}
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
