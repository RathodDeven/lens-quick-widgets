# Lens Quick Widgets Demo App

A Next.js application showcasing the capabilities of the `lens-quick-widgets` library. This demo app provides a comprehensive playground to explore all components, their configurations, and iframe embedding functionality.

<p align="center">
  <img src="https://lens-quick-widgets-web.vercel.app/android-chrome-192x192.png" alt="Lens Quick Widgets Logo" width="150"/>
</p>

## Features

- 🧪 **Interactive Playground** - Test all components with different configurations
- 🎮 **Live Code Generation** - See the code needed for your custom configuration
- 🖼️ **Embed Code Generator** - Get iframe embed codes for any component configuration
- 📱 **Responsive Design** - Works on both mobile and desktop devices

## Getting Started

### Prerequisites

- Node.js 16+ and pnpm
- Alchemy API key
- WalletConnect Project ID

### Installation

```bash
# Clone the repo
git clone https://github.com/RathodDeven/lens-quick-widgets.git

# Navigate to the project root
cd lens-quick-widgets

# Install dependencies
pnpm install
```

Note: The example app already includes `wagmi` and `connectkit` as dependencies, which are required for `lens-quick-widgets` to function properly.

### Environment Variables

Create a `.env.local` file in the `apps/web` directory with the following:

```
NEXT_PUBLIC_ALCHEMY_ID=your_alchemy_id
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

### Running the Development Server

```bash
# Run only the web app
pnpm dev:web

# Or run all packages in development mode
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app in action.

### Building for Production

```bash
# Build only the web app
pnpm --filter web run build

# Or build all packages
pnpm build
```

## Project Structure

```
apps/web/
├── app/                  # Next.js app directory
│   ├── showcase/         # Component showcase pages
│   │   ├── account/      # Account component demo
│   │   ├── accounts-list/# AccountsList component demo
│   │   ├── post/         # Post component demo
│   │   ├── posts-list/   # PostsList component demo
│   │   └── sign-in-with-lens/ # SignInWithLens component demo
│   ├── embed/            # Iframe embedding endpoints
│   ├── page.tsx          # Homepage
│   └── layout.tsx        # Root layout
├── public/               # Static assets
└── src/                  # Source files
    ├── components/       # Shared components
    └── utils/            # Utility functions
```

## Iframe Embedding

The demo app provides endpoints for embedding Lens components in iframes. Each component has a dedicated embed endpoint:

- `/embed/sign-in-with-lens`: Authentication button
- `/embed/post`: Single post display
- `/embed/posts-list`: Feed of posts
- `/embed/account`: User profile
- `/embed/accounts-list`: List of accounts

You can configure each component through URL parameters. For example:

```
https://lens-quick-widgets-web.vercel.app/embed/post?postId=0x01-0x01&theme=dark&hideInteractions=true
```

The component showcase pages provide a UI to configure components and generate the iframe embed code.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Related

- [Lens Quick Widgets Package](/packages/ui/README.md) - Core UI component library
- [Lens Protocol](https://lens.xyz/) - Social networking protocol
