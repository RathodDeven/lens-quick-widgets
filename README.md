<p align="center">
  <img src="https://raw.githubusercontent.com/devendran-m/lens-beauty-widgets/main/apps/web/public/android-chrome-512x512.png" alt="Lens Quick Widgets Logo" width="200"/>
</p>

# Lens Quick Widgets

A React library to quickly start developing with [Lens Protocol](https://lens.xyz/). Focus on what matters by abstracting away complex UI and interactions. Easily showcase your posts, accounts, and more with just a few lines of code.

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
# Install the package in your React project
npm install lens-quick-widgets

# Or using yarn
yarn add lens-quick-widgets
```

### Basic Setup

Wrap your application with the `LensWidgetProvider` to provide Lens Protocol authentication and theme context:

```jsx
import { LensWidgetProvider, Theme } from "lens-quick-widgets"

// In your app root
const App = () => {
  return (
    <LensWidgetProvider defaultTheme={Theme.light} isTestnet={false}>
      {/* Your application components */}
    </LensWidgetProvider>
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
  src="https://your-app.com/embed/post?postId=0x01-0x01&theme=dark"
  width="100%"
  height="400px"
  frameborder="0"
>
</iframe>

<!-- Embed a user profile -->
<iframe
  src="https://your-app.com/embed/account?localName=stani&theme=green"
  width="100%"
  height="300px"
  frameborder="0"
>
</iframe>
```

## Running Locally

### Setting Up the Project

```bash
# Clone the repository
git clone https://github.com/your-username/lens-beauty-widgets.git
cd lens-beauty-widgets

# Install dependencies
yarn install

# Build UI package
yarn workspace lens-quick-widgets build

# Run the web app
yarn workspace web dev
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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
