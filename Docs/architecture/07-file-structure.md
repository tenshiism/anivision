# File Structure Organization

## Overview
AniVision follows a scalable, maintainable file structure that supports rapid development, easy testing, and clear separation of concerns. The structure is organized by feature and functionality, following React Native and TypeScript best practices.

## Root Directory Structure

```
anivision/
├── android/                    # Android-specific code and configuration
├── ios/                        # iOS-specific code and configuration
├── src/                        # Main application source code
├── __tests__/                  # Test files and test utilities
├── docs/                       # Documentation and architecture
├── assets/                     # Static assets (images, fonts, etc.)
├── scripts/                    # Build and deployment scripts
├── .github/                    # GitHub workflows and templates
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── babel.config.js             # Babel configuration
├── metro.config.js             # Metro bundler configuration
├── .eslintrc.js                # ESLint configuration
├── .prettierrc                 # Prettier configuration
└── README.md                   # Project documentation
```

## Source Code Structure

### Main Source Directory (`src/`)
```
src/
├── components/                 # Reusable UI components
├── screens/                    # Screen components
├── navigation/                 # Navigation configuration
├── services/                   # Business logic and API services
├── store/                      # Redux store and state management
├── hooks/                      # Custom React hooks
├── utils/                      # Utility functions and helpers
├── types/                      # TypeScript type definitions
├── constants/                  # Application constants
├── theme/                      # Theme and styling configuration
└── App.tsx                     # Main application entry point
```

### Components Directory (`src/components/`)
```
components/
├── atoms/                      # Basic UI elements
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.styles.ts
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   ├── Text/
│   ├── Icon/
│   ├── Image/
│   ├── Input/
│   ├── Loader/
│   └── index.ts
├── molecules/                  # Simple component combinations
│   ├── IconButton/
│   ├── SearchInput/
│   ├── ImageCard/
│   ├── LoadingIndicator/
│   ├── ErrorDisplay/
│   └── index.ts
├── organisms/                  # Complex components
│   ├── HeaderBar/
│   ├── NavigationDrawer/
│   ├── ImageGrid/
│   ├── SpeciesCard/
│   ├── SettingsForm/
│   ├── ImagePreview/
│   ├── ScanButton/
│   ├── ResultPanel/
│   └── index.ts
├── templates/                  # Layout components
│   ├── ScreenLayout/
│   ├── ModalLayout/
│   ├── FormLayout/
│   ├── ListLayout/
│   ├── GalleryLayout/
│   └── index.ts
└── index.ts                    # Export all components
```

### Screens Directory (`src/screens/`)
```
screens/
├── WelcomeScreen/
│   ├── WelcomeScreen.tsx
│   ├── WelcomeScreen.styles.ts
│   ├── WelcomeScreen.test.tsx
│   └── index.ts
├── HomeScreen/
├── CameraScreen/
├── GalleryScreen/
├── ImageDetailScreen/
├── SettingsScreen/
├── AboutScreen/
└── index.ts
```

### Navigation Directory (`src/navigation/`)
```
navigation/
├── AppNavigator.tsx            # Root navigator
├── AuthNavigator.tsx           # Authentication flow
├── MainNavigator.tsx           # Main app navigation
├── DrawerNavigator.tsx         # Side drawer navigation
├── StackNavigator.tsx          # Stack navigation
├── TabNavigator.tsx            # Tab navigation
├── types.ts                    # Navigation type definitions
└── index.ts
```

### Services Directory (`src/services/`)
```
services/
├── api/                        # API-related services
│   ├── OpenAIService.ts
│   ├── ApiClient.ts
│   ├── ApiTypes.ts
│   └── index.ts
├── storage/                    # Storage services
│   ├── ImageStorageService.ts
│   ├── MetadataService.ts
│   ├── CacheService.ts
│   └── index.ts
├── image/                      # Image processing services
│   ├── ImageProcessor.ts
│   ├── ThumbnailGenerator.ts
│   ├── ImageOptimizer.ts
│   └── index.ts
├── device/                     # Device-specific services
│   ├── DeviceInfoService.ts
│   ├── PermissionService.ts
│   ├── NetworkService.ts
│   └── index.ts
└── index.ts
```

