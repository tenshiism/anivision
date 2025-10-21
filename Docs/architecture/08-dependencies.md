# Dependencies & Libraries

## Core Dependencies

### React Native & Core Libraries
```json
{
  "react": "^18.2.0",
  "react-native": "^0.72.6",
  "typescript": "^5.2.2"
}
```

### Navigation
```json
{
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/drawer": "^6.6.6",
  "@react-navigation/stack": "^6.3.20",
  "@react-navigation/bottom-tabs": "^6.5.11",
  "react-native-screens": "^3.27.0",
  "react-native-safe-area-context": "^4.7.4",
  "react-native-gesture-handler": "^2.13.4",
  "react-native-reanimated": "^3.5.4"
}
```

### State Management
```json
{
  "@reduxjs/toolkit": "^1.9.7",
  "react-redux": "^8.1.3",
  "redux-persist": "^6.0.0",
  "@react-native-async-storage/async-storage": "^1.19.5",
  "redux-persist-transform-encrypt": "^3.0.1"
}
```

### API & Networking
```json
{
  "axios": "^1.6.2",
  "axios-retry": "^3.9.1",
  "react-native-url-polyfill": "^2.0.0",
  "react-native-netinfo": "^11.2.0"
}
```

### Image Handling
```json
{
  "react-native-image-picker": "^5.7.0",
  "react-native-fast-image": "^8.6.3",
  "react-native-image-resizer": "^1.4.5",
  "react-native-vision-camera": "^3.6.12",
  "react-native-photo-viewer": "^1.2.1",
  "react-native-image-zoom-viewer": "^3.0.1"
}
```

### File System & Storage
```json
{
  "react-native-fs": "^2.20.0",
  "react-native-sqlite-storage": "^6.0.1",
  "react-native-mmkv": "^2.11.0",
  "react-native-blob-util": "^0.19.6"
}
```

### UI Components & Styling
```json
{
  "react-native-elements": "^3.4.3",
  "react-native-vector-icons": "^10.0.2",
  "react-native-svg": "^14.0.0",
  "react-native-linear-gradient": "^2.8.3",
  "react-native-modal": "^13.0.1",
  "react-native-dropdown-picker": "^5.4.6",
  "react-native-skeleton-placeholder": "^5.2.4"
}
```

### Forms & Input
```json
{
  "react-hook-form": "^7.48.2",
  "react-native-keyboard-aware-scroll-view": "^0.9.5",
  "react-native-masked-text": "^1.13.0"
}
```

### Animations
```json
{
  "lottie-react-native": "^6.4.1",
  "react-native-animatable": "^1.4.0"
}
```

### Utilities
```json
{
  "react-native-uuid": "^2.0.1",
  "date-fns": "^2.30.0",
  "lodash": "^4.17.21",
  "react-native-device-info": "^10.12.0",
  "react-native-permissions": "^4.0.1",
  "react-native-geolocation-service": "^5.3.1"
}
```

### Security
```json
{
  "react-native-keychain": "^8.1.2",
  "react-native-crypto-js": "^1.0.0",
  "react-native-biometrics": "^3.0.1"
}
```

## Development Dependencies

### TypeScript & Linting
```json
{
  "@types/react": "^18.2.45",
  "@types/react-native": "^0.72.8",
  "@typescript-eslint/eslint-plugin": "^6.14.0",
  "@typescript-eslint/parser": "^6.14.0",
  "eslint": "^8.55.0",
  "eslint-config-prettier": "^9.1.0",
  "eslint-plugin-react": "^7.33.2",
  "eslint-plugin-react-hooks": "^4.6.0",
  "prettier": "^3.1.1"
}
```

### Testing
```json
{
  "jest": "^29.7.0",
  "@testing-library/react-native": "^12.4.1",
  "@testing-library/jest-native": "^5.4.3",
  "detox": "^20.14.7",
  "jest-circus": "^29.7.0",
  "metro-react-native-babel-preset": "^0.77.0"
}
```

### Build Tools
```json
{
  "react-native-flipper": "^0.212.0",
  "react-native-dotenv": "^3.4.9",
  "patch-package": "^8.0.0",
  "react-native-clean-project": "^4.0.1"
}
```

## Platform-Specific Dependencies

### iOS Dependencies (Podfile)
```ruby
platform :ios, '13.0'

pod 'Firebase/Analytics'
pod 'Firebase/Crashlytics'
pod 'GoogleMLKit/BarcodeScanning'
pod 'GoogleMLKit/ImageLabeling'
```

