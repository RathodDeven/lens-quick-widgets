# Build and prepare the UI package for distribution

# First, clean the dist directory
pnpm --filter lens-quick-widgets run clean

# Build the package
pnpm --filter lens-quick-widgets run build

# Output success message
Write-Host "UI package built successfully in the packages/ui/dist directory"
Write-Host "You can now publish it to npm or use it locally"
