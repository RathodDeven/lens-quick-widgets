# @lens-quick-widgets/ui

A lightweight, customizable UI component library for React applications.

## Installation

If using within the monorepo:

```bash
# The package is already linked via workspace
```

If using externally (after publishing):

```bash
npm install @lens-quick-widgets/ui
# or
yarn add @lens-quick-widgets/ui
# or
pnpm add @lens-quick-widgets/ui
```

## Components

### DivComponent

A customizable container component with styling options.

```tsx
import { DivComponent } from "@lens-quick-widgets/ui"

// Basic usage
<DivComponent>Content goes here</DivComponent>

// With all props
<DivComponent
  backgroundColor="#f0f0f0"
  rounded={true}
  shadow={true}
  style={{ margin: '20px' }}
  onClick={() => alert('Clicked!')}
>
  Customized container
</DivComponent>
```

#### Props

| Prop              | Type                | Default                | Description                                 |
| ----------------- | ------------------- | ---------------------- | ------------------------------------------- |
| `backgroundColor` | string              | "#f0f0f0"              | Background color of the container           |
| `rounded`         | boolean             | false                  | Adds rounded corners when true              |
| `shadow`          | boolean             | false                  | Adds box shadow when true                   |
| `onClick`         | function            | undefined              | Callback function when container is clicked |
| `style`           | React.CSSProperties | {}                     | Additional inline styles                    |
| `children`        | React.ReactNode     | "Sample Div Component" | Content inside the container                |

### Button

A versatile button component with different variants and sizes.

```tsx
import { Button } from "@lens-quick-widgets/ui"

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>

// With sizes
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>

// Other props
<Button disabled={true}>Disabled</Button>
<Button fullWidth={true}>Full Width</Button>
<Button onClick={() => alert('Clicked!')}>With Click Handler</Button>
```

#### Props

| Prop        | Type                                  | Default   | Description                               |
| ----------- | ------------------------------------- | --------- | ----------------------------------------- |
| `variant`   | 'primary' \| 'secondary' \| 'outline' | 'primary' | Button style variant                      |
| `size`      | 'small' \| 'medium' \| 'large'        | 'medium'  | Button size                               |
| `disabled`  | boolean                               | false     | Disables the button when true             |
| `fullWidth` | boolean                               | false     | Makes button take full width of container |
| `onClick`   | function                              | undefined | Callback function when button is clicked  |
| `style`     | React.CSSProperties                   | {}        | Additional inline styles                  |
| `children`  | React.ReactNode                       | "Button"  | Button text or content                    |

### Card

A card component with optional title and footer sections.

```tsx
import { Card, Button } from "@lens-quick-widgets/ui"

// Basic usage
<Card>Card content</Card>

// With title
<Card title="Card Title">Card content</Card>

// With footer
<Card
  title="User Profile"
  footer={
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
      <Button variant="outline" size="small">Cancel</Button>
      <Button variant="primary" size="small">Save</Button>
    </div>
  }
>
  Card content
</Card>

// With elevation
<Card elevation="high">High elevation card</Card>
```

#### Props

| Prop        | Type                        | Default   | Description                            |
| ----------- | --------------------------- | --------- | -------------------------------------- |
| `title`     | string                      | undefined | Optional card title                    |
| `footer`    | React.ReactNode             | undefined | Optional footer content                |
| `elevation` | 'low' \| 'medium' \| 'high' | 'medium'  | Controls the shadow depth              |
| `onClick`   | function                    | undefined | Callback function when card is clicked |
| `style`     | React.CSSProperties         | {}        | Additional inline styles               |
| `children`  | React.ReactNode             | undefined | Card content                           |

## Development

To develop components locally with hot reloading:

```bash
# Start the UI package in watch mode
pnpm run dev:ui

# Start the web app that consumes the UI components
pnpm run dev:web
```

## Building

To build the package for distribution:

```bash
# Build the UI package
pnpm run build:ui
# or
./scripts/build-ui.ps1
```

## License

MIT