### Store Directory (`src/store/`)
```
store/
├── index.ts                    # Store configuration
├── rootReducer.ts              # Root reducer
├── middleware.ts               # Custom middleware
├── slices/                     # Redux Toolkit slices
│   ├── settingsSlice.ts
│   ├── uiSlice.ts
│   ├── navigationSlice.ts
│   ├── cacheSlice.ts
│   └── index.ts
└── selectors/                  # Redux selectors
    ├── settingsSelectors.ts
    ├── uiSelectors.ts
    ├── navigationSelectors.ts
    ├── cacheSelectors.ts
    └── index.ts
```

### Hooks Directory (`src/hooks/`)
```
hooks/
├── useImagePicker.ts           # Image selection hook
├── useSpeciesScanner.ts        # Species scanning hook
├── useSettings.ts              # Settings management hook
├── useImageStorage.ts          # Image storage hook
├── useNetworkStatus.ts         # Network status hook
├── usePermissions.ts           # Permission management hook
├── useDebounce.ts              # Debounce utility hook
├── useThrottle.ts              # Throttle utility hook
└── index.ts
```

### Utils Directory (`src/utils/`)
```
utils/
├── dateUtils.ts                # Date manipulation utilities
├── fileUtils.ts                # File system utilities
├── imageUtils.ts               # Image processing utilities
├── validationUtils.ts          # Form validation utilities
├── formatUtils.ts              # Data formatting utilities
├── errorUtils.ts               # Error handling utilities
├── constants.ts                # General constants
└── index.ts
```

### Types Directory (`src/types/`)
```
types/
├── api.ts                      # API-related types
├── image.ts                    # Image-related types
├── navigation.ts               # Navigation types
├── storage.ts                  # Storage types
├── ui.ts                       # UI component types
├── common.ts                   # Common utility types
└── index.ts
```

### Theme Directory (`src/theme/`)
```
theme/
├── index.ts                    # Theme export
├── colors.ts                   # Color definitions
├── typography.ts               # Typography configuration
├── spacing.ts                  # Spacing constants
├── shadows.ts                  # Shadow definitions
├── borderRadius.ts             # Border radius values
└── breakpoints.ts              # Responsive breakpoints
```

## Test Structure

### Test Directory (`__tests__/`)
```
__tests__/
├── components/                 # Component tests
├── screens/                    # Screen tests
├── services/                   # Service tests
├── hooks/                      # Hook tests
├── utils/                      # Utility tests
├── fixtures/                   # Test fixtures and mocks
│   ├── images/
│   ├── apiResponses/
│   └── data/
├── helpers/                    # Test helper functions
└── setup.ts                    # Test setup configuration
```

### Test File Naming Convention
- Component tests: `ComponentName.test.tsx`
- Hook tests: `useHookName.test.ts`
- Service tests: `ServiceName.test.ts`
- Util tests: `utilName.test.ts`

## Asset Structure

### Assets Directory (`assets/`)
```
assets/
├── images/                     # Image assets
│   ├── icons/                  # App icons
│   ├── illustrations/          # Illustration graphics
│   ├── placeholders/           # Placeholder images
│   └── logos/                  # Logo files
├── fonts/                      # Font files
│   ├── Roboto-Regular.ttf
│   ├── Roboto-Bold.ttf
│   ├── Roboto-Italic.ttf
│   └── custom-icons.ttf
├── animations/                 # Animation files
│   ├── loading/
│   ├── transitions/
│   └── gestures/
└── sounds/                     # Sound effects (if needed)
    ├── camera-shutter.wav
    ├── success.wav
    └── error.wav
```

## Configuration Files

