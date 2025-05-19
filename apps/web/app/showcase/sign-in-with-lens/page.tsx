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
import { SignInWithLens, Theme } from '@lens-quick-widgets/ui'
import { APP_LINK } from '@/src/utils/config'

export default function Page() {
  // State for component props
  const [theme, setTheme] = useState<Theme>(Theme.default)
  const [callbackMessage, setCallbackMessage] = useState('')

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
  const handleConnectWallet = (address: string) => {
    setCallbackMessage(`Wallet connected: ${address}`)
  }

  const handleLogin = (account: any) => {
    setCallbackMessage(
      `Logged in as: ${account.username?.localName || account.address}`
    )
  }

  const handleLogout = () => {
    setCallbackMessage('Logged out successfully')
  }

  // Function to generate iframe code
  const generateIframeCode = () => {
    // Safely access window.location.origin for browser environments only
    const baseUrl =
      typeof window !== 'undefined' ? window.location.origin : APP_LINK

    return `<iframe 
  src="${baseUrl}/embed/sign-in-with-lens?theme=${theme}" 
  width="100%" 
  height="100px" 
  frameborder="0">
</iframe>`
  }

  // JSX code for the component
  const componentCode = `import { SignInWithLens } from "@lens-quick-widgets/ui"

<SignInWithLens 
  theme="${theme}"
  onConnectWallet={(address) => console.log("Wallet connected:", address)}
  onLogin={(account) => console.log("Logged in:", account)}
  onLogout={() => console.log("Logged out")}
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
            Sign In With Lens
          </Typography>
          <Typography variant="body1" className="mb-8">
            A simple, customizable button that handles the entire authentication
            flow with Lens Protocol. Connect a wallet, sign in with Lens, and
            manage user sessions with one component.
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

                {/* Callback results display */}
                {callbackMessage && (
                  <Box mt={2} p={2} bgcolor="action.hover" borderRadius={1}>
                    <Typography variant="body2" fontFamily="monospace">
                      {callbackMessage}
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
                <Box className="flex justify-center p-4">
                  <SignInWithLens
                    theme={theme}
                    onConnectWallet={handleConnectWallet}
                    onLogin={handleLogin}
                    onLogout={handleLogout}
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
