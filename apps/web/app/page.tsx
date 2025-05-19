'use client'
import './globals.css'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Button,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid
} from '@mui/material'
import {
  FaSignInAlt,
  FaListUl,
  FaNewspaper,
  FaUser,
  FaUsers,
  FaRocket,
  FaPalette,
  FaCode
} from 'react-icons/fa'
import { GITHUB_LINK, NPM_PACKAGE_LINK } from '../src/utils/config'

export default function Home() {
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

  const components = [
    {
      title: 'Sign In With Lens',
      description: 'Authenticate users with Lens Protocol in one click',
      icon: <FaSignInAlt size={40} />,
      color: '#8B5CF6',
      link: '/showcase/sign-in-with-lens'
    },
    {
      title: 'Posts List',
      description: 'Display a customizable feed of Lens Protocol posts',
      icon: <FaListUl size={40} />,
      color: '#EC4899',
      link: '/showcase/posts-list'
    },
    {
      title: 'Post',
      description: 'Render individual Lens posts with rich formatting',
      icon: <FaNewspaper size={40} />,
      color: '#F59E0B',
      link: '/showcase/post'
    },
    {
      title: 'Account',
      description: 'Show Lens user profiles with customizable styles',
      icon: <FaUser size={40} />,
      color: '#10B981',
      link: '/showcase/account'
    },
    {
      title: 'Accounts List',
      description: 'Display multiple Lens accounts with filtering options',
      icon: <FaUsers size={40} />,
      color: '#3B82F6',
      link: '/showcase/accounts-list'
    }
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 8, overflow: 'auto' }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-24" // Increased from space-y-16 for more spacing between sections
      >
        {/* Hero Section */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center text-center space-y-6"
        >
          <Typography
            variant="h2"
            component="h1"
            fontWeight="bold"
            className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            sx={{ textAlign: 'center', maxWidth: '80%', mx: 'auto' }}
          >
            Lens Quick Widgets
          </Typography>
          <Typography
            variant="h5"
            component="p"
            color="text.secondary"
            sx={{ textAlign: 'center', maxWidth: '70%', mx: 'auto' }}
          >
            A React library to quickly start developing with Lens Protocol
          </Typography>
          <Typography
            variant="body1"
            sx={{ maxWidth: '60%', mx: 'auto', textAlign: 'center' }}
          >
            Focus on what matters by abstracting away complex UI and
            interactions. Easily showcase your posts, accounts, and more with
            just a few lines of code. Supports iframes so creators can display
            content on their own sites, streamers can add it to OBS, and
            companies can showcase posts and team members.
          </Typography>
          <Box
            sx={{
              pt: 4,
              display: 'flex',
              justifyContent: 'center',
              gap: 2
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              component="a"
              href={GITHUB_LINK}
              target="_blank"
            >
              GitHub
            </Button>
            <Button
              variant="outlined"
              size="large"
              component="a"
              href={NPM_PACKAGE_LINK}
              target="_blank"
            >
              NPM Package
            </Button>
          </Box>
        </motion.div>

        {/* Components Section */}
        <Box sx={{ mt: 12, mb: 12 }}>
          <motion.div variants={itemVariants}>
            {' '}
            {/* Added margin top and bottom */}
            <Typography
              variant="h4"
              component="h2"
              fontWeight="bold"
              sx={{ textAlign: 'center', mb: 10 }}
            >
              Explore Components
            </Typography>
            <Grid container spacing={4}>
              {components.map((component, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Link
                    href={component.link}
                    style={{ textDecoration: 'none' }}
                  >
                    <motion.div
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        sx={{
                          height: 240, // Fixed height for all cards
                          display: 'flex',
                          flexDirection: 'column',
                          borderTop: `4px solid ${component.color}`,
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            boxShadow: `0 10px 25px -5px ${component.color}40`
                          }
                        }}
                      >
                        <Box
                          sx={{
                            p: 3,
                            display: 'flex',
                            justifyContent: 'center'
                          }}
                        >
                          <div style={{ color: component.color }}>
                            {component.icon}
                          </div>
                        </Box>
                        <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                          <Typography
                            gutterBottom
                            variant="h5"
                            component="h3"
                            fontWeight="bold"
                          >
                            {component.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {component.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Link>
                </Grid>
              ))}

              {/* Coming Soon Card */}
              <Grid item xs={12} sm={6} md={4}>
                <motion.div whileHover={{ y: -3, scale: 1.01 }}>
                  <Card
                    sx={{
                      height: 240, // Same height as other cards
                      display: 'flex',
                      flexDirection: 'column',
                      borderTop: '4px solid #6366F1', // Indigo color
                      background:
                        'linear-gradient(135deg, #4338CA 0%, #6366F1 100%)',
                      transition: 'all 0.3s ease-in-out',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
                      '&:hover': {
                        boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.5)'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        p: 3,
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      <div style={{ color: 'white' }}>
                        <FaRocket size={40} />
                      </div>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h3"
                        fontWeight="bold"
                        sx={{ color: 'white' }}
                      >
                        More Coming Soon
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
                      >
                        {
                          "We're working on more powerful components to help you build with Lens Protocol"
                        }
                      </Typography>
                    </CardContent>
                    {/* Diagonal "Coming Soon" ribbon */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 20,
                        right: -35,
                        transform: 'rotate(45deg)',
                        backgroundColor: '#4F46E5',
                        color: 'white',
                        padding: '5px 40px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}
                    >
                      SOON
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Box>

        {/* Features Section */}
        <Box
          sx={{
            py: 8, // Increased padding
            px: 4,
            mt: 8, // Added margin top
            borderRadius: 4,
            background:
              'linear-gradient(145deg, rgba(139, 92, 246, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
          }}
        >
          <motion.div variants={itemVariants} className="text-center">
            <Typography
              variant="h4"
              component="h2"
              fontWeight="bold"
              sx={{
                textAlign: 'center',
                mb: 8,
                background: 'linear-gradient(to right, #8B5CF6, #EC4899)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block'
              }}
            >
              Why Lens Quick Widgets?
            </Typography>
            <Grid container spacing={5} justifyContent="center">
              <Grid item xs={12} md={4}>
                <Box
                  className="p-4"
                  sx={{
                    textAlign: 'center',
                    borderRadius: 3,
                    py: 4,
                    px: 3,
                    background:
                      'linear-gradient(135deg, #8B5CF6 0%, #7c4ddc 100%)',
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'translateY(-5px)' }
                  }}
                >
                  <Box sx={{ mb: 2, color: 'white' }}>
                    <FaRocket size={30} />
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ color: 'white' }}
                  >
                    Rapid Development
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    Start building in minutes with pre-built components that
                    handle all the complex Lens Protocol logic.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  className="p-4"
                  sx={{
                    textAlign: 'center',
                    borderRadius: 3,
                    py: 4,
                    px: 3,
                    background:
                      'linear-gradient(135deg, #EC4899 0%, #db3385 100%)',
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(236, 72, 153, 0.3)',
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'translateY(-5px)' }
                  }}
                >
                  <Box sx={{ mb: 2, color: 'white' }}>
                    <FaPalette size={30} />
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ color: 'white' }}
                  >
                    Customizable Design
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    Adapt components to match your brand with extensive styling
                    options and theme support.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  className="p-4"
                  sx={{
                    textAlign: 'center',
                    borderRadius: 3,
                    py: 4,
                    px: 3,
                    background:
                      'linear-gradient(135deg, #3B82F6 0%, #2563eb 100%)',
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'translateY(-5px)' }
                  }}
                >
                  <Box sx={{ mb: 2, color: 'white' }}>
                    <FaCode size={30} />
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ color: 'white' }}
                  >
                    Iframe Support
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    Embed your Lens content anywhere with generated iframe links
                    - perfect for creators and companies.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </motion.div>
        </Box>
      </motion.div>
    </Container>
  )
}
