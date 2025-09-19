# Images Directory

This directory contains all image assets for the PerCLI React Native application.

## Organization

- **icons/** - App icons and small graphics
- **logos/** - Company and app logos
- **backgrounds/** - Background images
- **illustrations/** - Custom illustrations and graphics

## Supported Formats

- PNG (recommended for images with transparency)
- JPG/JPEG (recommended for photos)
- SVG (for vector graphics)
- WebP (for optimized web images)

## Naming Convention

Use descriptive, lowercase names with hyphens:
- `app-logo.png`
- `login-background.jpg`
- `user-avatar-placeholder.png`
- `icon-settings.svg`

## Resolution Guidelines

For React Native, consider providing multiple resolutions:
- `image.png` (1x)
- `image@2x.png` (2x for high-density screens)
- `image@3x.png` (3x for highest density screens)

## Usage Example

```typescript
import { Image } from 'react-native';

// For require() method
<Image source={require('./src/assets/images/logo.png')} />

// For URI method (remote images)
<Image source={{ uri: 'https://example.com/image.png' }} />
```