### Package.json Structure
```json
{
  "name": "anivision",
  "version": "1.0.0",
  "scripts": {
    "start": "react-native start",
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "build:android": "cd android && ./gradlew assembleRelease",
    "build:ios": "cd ios && xcodebuild -workspace AniVision.xcworkspace -scheme AniVision -configuration Release"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.72.6",
    "@reduxjs/toolkit": "^1.9.7",
    "react-redux": "^8.1.3",
    "redux-persist": "^6.0.0",
    "react-query": "^3.39.3",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "@react-navigation/drawer": "^6.6.6",
    "react-native-screens": "^3.27.0",
    "react-native-safe-area-context": "^4.7.4",
    "react-native-gesture-handler": "^2.13.4",
    "react-native-reanimated": "^3.5.4",
    "react-native-vector-icons": "^10.0.0",
    "react-native-elements": "^3.4.3",
    "react-native-image-picker": "^5.6.0",
    "react-native-fast-image": "^8.6.3",
    "react-native-fs": "^2.20.0",
    "react-native-async-storage": "^1.19.5",
    "react-native-netinfo": "^9.4.1",
    "axios": "^1.5.1",
    "styled-components": "^6.0.8"
  },
  "devDependencies": {
    "@types/react": "^18.2.31",
    "@types/react-native": "^0.72.6",
    "@types/jest": "^29.5.6",
    "@types/styled-components": "^5.1.29",
    "typescript": "^5.2.2",
    "jest": "^29.7.0",
    "eslint": "^8.51.0",
    "prettier": "^3.0.3",
    "@testing-library/react-native": "^12.4.2",
    "react-test-renderer": "18.2.0"
  }
}
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "es2017",
    "lib": ["es2017", "dom"],
    "allowSyntheticDefaultImports": true,
    "jsx": "react-native",
    "module": "esnext",
    "moduleResolution": "node",
    "noEmit": true,
    "isolatedModules": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "allowUnusedLabels": false,
    "allowUnreachableCode": false,
    "exactOptionalPropertyTypes": true,
    "baseUrl": "./src",
    "paths": {
      "@components/*": ["components/*"],
      "@screens/*": ["screens/*"],
      "@services/*": ["services/*"],
      "@store/*": ["store/*"],
      "@hooks/*": ["hooks/*"],
      "@utils/*": ["utils/*"],
      "@types/*": ["types/*"],
      "@theme/*": ["theme/*"],
      "@constants/*": ["constants/*"]
    }
  },
  "include": [
    "src/**/*",
    "__tests__/**/*"
  ],
  "exclude": [
    "node_modules",
    "android",
    "ios"
  ]
}
```

## Platform-Specific Structure

### Android Structure (`android/`)
```
android/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/anivision/
│   │       │   ├── MainActivity.java
│   │       │   ├── MainApplication.java
│   │       │   └── packages/
│   │       │       └── anivision/
│   │       │           └── AniVisionPackage.java
│   │       ├── res/
│   │       │   ├── drawable/
│   │       │   ├── layout/
│   │       │   ├── values/
│   │       │   └── mipmap/
│   │       └── AndroidManifest.xml
│   └── build.gradle
├── gradle/
├── build.gradle
├── gradle.properties
└── settings.gradle
```

### iOS Structure (`ios/`)
```
ios/
├── AniVision/
│   ├── AppDelegate.h
│   ├── AppDelegate.m
│   ├── main.m
│   └── Info.plist
├── AniVision.xcodeproj/
├── AniVision.xcworkspace/
├── Podfile
├── Podfile.lock
└── build/
```

## Build and Deployment Scripts

### Scripts Directory (`scripts/`)
```
scripts/
├── build.sh                    # Build script for CI/CD
├── deploy.sh                   # Deployment script
├── test.sh                     # Test runner script
├── lint.sh                     # Linting script
├── setup.sh                    # Development setup script
└── clean.sh                    # Cleanup script
```

### Build Script Example
```bash
#!/bin/bash
# scripts/build.sh

set -e

echo "Starting AniVision build process..."

# Clean previous builds
echo "Cleaning previous builds..."
npm run clean

# Type checking
echo "Running type check..."
npm run type-check

# Linting
echo "Running linter..."
npm run lint

# Tests
echo "Running tests..."
npm run test:coverage

# Build for Android
if [ "$1" = "android" ] || [ "$1" = "all" ]; then
    echo "Building for Android..."
    npm run build:android
fi

# Build for iOS
if [ "$1" = "ios" ] || [ "$1" = "all" ]; then
    echo "Building for iOS..."
    npm run build:ios
fi

echo "Build process completed successfully!"
```

