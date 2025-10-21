# Component Structure

## Overview
AniVision follows atomic design principles with a hierarchical component structure. Each component has clearly defined responsibilities and is designed for reusability, testability, and maintainability.

## Component Hierarchy

### Atoms (Basic Building Blocks)
```
┌─────────────────────────────────────┐
│              ATOMS                  │
├─────────────────────────────────────┤
│ • Button                            │
│ • Text                              │
│ • Icon                              │
│ • Image                             │
│ • Input                             │
│ • Loader                            │
│ • Spacer                            │
│ • Divider                           │
└─────────────────────────────────────┘
```

### Molecules (Simple Combinations)
```
┌─────────────────────────────────────┐
│            MOLECULES                │
├─────────────────────────────────────┤
│ • IconButton                       │
│ • SearchInput                       │
│ • ImageCard                         │
│ • LoadingIndicator                  │
│ • ErrorDisplay                      │
│ • Badge                             │
│ • Tag                               │
│ • ProgressBar                       │
└─────────────────────────────────────┘
```

### Organisms (Complex Components)
```
┌─────────────────────────────────────┐
│            ORGANISMS                │
├─────────────────────────────────────┤
│ • HeaderBar                         │
│ • NavigationDrawer                  │
│ • ImageGrid                         │
│ • SpeciesCard                       │
│ • SettingsForm                      │
│ • ImagePreview                      │
│ • ScanButton                        │
│ • ResultPanel                       │
└─────────────────────────────────────┘
```

### Templates (Layout Components)
```
┌─────────────────────────────────────┐
│            TEMPLATES                │
├─────────────────────────────────────┤
│ • ScreenLayout                      │
│ • ModalLayout                       │
│ • FormLayout                        │
│ • ListLayout                        │
│ • GalleryLayout                     │
└─────────────────────────────────────┘
```

### Pages (Screen Components)
```
┌─────────────────────────────────────┐
│              PAGES                  │
├─────────────────────────────────────┤
│ • WelcomeScreen                     │
│ • HomeScreen                        │
│ • ImageDetailScreen                 │
│ • SettingsScreen                    │
│ • CameraScreen                      │
│ • GalleryScreen                     │
└─────────────────────────────────────┘
```

## Core Components Detail

### 1. WelcomeScreen
**Purpose**: Initial app landing page with navigation to main features
**Responsibilities**:
- Display welcome message and app branding
- Provide quick access to camera/gallery
- Show settings drawer trigger
- Handle first-time user onboarding

**Props**:
```typescript
interface WelcomeScreenProps {
  onNavigateToCamera: () => void;
  onNavigateToGallery: () => void;
  onOpenSettings: () => void;
  isFirstLaunch: boolean;
}
```

**State**:
- Loading state for initial setup
- User preferences (if any)
- Animation states

### 2. NavigationDrawer
**Purpose**: Slide-out drawer for app settings and navigation
**Responsibilities**:
- Provide access to settings screen
- Display app version and information
- Handle drawer open/close animations
- Manage navigation state

**Props**:
```typescript
interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
  apiConfig: APIConfig;
}
```

**State**:
- Drawer open/close state
- Settings form data
- Validation errors

### 3. ImageGrid
**Purpose**: Display collection of identified images in a grid layout
**Responsibilities**:
- Render images in responsive grid
- Handle image loading states
- Support pull-to-refresh
- Implement infinite scroll (if needed)

**Props**:
```typescript
interface ImageGridProps {
  images: IdentifiedImage[];
  onImagePress: (image: IdentifiedImage) => void;
  onRefresh: () => void;
  isLoading: boolean;
  isEmpty: boolean;
}
```

**State**:
- Grid layout dimensions
- Loading states for individual images
- Refresh state

### 4. SpeciesCard
**Purpose**: Display species identification results
**Responsibilities**:
- Show species image
- Display common and scientific names
- Present confidence score
- Show identification summary

**Props**:
```typescript
interface SpeciesCardProps {
  species: SpeciesIdentification;
  onRescan: () => void;
  onViewDetails: () => void;
  isLoading: boolean;
}
```

**State**:
- Hover/press states
- Animation states
- Error states

### 5. SettingsForm
**Purpose**: Configuration form for API settings
**Responsibilities**:
- Manage OpenAI API URL and key inputs
- Validate API configuration
- Save settings to local storage
- Test API connectivity

**Props**:
```typescript
interface SettingsFormProps {
  config: APIConfig;
  onSave: (config: APIConfig) => void;
  onTest: (config: APIConfig) => Promise<boolean>;
  isLoading: boolean;
}
```

**State**:
- Form data
- Validation errors
- Test connection state

### 6. ImagePreview
**Purpose**: Full-screen image viewer with zoom and pan
**Responsibilities**:
- Display high-resolution image
- Support zoom and pan gestures
- Show image metadata
- Handle sharing and deletion

**Props**:
```typescript
interface ImagePreviewProps {
  imageUri: string;
  metadata: ImageMetadata;
  onClose: () => void;
  onShare: () => void;
  onDelete: () => void;
}
```

