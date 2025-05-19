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
  FormControlLabel,
  Chip,
  Button,
  Stack
} from '@mui/material'
import {
  AccountsList,
  PageSize,
  AccountsOrderBy,
  FollowersOrderBy,
  FollowingOrderBy,
  Theme,
  Size
} from '@lens-quick-widgets/ui'

export default function AccountsListShowcase() {
  // State for component props
  const [theme, setTheme] = useState<Theme>(Theme.light)
  const [accountSize, setAccountSize] = useState<Size>(Size.small)
  const [pageSize, setPageSize] = useState<PageSize>(PageSize.Ten)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [localNames, setLocalNames] = useState<string[]>([])
  const [currentLocalName, setCurrentLocalName] = useState<string>('')
  const [followersOf, setFollowersOf] = useState<string>('')
  const [followingsOf, setFollowingsOf] = useState<string>('')
  const [orderBy, setOrderBy] = useState<AccountsOrderBy>(
    AccountsOrderBy.BestMatch
  )
  const [followersOrderBy, setFollowersOrderBy] = useState<FollowersOrderBy>(
    FollowersOrderBy.AccountScore
  )
  const [followingOrderBy, setFollowingOrderBy] = useState<FollowingOrderBy>(
    FollowingOrderBy.AccountScore
  )
  const [hideFollowButton, setHideFollowButton] = useState<boolean>(false)
  const [showUnfollowButton, setShowUnfollowButton] = useState<boolean>(false)
  const [fontSize, setFontSize] = useState<string>('')

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
  const handleAccountClick = (account: any) => {
    console.log('Account clicked:', account)
  }

  const handleFollowed = () => {
    console.log('Account followed/unfollowed')
  }

  const handleAddLocalName = () => {
    if (currentLocalName && !localNames.includes(currentLocalName)) {
      setLocalNames([...localNames, currentLocalName])
      setCurrentLocalName('')
    }
  }

  const handleRemoveLocalName = (name: string) => {
    setLocalNames(localNames.filter((n) => n !== name))
  }

  // Function to generate iframe code
  const generateIframeCode = () => {
    let params = new URLSearchParams()

    if (theme) params.append('theme', theme)
    if (accountSize) params.append('accountSize', accountSize)
    if (pageSize) params.append('pageSize', pageSize.toString())
    if (searchQuery) params.append('searchBy', searchQuery)
    if (localNames.length > 0) params.append('localNames', localNames.join(','))
    if (followersOf) params.append('followersOf', followersOf)
    if (followingsOf) params.append('followingsOf', followingsOf)
    if (orderBy) params.append('orderBy', orderBy)
    if (followersOrderBy) params.append('followersOrderBy', followersOrderBy)
    if (followingOrderBy) params.append('followingOrderBy', followingOrderBy)
    if (hideFollowButton) params.append('hideFollowButton', 'true')
    if (showUnfollowButton) params.append('showUnfollowButton', 'true')
    if (fontSize) params.append('fontSize', fontSize)

    return `<iframe 
  src="${window.location.origin}/embed/accounts-list?${params.toString()}" 
  width="100%" 
  height="600px" 
  frameborder="0">
</iframe>`
  }

  // JSX code for the component
  const componentCode = `import { AccountsList, PageSize, AccountsOrderBy, FollowersOrderBy, FollowingOrderBy, Theme, Size } from "@lens-quick-widgets/ui"

<AccountsList 
  theme={Theme.${Theme[theme]}}
  accountSize={Size.${Size[accountSize]}}
  pageSize={PageSize.${Object.keys(PageSize).find((key) => PageSize[key as keyof typeof PageSize] === pageSize)}}
  ${searchQuery ? `searchBy="${searchQuery}"` : ''}
  ${localNames.length > 0 ? `localNames={[${localNames.map((name) => `"${name}"`).join(', ')}]}` : ''}
  ${followersOf ? `followersOf="${followersOf}"` : ''}
  ${followingsOf ? `followingsOf="${followingsOf}"` : ''}
  orderBy={AccountsOrderBy.${Object.keys(AccountsOrderBy).find((key) => AccountsOrderBy[key as keyof typeof AccountsOrderBy] === orderBy)}}
  followersOrderBy={FollowersOrderBy.${Object.keys(FollowersOrderBy).find((key) => FollowersOrderBy[key as keyof typeof FollowersOrderBy] === followersOrderBy)}}
  followingOrderBy={FollowingOrderBy.${Object.keys(FollowingOrderBy).find((key) => FollowingOrderBy[key as keyof typeof FollowingOrderBy] === followingOrderBy)}}
  ${hideFollowButton ? 'hideFollowButton={true}' : ''}
  ${showUnfollowButton ? 'showUnfollowButton={true}' : ''}
  ${fontSize ? `fontSize="${fontSize}"` : ''}
  onAccountClick={(account) => console.log("Account clicked:", account)}
  onFollowed={() => console.log("Account followed/unfollowed")}
/>`

  return (
    <Container maxWidth="lg" className="py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-12"
      >
        <motion.div variants={itemVariants}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight="bold"
            className="mb-4"
          >
            Accounts List
          </Typography>
          <Typography variant="body1" className="mb-8">
            Display a customizable list of Lens Protocol accounts with various
            filtering options, pagination, and interactive features.
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
                  <InputLabel>Account Size</InputLabel>
                  <Select
                    value={accountSize}
                    label="Account Size"
                    onChange={(e) => setAccountSize(e.target.value as Size)}
                  >
                    <MenuItem value={Size.compact}>Compact</MenuItem>
                    <MenuItem value={Size.small}>Small</MenuItem>
                    <MenuItem value={Size.medium}>Medium</MenuItem>
                    <MenuItem value={Size.large}>Large</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Page Size</InputLabel>
                  <Select
                    value={pageSize}
                    label="Page Size"
                    onChange={(e) => setPageSize(e.target.value as PageSize)}
                  >
                    <MenuItem value={PageSize.Ten}>10</MenuItem>
                    <MenuItem value={PageSize.Fifty}>50</MenuItem>
                  </Select>
                </FormControl>

                <Box mt={3}>
                  <Typography variant="subtitle1" gutterBottom>
                    Search Options (use only one)
                  </Typography>

                  <TextField
                    fullWidth
                    margin="normal"
                    label="Search By Name"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      // Clear other search options when using search
                      setLocalNames([])
                      setFollowersOf('')
                      setFollowingsOf('')
                    }}
                    helperText="Search for accounts by name or handle"
                  />

                  <Box mt={2}>
                    <TextField
                      fullWidth
                      label="Add Local Name"
                      value={currentLocalName}
                      onChange={(e) => setCurrentLocalName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddLocalName()
                        }
                      }}
                      helperText="Press Enter to add multiple handles"
                    />
                    <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                      {localNames.map((name) => (
                        <Chip
                          key={name}
                          label={name}
                          onDelete={() => handleRemoveLocalName(name)}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>

                  <TextField
                    fullWidth
                    margin="normal"
                    label="Followers Of"
                    value={followersOf}
                    onChange={(e) => {
                      setFollowersOf(e.target.value)
                      // Clear other search options
                      setSearchQuery('')
                      setLocalNames([])
                      setFollowingsOf('')
                    }}
                    helperText="Show followers of a specific handle"
                  />

                  <TextField
                    fullWidth
                    margin="normal"
                    label="Following Of"
                    value={followingsOf}
                    onChange={(e) => {
                      setFollowingsOf(e.target.value)
                      // Clear other search options
                      setSearchQuery('')
                      setLocalNames([])
                      setFollowersOf('')
                    }}
                    helperText="Show accounts followed by a specific handle"
                  />
                </Box>

                <Box mt={3}>
                  <Typography variant="subtitle1" gutterBottom>
                    Sorting Options
                  </Typography>

                  <FormControl fullWidth margin="normal">
                    <InputLabel>Order By</InputLabel>
                    <Select
                      value={orderBy}
                      label="Order By"
                      onChange={(e) =>
                        setOrderBy(e.target.value as AccountsOrderBy)
                      }
                    >
                      <MenuItem value={AccountsOrderBy.BestMatch}>
                        Best Match
                      </MenuItem>
                      <MenuItem value={AccountsOrderBy.AccountScore}>
                        Account Score
                      </MenuItem>
                      <MenuItem value={AccountsOrderBy.Alphabetical}>
                        Alphabetical
                      </MenuItem>
                    </Select>
                  </FormControl>

                  {followersOf && (
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Followers Order By</InputLabel>
                      <Select
                        value={followersOrderBy}
                        label="Followers Order By"
                        onChange={(e) =>
                          setFollowersOrderBy(
                            e.target.value as FollowersOrderBy
                          )
                        }
                      >
                        <MenuItem value={FollowersOrderBy.AccountScore}>
                          Account Score
                        </MenuItem>
                        <MenuItem value={FollowersOrderBy.Asc}>
                          Ascending
                        </MenuItem>
                        <MenuItem value={FollowersOrderBy.Desc}>
                          Descending
                        </MenuItem>
                      </Select>
                    </FormControl>
                  )}

                  {followingsOf && (
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Following Order By</InputLabel>
                      <Select
                        value={followingOrderBy}
                        label="Following Order By"
                        onChange={(e) =>
                          setFollowingOrderBy(
                            e.target.value as FollowingOrderBy
                          )
                        }
                      >
                        <MenuItem value={FollowingOrderBy.AccountScore}>
                          Account Score
                        </MenuItem>
                        <MenuItem value={FollowingOrderBy.Asc}>
                          Ascending
                        </MenuItem>
                        <MenuItem value={FollowingOrderBy.Desc}>
                          Descending
                        </MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </Box>

                <Box mt={3}>
                  <Typography variant="subtitle1" gutterBottom>
                    Display Options
                  </Typography>

                  <TextField
                    fullWidth
                    margin="normal"
                    label="Font Size"
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    helperText="Custom font size (12px, 1rem, etc.)"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={hideFollowButton}
                        onChange={(e) => setHideFollowButton(e.target.checked)}
                      />
                    }
                    label="Hide Follow Button"
                  />

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
                  <AccountsList
                    theme={theme}
                    accountSize={accountSize}
                    pageSize={pageSize}
                    searchBy={searchQuery || undefined}
                    localNames={localNames.length > 0 ? localNames : undefined}
                    followersOf={followersOf || undefined}
                    followingsOf={followingsOf || undefined}
                    orderBy={orderBy}
                    followersOrderBy={followersOrderBy}
                    followingOrderBy={followingOrderBy}
                    hideFollowButton={hideFollowButton}
                    showUnfollowButton={showUnfollowButton}
                    fontSize={fontSize || undefined}
                    onAccountClick={handleAccountClick}
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
