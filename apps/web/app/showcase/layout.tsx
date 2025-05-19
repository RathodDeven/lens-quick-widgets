'use client'

import Link from 'next/link'
import { Box, Button, Container } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export default function ShowcaseLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Box>
      <Container maxWidth="lg" sx={{ pt: 2, pb: 1 }}>
        <Link href="/" passHref>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            sx={{ mb: 2 }}
          >
            Back to Home
          </Button>
        </Link>
      </Container>
      {children}
    </Box>
  )
}