## Documentation Structure

### Documentation Directory (`docs/`)
```
docs/
├── architecture/               # Architecture documentation
│   ├── README.md
│   ├── 01-system-architecture.md
│   ├── 02-component-structure.md
│   ├── 03-data-flow-state.md
│   ├── 04-api-integration.md
│   ├── 05-image-storage.md
│   ├── 06-ui-ux-design.md
│   ├── 07-file-structure.md
│   ├── 08-dependencies.md
│   ├── 09-implementation-roadmap.md
│   └── 10-error-handling.md
├── api/                        # API documentation
├── user-guide/                 # User guide documentation
├── developer-guide/            # Developer guide
└── README.md                   # Documentation index
```

## Naming Conventions

### File Naming
- **Components**: PascalCase (e.g., `ImageCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useImagePicker.ts`)
- **Services**: PascalCase (e.g., `ImageStorageService.ts`)
- **Utils**: camelCase (e.g., `dateUtils.ts`)
- **Types**: camelCase (e.g., `apiTypes.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_CONSTANTS.ts`)

### Directory Naming
- **Features**: kebab-case (e.g., `image-gallery/`)
- **Components**: PascalCase (e.g., `ImageCard/`)
- **Tests**: Same as source file with `.test` suffix

### Import/Export Conventions
```typescript
// Named exports for utilities
export const formatDate = (date: Date): string => { ... };
export const validateEmail = (email: string): boolean => { ... };

// Default export for components/hooks/services
export default ImageCard;

// Barrel exports for directories
export { default as Button } from './Button';
export { default as Text } from './Text';
export { default as Icon } from './Icon';
```

## Code Organization Principles

### 1. Colocation
- Keep related files together
- Test files next to source files
- Styles files with component files
- Types files with feature files

### 2. Separation of Concerns
- UI components separate from business logic
- Services separate from state management
- Types separate from implementation
- Tests separate from production code

### 3. Scalability
- Feature-based organization
- Modular structure
- Clear dependency hierarchy
- Minimal coupling between modules

### 4. Maintainability
- Consistent naming conventions
- Clear file structure
- Comprehensive documentation
- Standardized patterns

## Import Path Aliases

### TypeScript Path Mapping
```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@components/*": ["components/*"],
      "@screens/*": ["screens/*"],
      "@services/*": ["services/*"],
      "@store/*": ["store/*"],
      "@hooks/*": ["hooks/*"],
      "@utils/*": ["utils/*"],
      "@types/*": ["types/*"],
      "@theme/*": ["theme/*"],
      "@constants/*": ["constants/*"]
    }
  }
}
```

### Usage Examples
```typescript
// Instead of: import Button from '../../../components/atoms/Button';
import { Button } from '@components';

// Instead of: import useImagePicker from '../../hooks/useImagePicker';
import { useImagePicker } from '@hooks';

// Instead of: import { API_CONFIG } from '../../constants/api';
import { API_CONFIG } from '@constants';
```

## File Size and Complexity Guidelines

### File Size Limits
- **Components**: Maximum 300 lines
- **Services**: Maximum 500 lines
- **Hooks**: Maximum 200 lines
- **Utils**: Maximum 150 lines
- **Types**: Maximum 200 lines

### Complexity Guidelines
- **Cyclomatic Complexity**: Maximum 10 per function
- **Parameter Count**: Maximum 5 parameters per function
- **Nesting Level**: Maximum 3 levels deep
- **Import Count**: Maximum 15 imports per file

## Refactoring Guidelines

### When to Split Files
- File exceeds size limits
- Component has multiple unrelated responsibilities
- Service handles different domains
- Hook manages multiple concerns
- Types become too numerous

### When to Combine Files
- Small, related components
- Simple utility functions
- Closely related types
- Shared constants
- Test fixtures

This file structure provides a solid foundation for the AniVision application, ensuring scalability, maintainability, and developer productivity throughout the development lifecycle.