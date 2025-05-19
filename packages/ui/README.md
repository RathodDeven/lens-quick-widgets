# Lens Quick Widgets UI Library

A comprehensive React component library for building applications with [Lens Protocol](https://lens.xyz/). This package provides ready-to-use UI components to streamline your development process.

<p align="center">
  <img src="../../apps/web/public/lens-beauty-widgets-logo.png" alt="Lens Quick Widgets Logo" width="150"/>
</p>

## Table of Contents

- [Installation](#installation)
- [Provider Setup](#provider-setup)
- [Components](#components)
  - [SignInWithLens](#signinwithlens)
  - [Post](#post)
  - [PostsList](#postslist)
  - [Account](#account)
  - [AccountsList](#accountslist)
- [Theming](#theming)
- [Types](#types)
- [Advanced Usage](#advanced-usage)
- [Contributing](#contributing)

## Installation

```bash
# Install the package
npm install lens-quick-widgets

# Or using yarn
yarn add lens-quick-widgets
```

## Provider Setup

The library requires a provider component to handle authentication, theming, and Lens Protocol integration. Wrap your application with `LensWidgetProvider`:

```jsx
import { LensWidgetProvider, Theme } from "lens-quick-widgets"
import { createConfig, http, WagmiProvider } from "wagmi"
import { lens } from "wagmi/chains"
import { getDefaultConfig } from "connectkit"

// Configure Wagmi (required for wallet connections)
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

// In your app root component
const App = () => {
  return (
    <WagmiProvider config={config}>
      <LensWidgetProvider
        defaultTheme={Theme.light}
        isTestnet={false}
        appAddress="0xYourAppAddressIfYouHaveOne"
      >
        {/* Your application components */}
      </LensWidgetProvider>
    </WagmiProvider>
  )
}
```

### Provider Props

| Prop         | Type        | Default                 | Description                          |
| ------------ | ----------- | ----------------------- | ------------------------------------ |
| defaultTheme | `Theme`     | `Theme.default`         | Default theme for all components     |
| isTestnet    | `boolean`   | `false`                 | Whether to use Lens Protocol testnet |
| appAddress   | `string`    | Lens Widget app address | Your app's blockchain address        |
| children     | `ReactNode` | -                       | Child components                     |

## Components

### SignInWithLens

A button that handles the entire Lens authentication flow, from wallet connection to profile authentication.

```jsx
import { SignInWithLens, Theme } from "lens-quick-widgets"

;<SignInWithLens
  theme={Theme.dark}
  onConnectWallet={(address) => console.log(`Connected: ${address}`)}
  onLogin={(account) => console.log("Logged in:", account)}
  onLogout={() => console.log("User logged out")}
/>
```

#### Props

| Prop            | Type                        | Default       | Description                 |
| --------------- | --------------------------- | ------------- | --------------------------- |
| theme           | `Theme`                     | Context theme | Visual theme of the button  |
| onConnectWallet | `(address: string) => void` | -             | Called when wallet connects |
| onLogin         | `(account: any) => void`    | -             | Called on successful login  |
| onLogout        | `() => void`                | -             | Called on logout            |

### Post

Displays a single Lens Protocol post with rich formatting, media support, and interactive features.

```jsx
import { Post, Theme } from "lens-quick-widgets"

;<Post
  postId="0x01-0x01"
  theme={Theme.light}
  hideInteractions={false}
  showStats={true}
  showFollow={true}
  contentPreviewLimit={400}
  visibleStats={["upvotes", "comments", "reposts"]}
  visibleButtons={["like", "repost", "comment"]}
  onLike={(post) => console.log("Post liked:", post.id)}
  onRepost={(post) => console.log("Post reposted:", post.id)}
  onComment={(post) => console.log("Comment on post:", post.id)}
  onClick={(post) => console.log("Post clicked:", post.id)}
/>
```

#### Props

| Prop                | Type                                                                                             | Default       | Description                                |
| ------------------- | ------------------------------------------------------------------------------------------------ | ------------- | ------------------------------------------ |
| post                | `AnyPost`                                                                                        | -             | Direct post object (alternative to postId) |
| postId              | `string`                                                                                         | -             | ID of the post to fetch                    |
| theme               | `Theme`                                                                                          | Context theme | Visual theme                               |
| containerStyle      | `React.CSSProperties`                                                                            | -             | Custom container styling                   |
| hideInteractions    | `boolean`                                                                                        | `false`       | Hide interaction buttons                   |
| showStats           | `boolean`                                                                                        | `true`        | Show post statistics                       |
| showFollow          | `boolean`                                                                                        | `true`        | Show follow button for post author         |
| showUnfollowButton  | `boolean`                                                                                        | `false`       | Show unfollow button for followed users    |
| contentPreviewLimit | `number`                                                                                         | `400`         | Character limit before "Show more"         |
| visibleStats        | `Array<"upvotes" \| "comments" \| "reposts" \| "quotes" \| "bookmarks" \| "collects" \| "tips">` | All stats     | Which stats to display                     |
| visibleButtons      | `Array<"like" \| "repost" \| "comment">`                                                         | All buttons   | Which interaction buttons to show          |
| onLike              | `(post: AnyPost) => void`                                                                        | -             | Called when post is liked                  |
| onRepost            | `(post: AnyPost) => void`                                                                        | -             | Called when post is reposted               |
| onComment           | `(post: AnyPost) => void`                                                                        | -             | Called when comment button clicked         |
| onClick             | `(post: AnyPost) => void`                                                                        | -             | Called when post is clicked                |
| onLoad              | `(post: AnyPost) => void`                                                                        | -             | Called when post data loads                |

### PostsList

Displays a customizable feed of Lens Protocol posts with infinite scrolling and filtering options.

```jsx
import { PostsList, PageSize, Theme } from "lens-quick-widgets"

;<PostsList
  theme={Theme.green}
  pageSize={PageSize.Ten}
  searchQuery="blockchain"
  postsOf="stani"
  widthOfPostCard="100%"
  hideInteractions={false}
  showStats={true}
  contentPreviewLimit={200}
  onPostClick={(post) => console.log("Post clicked:", post.id)}
  onLike={(post) => console.log("Post liked:", post.id)}
  onRepost={(post) => console.log("Post reposted:", post.id)}
/>
```

#### Props

| Prop                | Type                                                                                             | Default        | Description                             |
| ------------------- | ------------------------------------------------------------------------------------------------ | -------------- | --------------------------------------- |
| accountScore        | `{ atLeast: number }` \| `{ lessThan: number }`                                                  | -              | Filter by account score                 |
| apps                | `EvmAddress[]`                                                                                   | -              | Filter by apps used to create posts     |
| authors             | `EvmAddress[]`                                                                                   | -              | Filter by post authors                  |
| metadata            | `Object`                                                                                         | -              | Filter by post metadata                 |
| posts               | `PostId[]`                                                                                       | -              | Filter to specific post IDs             |
| postTypes           | `LensPostType[]`                                                                                 | -              | Filter by post types                    |
| searchQuery         | `string`                                                                                         | -              | Search for posts with specific content  |
| postsOf             | `string`                                                                                         | -              | Show posts from a specific Lens user    |
| pageSize            | `PageSize`                                                                                       | `PageSize.Ten` | Number of posts per page                |
| theme               | `Theme`                                                                                          | Context theme  | Visual theme                            |
| widthOfPostCard     | `string \| number`                                                                               | `'100%'`       | Width of each post card                 |
| containerStyle      | `React.CSSProperties`                                                                            | -              | Custom container styling                |
| postStyle           | `React.CSSProperties`                                                                            | -              | Custom post styling                     |
| postContainerStyle  | `React.CSSProperties`                                                                            | -              | Custom post container styling           |
| hideInteractions    | `boolean`                                                                                        | `false`        | Hide interaction buttons                |
| showStats           | `boolean`                                                                                        | `true`         | Show post statistics                    |
| showFollow          | `boolean`                                                                                        | `true`         | Show follow button for post authors     |
| showUnfollowButton  | `boolean`                                                                                        | `false`        | Show unfollow button for followed users |
| contentPreviewLimit | `number`                                                                                         | `400`          | Character limit before "Show more"      |
| visibleStats        | `Array<"upvotes" \| "comments" \| "reposts" \| "quotes" \| "bookmarks" \| "collects" \| "tips">` | All stats      | Which stats to display                  |
| visibleButtons      | `Array<"like" \| "repost" \| "comment">`                                                         | All buttons    | Which interaction buttons to show       |
| onPostClick         | `(post: AnyPost) => void`                                                                        | -              | Called when a post is clicked           |
| onLike              | `(post: AnyPost) => void`                                                                        | -              | Called when a post is liked             |
| onRepost            | `(post: AnyPost) => void`                                                                        | -              | Called when a post is reposted          |

### Account

Displays a Lens Protocol user profile with customizable styling and size options.

```jsx
import { Account, Theme, Size } from "lens-quick-widgets"

;<Account
  localName="stani"
  theme={Theme.mint}
  size={Size.medium}
  hideFollowButton={false}
  showUnfollowButton={false}
  fontSize="16px"
  onAccountLoad={(account) => console.log("Account loaded:", account)}
  onClick={(account, stats) => console.log("Account clicked:", account, stats)}
  onFollowed={() => console.log("Account followed/unfollowed")}
/>
```

#### Props

| Prop                       | Type                                         | Default       | Description                                                     |
| -------------------------- | -------------------------------------------- | ------------- | --------------------------------------------------------------- |
| account                    | `AccountType`                                | -             | Direct account object (alternative to localName/accountAddress) |
| accountAddress             | `string`                                     | -             | Blockchain address of the account to display                    |
| localName                  | `string`                                     | -             | Lens handle of the account to display                           |
| theme                      | `Theme`                                      | Context theme | Visual theme                                                    |
| size                       | `Size`                                       | `Size.medium` | Size variant of the component                                   |
| containerStyle             | `React.CSSProperties`                        | -             | Custom container styling                                        |
| followButtonStyle          | `React.CSSProperties`                        | -             | Custom follow button styling                                    |
| followButtonContainerStyle | `React.CSSProperties`                        | -             | Custom follow button container styling                          |
| followButtonTextColor      | `string`                                     | -             | Custom follow button text color                                 |
| hideFollowButton           | `boolean`                                    | `false`       | Hide the follow button                                          |
| showUnfollowButton         | `boolean`                                    | `false`       | Show unfollow button for followed users                         |
| fontSize                   | `string`                                     | Based on size | Custom font size                                                |
| onAccountLoad              | `(account: AccountType) => void`             | -             | Called when account data loads                                  |
| onError                    | `(error: Error) => void`                     | -             | Called on error                                                 |
| onClick                    | `(account: AccountType, stats: any) => void` | -             | Called when component is clicked                                |
| onFollowed                 | `() => void`                                 | -             | Called when account is followed/unfollowed                      |

### AccountsList

Displays a customizable list of Lens Protocol accounts with filtering and infinite scrolling.

```jsx
import {
  AccountsList,
  PageSize,
  Size,
  Theme,
  AccountsOrderBy,
} from "lens-quick-widgets"

;<AccountsList
  theme={Theme.peach}
  accountSize={Size.small}
  pageSize={PageSize.Ten}
  searchBy="lens"
  followersOf="stani"
  orderBy={AccountsOrderBy.AccountScore}
  hideFollowButton={false}
  showUnfollowButton={false}
  onAccountClick={(account) => console.log("Account clicked:", account)}
  onFollowed={() => console.log("Account followed/unfollowed")}
/>
```

#### Props

| Prop                       | Type                             | Default                         | Description                                   |
| -------------------------- | -------------------------------- | ------------------------------- | --------------------------------------------- |
| searchBy                   | `string`                         | -                               | Search accounts by name or handle             |
| addresses                  | `string[]`                       | -                               | Show accounts with specific addresses         |
| ownedBy                    | `string[]`                       | -                               | Show accounts owned by specific addresses     |
| localNames                 | `string[]`                       | -                               | Show accounts with specific handles           |
| managedBy                  | `string`                         | -                               | Show accounts managed by a specific address   |
| followersOf                | `string`                         | -                               | Show followers of a specific handle           |
| followingsOf               | `string`                         | -                               | Show accounts followed by a specific handle   |
| pageSize                   | `PageSize`                       | `PageSize.Ten`                  | Number of accounts per page                   |
| theme                      | `Theme`                          | Context theme                   | Visual theme                                  |
| accountSize                | `Size`                           | `Size.small`                    | Size of account components                    |
| orderBy                    | `AccountsOrderBy`                | `AccountsOrderBy.BestMatch`     | Sorting for regular accounts                  |
| followersOrderBy           | `FollowersOrderBy`               | `FollowersOrderBy.AccountScore` | Sorting for followers                         |
| followingOrderBy           | `FollowingOrderBy`               | `FollowingOrderBy.AccountScore` | Sorting for followings                        |
| containerStyle             | `React.CSSProperties`            | -                               | Custom container styling                      |
| accountStyle               | `React.CSSProperties`            | -                               | Custom account component styling              |
| followButtonStyle          | `React.CSSProperties`            | -                               | Custom follow button styling                  |
| followButtonContainerStyle | `React.CSSProperties`            | -                               | Custom follow button container styling        |
| followButtonTextColor      | `string`                         | -                               | Custom follow button text color               |
| hideFollowButton           | `boolean`                        | `false`                         | Hide the follow button                        |
| showUnfollowButton         | `boolean`                        | `false`                         | Show unfollow button for followed users       |
| fontSize                   | `string`                         | -                               | Custom font size                              |
| onAccountClick             | `(account: AccountType) => void` | -                               | Called when an account is clicked             |
| onFollowed                 | `() => void`                     | -                               | Called when an account is followed/unfollowed |

## Theming

The library provides several built-in themes:

```jsx
import { Theme } from "lens-quick-widgets"

// Available themes
Theme.default // Default Lens theme
Theme.light // Light theme
Theme.dark // Dark theme
Theme.green // Green theme
Theme.blonde // Blonde theme
Theme.lavender // Lavender theme
Theme.mint // Mint theme
Theme.peach // Peach theme
```

## Types

Common types used in the library:

```tsx
// Component sizes
enum Size {
  compact = "compact", // Minimal inline version
  small = "small", // Small version
  medium = "medium", // Standard size
  large = "large", // Full featured size
}

// Page size for lists
enum PageSize {
  Ten = 10,
  Fifty = 50,
}

// Account sorting options
enum AccountsOrderBy {
  BestMatch = "BEST_MATCH",
  AccountScore = "ACCOUNT_SCORE",
  Alphabetical = "ALPHABETICAL",
}

// Followers sorting options
enum FollowersOrderBy {
  AccountScore = "ACCOUNT_SCORE",
  Asc = "ASC",
  Desc = "DESC",
}

// Following sorting options
enum FollowingOrderBy {
  AccountScore = "ACCOUNT_SCORE",
  Asc = "ASC",
  Desc = "DESC",
}
```

## Advanced Usage

### Custom Styling

All components accept style customization props. For example:

```jsx
<Post
  postId="0x01-0x01"
  containerStyle={{
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: "12px",
    maxWidth: "600px",
  }}
/>
```

### Authentication Flow

The authentication flow with `SignInWithLens` has three stages:

1. **Wallet Connection** - User connects their blockchain wallet
2. **Challenge Signing** - User signs a message to prove ownership
3. **Authentication** - User is authenticated with Lens Protocol

You can track this flow with the provided callbacks:

```jsx
<SignInWithLens
  onConnectWallet={(address) => console.log(`Wallet connected: ${address}`)}
  onLogin={(account) => {
    console.log("Authenticated account:", account)
    // Save user session, redirect, etc.
  }}
  onLogout={() => {
    console.log("User logged out")
    // Clear session, redirect, etc.
  }}
/>
```

### Advanced Filtering for PostsList

```jsx
<PostsList
  // Filter by content type
  metadata={{
    mainContentFocus: ["IMAGE", "VIDEO"],
    contentWarning: { oneOf: ["NSFW", "SENSITIVE"] },
    tags: { oneOf: ["blockchain", "crypto"] },
  }}
  // Filter by author reputation
  accountScore={{ atLeast: 50 }}
  // Filter by post type
  postTypes={["POST", "COMMENT"]}
/>
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This package is licensed under the MIT License.