**State**:
- Zoom level
- Pan position
- Loading state
- Gesture states

### 7. ScanButton
**Purpose**: Prominent button for initiating species scanning
**Responsibilities**:
- Trigger camera or gallery selection
- Show scanning progress
- Handle scan state changes
- Provide visual feedback

**Props**:
```typescript
interface ScanButtonProps {
  onScan: (source: 'camera' | 'gallery') => void;
  isScanning: boolean;
  disabled: boolean;
}
```

**State**:
- Press animation state
- Scanning progress
- Error state

### 8. ResultPanel
**Purpose**: Display detailed scan results
**Responsibilities**:
- Show AI-generated summary
- Display species details
- Present confidence metrics
- Offer rescan options

**Props**:
```typescript
interface ResultPanelProps {
  result: ScanResult;
  onRescan: () => void;
  onSave: () => void;
  onShare: () => void;
}
```

**State**:
- Expanded/collapsed state
- Loading state
- Error state

## Custom Hooks (Component Logic)

### useImagePicker
**Purpose**: Handle image selection from camera or gallery
**Returns**:
```typescript
interface UseImagePickerReturn {
  pickImage: (source: ImageSource) => Promise<void>;
  image: ImageInfo | null;
  isLoading: boolean;
  error: string | null;
  clearImage: () => void;
}
```

### useSpeciesScanner
**Purpose**: Manage species identification process
**Returns**:
```typescript
interface UseSpeciesScannerReturn {
  scanImage: (imageUri: string) => Promise<ScanResult>;
  result: ScanResult | null;
  isLoading: boolean;
  error: string | null;
  clearResult: () => void;
}
```

### useSettings
**Purpose**: Manage app settings and configuration
**Returns**:
```typescript
interface UseSettingsReturn {
  config: APIConfig;
  updateConfig: (config: Partial<APIConfig>) => void;
  saveConfig: () => Promise<void>;
  testConnection: () => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}
```

### useImageStorage
**Purpose**: Handle local image storage and retrieval
**Returns**:
```typescript
interface UseImageStorageReturn {
  saveImage: (imageUri: string, metadata: ImageMetadata) => Promise<string>;
  getImages: () => Promise<IdentifiedImage[]>;
  deleteImage: (imageId: string) => Promise<void>;
  organizeImages: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}
```

## Component Communication Patterns

### 1. Parent-Child Communication
- **Props Down**: Parent passes data and callbacks to children
- **Events Up**: Children trigger callbacks to notify parents
- **Context**: Shared state through React Context for deep component trees

### 2. Sibling Communication
- **State Lifting**: Common state managed by parent component
- **Event Bus**: Custom event emitters for cross-component communication
- **Global State**: Redux for application-wide state management

### 3. Cross-Screen Communication
- **Navigation Params**: Pass data between screens via navigation
- **Global State**: Redux store for shared application state
- **Async Storage**: Persistent data sharing across app restarts

## Component Styling Strategy

### 1. Styled Components
- Component-scoped styles
- Theme-based styling system
- Dynamic styling based on props
- Responsive design support

### 2. Theme System
```typescript
interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    error: string;
    success: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    h1: TextStyle;
    h2: TextStyle;
    body: TextStyle;
    caption: TextStyle;
  };
  borderRadius: {
    small: number;
    medium: number;
    large: number;
  };
}
```

### 3. Responsive Design
- Breakpoint-based layouts
- Flexible grid systems
- Device-specific adaptations
- Orientation handling

## Component Testing Strategy

### 1. Unit Testing
- Component rendering tests
- Prop validation tests
- Event handling tests
- State management tests

### 2. Integration Testing
- Component interaction tests
- Navigation flow tests
- Data flow tests
- API integration tests

### 3. Visual Testing
- Screenshot testing
- Visual regression testing
- Component library documentation
- Storybook integration

## Component Performance Optimization

### 1. Rendering Optimization
- React.memo for component memoization
- useMemo for expensive calculations
- useCallback for stable function references
- Virtual lists for large datasets

### 2. Image Optimization
- Lazy loading for images
- Image compression and caching
- Progressive image loading
- Memory-efficient image handling

### 3. Animation Performance
- Native driver usage
- 60fps animations
- Gesture-based interactions
- Smooth transitions

## Component Accessibility

### 1. Screen Reader Support
- Accessibility labels and hints
- Semantic component structure
- Focus management
- Reading order optimization

### 2. Visual Accessibility
- High contrast support
- Font scaling support
- Color blindness considerations
- Touch target sizing

### 3. Motor Accessibility
- Large touch targets
- Voice control support
- Switch navigation support
- Gesture alternatives

## Component Documentation

### 1. Prop Documentation
- TypeScript interfaces for props
- JSDoc comments for complex props
- Default value documentation
- Usage examples

### 2. Storybook Integration
- Component showcase
- Interactive examples
- State variations
- Design system documentation

### 3. Usage Guidelines
- Best practices documentation
- Anti-patterns to avoid
- Performance considerations
- Migration guides