### Android Dependencies (build.gradle)
```gradle
dependencies {
    implementation 'com.google.mlkit:image-labeling:17.0.7'
    implementation 'com.google.firebase:firebase-analytics:21.5.0'
    implementation 'com.google.firebase:firebase-crashlytics:18.6.0'
}
```

## Version Management Strategy

### Package Update Policy
```typescript
enum UpdateFrequency {
  IMMEDIATE = 'security-patches',      // Apply immediately
  WEEKLY = 'patch-versions',          // Weekly updates
  BIWEEKLY = 'minor-versions',       // Every 2 weeks
  MONTHLY = 'major-versions',        // Monthly review
  QUARTERLY = 'breaking-changes'     // Quarterly planning
}
```

### Dependency Audit Process
```bash
# Weekly security audit
npm audit
npm audit fix

# Monthly dependency review
npm outdated
npx npm-check-updates

# Quarterly major update planning
npx npm-check-updates -u --target minor
```

## Bundle Size Optimization

### Current Bundle Analysis
```
┌─────────────────────────────────────┐
│ Android APK: ~45MB                  │
│ ├── Base: 15MB                      │
│ ├── Libraries: 20MB                 │
│ └── Assets: 10MB                    │
├─────────────────────────────────────┤
│ iOS IPA: ~50MB                      │
│ ├── Base: 18MB                      │
│ ├── Libraries: 22MB                 │
│ └── Assets: 10MB                    │
└─────────────────────────────────────┘
```

### Optimization Strategies
```javascript
// Metro configuration for optimization
module.exports = {
  transformer: {
    minifierConfig: {
      keep_fnames: false,
      mangle: {
        keep_fnames: false,
      },
      compress: {
        drop_console: true,
      },
    },
  },
};
```

## Dependency Conflicts Resolution

### Common Conflicts & Solutions
```json
{
  "overrides": {
    "react-native-svg": {
      "react-native": "^0.72.0"
    }
  },
  "resolutions": {
    "**/react-native": "0.72.6",
    "**/metro": "0.76.8"
  }
}
```

## Native Module Requirements

### Camera & Permissions
- iOS: Camera usage description in Info.plist
- Android: Camera permissions in AndroidManifest.xml

### File System Access
- iOS: Photo Library usage description
- Android: READ_EXTERNAL_STORAGE, WRITE_EXTERNAL_STORAGE

### Location Services
- iOS: Location usage descriptions
- Android: ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION

## Performance Dependencies

### Code Splitting
```json
{
  "react-native-bundle-splitter": "^2.3.0",
  "metro-code-split": "^0.1.0"
}
```

### Memory Management
```json
{
  "react-native-super-grid": "^5.0.0",
  "recyclerlistview": "^4.2.0"
}
```

## API Client Dependencies

### OpenAI Integration
```typescript
// Custom implementation, no official SDK
interface OpenAIConfig {
  baseURL: string;
  apiKey: string;
  timeout: number;
  maxRetries: number;
}
```

## Monitoring & Analytics

### Crash Reporting
```json
{
  "@sentry/react-native": "^5.15.1",
  "react-native-firebase": "^5.6.0"
}
```

### Performance Monitoring
```json
{
  "react-native-performance": "^5.1.0",
  "flipper-plugin-react-native-performance": "^0.4.0"
}
```

## License Compatibility

### License Check Results
```
✓ MIT: 85% of dependencies
✓ Apache-2.0: 10% of dependencies
✓ BSD: 3% of dependencies
✓ ISC: 2% of dependencies

⚠ No GPL licensed packages (avoiding license conflicts)
```

## Dependency Update Checklist

### Before Updating
- [ ] Check changelog for breaking changes
- [ ] Review GitHub issues for known problems
- [ ] Test in development environment
- [ ] Run full test suite
- [ ] Check bundle size impact
- [ ] Verify iOS and Android builds

### After Updating
- [ ] Update documentation
- [ ] Notify team of changes
- [ ] Monitor crash reports
- [ ] Track performance metrics
- [ ] Update CI/CD configurations

## Alternative Libraries

### Fallback Options
```typescript
const alternatives = {
  imageProcessing: {
    primary: 'react-native-image-resizer',
    fallback: 'react-native-image-crop-picker'
  },
  storage: {
    primary: 'react-native-mmkv',
    fallback: '@react-native-async-storage/async-storage'
  },
  camera: {
    primary: 'react-native-vision-camera',
    fallback: 'react-native-camera'
  }
};
```

## Deprecated Dependencies to Remove

### Migration Plan
```
react-native-camera → react-native-vision-camera (Q1 2024)
react-native-splash-screen → react-native-bootsplash (Q2 2024)
react-native-firebase v5 → @react-native-firebase/* (Q1 2024)