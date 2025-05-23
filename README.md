<p align="center">
  <img src="https://lens-quick-widgets-web.vercel.app/android-chrome-192x192.png" alt="Lens Quick Widgets Logo" width="200"/>
</p>

# Lens Quick Widgets

A React library to quickly start developing with [Lens Protocol](https://lens.xyz/). Focus on what matters by abstracting away complex UI and interactions. Easily showcase your posts, accounts, and more with just a few lines of code.

> This project is heavily inspired by [lens-widgets](https://github.com/lens-protocol/lens-widgets) from Lens Protocol.

## Features

- 🚀 **Rapid Development** - Start building in minutes with pre-built components
- 🎨 **Customizable Design** - Adapt components to match your brand with extensive styling options
- 🖼️ **Iframe Support** - Embed your Lens content anywhere with generated iframe links
- ⚡ **Performance Optimized** - Built for speed and efficiency

## Project Structure

This repository contains two main packages:

- **[Web App](/apps/web)** - A Next.js demo application showcasing all components
- **[UI Package](/packages/ui)** - The core React components library

## Getting Started

### Installation

```bash
# Install the package in your React project along with required dependencies
npm install lens-quick-widgets wagmi connectkit

# Or using pnpm
pnpm add lens-quick-widgets wagmi connectkit
```

Note: `lens-quick-widgets` requires both `wagmi` and `connectkit` as peer dependencies.

### Basic Setup

Wrap your application with the `LensWidgetProvider` to provide Lens Protocol authentication and theme context:

```jsx
import { LensWidgetProvider, Theme } from "lens-quick-widgets"
import { createConfig, http, WagmiProvider } from "wagmi"
import { lens } from "wagmi/chains"
import { getDefaultConfig } from "connectkit"

// Configure Wagmi (required for Lens authentication)
const config = createConfig(
  getDefaultConfig({
    chains: [lens],
    transports: {
      [lens.id]: http(
        `https://eth-mainnet.g.alchemy.com/v2/${YOUR_ALCHEMY_ID}`
      ),
    },
    walletConnectProjectId: YOUR_WALLET_CONNECT_PROJECT_ID,
    appName: "Your App Name",
  })
)

// In your app root
const App = () => {
  return (
    <WagmiProvider config={config}>
      <LensWidgetProvider defaultTheme={Theme.light} isTestnet={false}>
        {/* Your application components */}
      </LensWidgetProvider>
    </WagmiProvider>
  )
}
```

### Using Components

```jsx
import {
  SignInWithLens,
  Post,
  PostsList,
  Account,
  AccountsList,
  Theme
} from 'lens-quick-widgets'

// Authentication component
<SignInWithLens
  theme={Theme.light}
  onConnectWallet={(address) => console.log(`Connected: ${address}`)}
  onLogin={(account) => console.log('Logged in:', account)}
  onLogout={() => console.log('Logged out')}
/>

// Display a single post
<Post
  postId="0x01-0x01"
  theme={Theme.dark}
  showFollow={true}
  showHeyButton={true}
/>

// Display a feed of posts
<PostsList
  postsOf="stani"
  pageSize={10}
  theme={Theme.mint}
/>

// Display a user profile
<Account
  localName="stani"
  theme={Theme.green}
  showHeyButton={true}
/>

// Display a list of accounts
<AccountsList
  searchBy="lens"
  theme={Theme.peach}
/>
```

### Embedding via iframes

You can embed any component on external websites (blogs, streamers' overlay, etc.) using iframes.

```html
<!-- Embed a lens post -->
<iframe
  src="https://lens-quick-widgets-web.vercel.app/embed/post?postId=0x01-0x01&theme=dark&showHeyButton=true"
  width="100%"
  height="400px"
></iframe>

<!-- Embed a user profile -->
<iframe
  src="https://lens-quick-widgets-web.vercel.app/embed/account?localName=stani&theme=green&showHeyButton=true"
  width="100%"
  height="300px"
></iframe>
```

## Running Locally

### Setting Up the Project

```bash
# Clone the repository
git clone https://github.com/RathodDeven/lens-quick-widgets.git
cd lens-quick-widgets

# Install dependencies
pnpm install

# Build UI package
pnpm build:ui

# Run the web app
pnpm dev:web

# Run the UI development server
pnpm dev:ui
```

### Environment Variables

Create a `.env.local` file in the `apps/web` directory:

```
NEXT_PUBLIC_ALCHEMY_ID=your_alchemy_id
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

## Documentation

For detailed documentation on components, props, and usage examples:

- [Web App Documentation](/apps/web/README.md)
- [UI Package Documentation](/packages/ui/README.md)

## Future Development and Improvements

We're continuously working to enhance Lens Quick Widgets. Here are some planned improvements:

- **ML-Enhanced Posts Feed** - Adding parameters to PostsList to fetch ML-recommended posts feed for specific handles
- **Group Components** - New components for displaying and interacting with Lens groups
- **Enhanced Content Compatibility** - Expanding content focus compatibility in the Post component
- **Mutual Followers** - Integrating mutual followers information in the Account component when logged in
- **Additional Customization Options** - More styling and configuration options for all components
- **Interactive Comment System** - Upon clicking the comment button, open a popup with the post card, displaying existing comments and allowing users to create new comments
- **Create Account Component** - A dedicated component for creating new Lens profiles directly within your application
- **Create Post Component** - A dedicated component for creating and publishing new posts directly from your application
- **Quote Post Component** - Enable users to quote and respond to existing posts with added context

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
