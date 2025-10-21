# AniVision - Next Steps Guide

This document provides step-by-step instructions to complete the AniVision implementation.

---

## 🚀 Quick Start (For New Developers)

### 1. Prerequisites
- Node.js 16+ installed
- React Native environment set up ([guide](https://reactnative.dev/docs/environment-setup))
- iOS: Xcode and CocoaPods
- Android: Android Studio and SDK

### 2. Initial Setup
```bash
# Clone/Navigate to project
cd anivision

# Install dependencies
npm install

# iOS only
cd ios && pod install && cd ..

# Start Metro bundler
npm start
```

---

## 📝 Remaining Implementation Tasks

### TASK 1: Complete Redux Store (Priority: HIGH)

**Location**: `src/store/`

**Files to Create**:

1. **`src/store/slices/settingsSlice.ts`**
```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { APIConfig } from '@types/api';
import { DEFAULT_API_CONFIG } from '@constants';

interface SettingsState {
  apiConfig: APIConfig;
  isConfigured: boolean;
}

const initialState: SettingsState = {
  apiConfig: DEFAULT_API_CONFIG,
  isConfigured: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateApiConfig: (state, action: PayloadAction<Partial<APIConfig>>) => {
      state.apiConfig = { ...state.apiConfig, ...action.payload };
      state.isConfigured = !!(state.apiConfig.apiKey && state.apiConfig.url);
    },
    resetSettings: (state) => {
      state.apiConfig = DEFAULT_API_CONFIG;
      state.isConfigured = false;
    },
  },
});

export const { updateApiConfig, resetSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
```

2. **`src/store/slices/uiSlice.ts`** - UI state management
3. **`src/store/slices/cacheSlice.ts`** - Cache management
4. **`src/store/rootReducer.ts`** - Combine all reducers
5. **`src/store/index.ts`** - Configure store with Redux Persist

**Reference**: `/Docs/architecture/03-data-flow-state.md`

---

### TASK 2: Implement Storage Services (Priority: HIGH)

**Location**: `src/services/storage/`

**Key Requirement**: Images must be named after the main species identified

**Files to Create**:

1. **`src/services/storage/ImageStorageService.ts`**
```typescript
import RNFS from 'react-native-fs';
import { ImageMetadata } from '@types/image';
import { STORAGE_PATHS, FILE_NAMING } from '@constants';
import { createFileNameFromSpecies } from '@utils';

export class ImageStorageService {
  private basePath = `${RNFS.DocumentDirectoryPath}/${STORAGE_PATHS.IMAGES}`;

  async saveImage(uri: string, metadata: ImageMetadata): Promise<string> {
    // Create directory if needed
    await RNFS.mkdir(this.basePath);

    // Create filename from scientific name
    const fileName = createFileNameFromSpecies(
      metadata.species.species.scientificName,
      metadata.timestamp
    );
    const filePath = `${this.basePath}/${fileName}${FILE_NAMING.EXTENSION}`;

    // Copy image to app storage
    await RNFS.copyFile(uri, filePath);

    return filePath;
  }

  async deleteImage(filePath: string): Promise<void> {
    if (await RNFS.exists(filePath)) {
      await RNFS.unlink(filePath);
    }
  }

  async listImages(): Promise<string[]> {
    if (!(await RNFS.exists(this.basePath))) {
      return [];
    }
    return await RNFS.readDir(this.basePath);
  }
}
```

2. **`src/services/storage/MetadataService.ts`** - SQLite database
3. **`src/services/storage/CacheService.ts`** - Response caching

**Reference**: `/Docs/architecture/05-image-storage.md`

---

### TASK 3: Implement Image Processing Services (Priority: HIGH)

**Location**: `src/services/image/`

**Files to Create**:

1. **`src/services/image/ImageProcessor.ts`**
```typescript
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import { IMAGE_PROCESSING } from '@constants';

export class ImageProcessor {
  static async prepareForAPI(uri: string): Promise<string> {
    // Resize image
    const resized = await ImageResizer.createResizedImage(
      uri,
      IMAGE_PROCESSING.MAX_SIZE,
      IMAGE_PROCESSING.MAX_SIZE,
      'JPEG',
      IMAGE_PROCESSING.QUALITY * 100
    );

    // Convert to base64
    const base64 = await RNFS.readFile(resized.uri, 'base64');
    return `data:image/jpeg;base64,${base64}`;
  }

  static async createThumbnail(uri: string): Promise<string> {
    const thumbnail = await ImageResizer.createResizedImage(
      uri,
      IMAGE_PROCESSING.THUMBNAIL_SIZE,
      IMAGE_PROCESSING.THUMBNAIL_SIZE,
      'JPEG',
      70
    );
    return thumbnail.uri;
  }
}
```

**Reference**: `/Docs/architecture/04-api-integration.md` (Image Preparation section)

---

### TASK 4: Complete ImageDetailScreen (Priority: HIGH)

**Location**: `src/screens/ImageDetailScreen/`

**Requirements** (from `requirements.md`):
- One sentence AI summary
- Scientific and common names
- Re-scan button
- Additional species details

**Files to Create**:

1. **`ImageDetailScreen.tsx`**
```typescript
import React from 'react';
import { View, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@types/navigation';
import { ScreenLayout } from '@components/templates';
import { Text, Button, Image } from '@components/atoms';
import { SpeciesCard } from '@components/organisms';

type ImageDetailScreenProps = {
  route: RouteProp<RootStackParamList, 'ImageDetail'>;
};

export const ImageDetailScreen: React.FC<ImageDetailScreenProps> = ({ route }) => {
  const { image } = route.params;

  const handleRescan = () => {
    // TODO: Implement rescan logic
  };

  return (
    <ScreenLayout title="Species Details">
      <ScrollView>
        <Image source={{ uri: image.uri }} style={{ width: '100%', height: 300 }} />

        {/* One sentence AI summary */}
        <View style={{ padding: 16 }}>
          <Text variant="body">{image.species.summary}</Text>
        </View>

        {/* Scientific and common names */}
        <SpeciesCard species={image.species.species} />

        {/* Re-scan button */}
        <Button title="Re-scan Image" onPress={handleRescan} />

        {/* Additional species details */}
        {image.species.details && (
          <View style={{ padding: 16 }}>
            <Text variant="h3">Additional Details</Text>
            {image.species.details.habitat && (
              <Text>Habitat: {image.species.details.habitat}</Text>
            )}
            {image.species.details.behavior && (
              <Text>Behavior: {image.species.details.behavior}</Text>
            )}
            {image.species.details.conservation && (
              <Text>Conservation: {image.species.details.conservation}</Text>
            )}
          </View>
        )}
      </ScrollView>
    </ScreenLayout>
  );
};
```

**Reference**: `/Docs/architecture/requirements.md` line 5-11

---

### TASK 5: Complete SettingsScreen (Priority: HIGH)

**Location**: `src/screens/SettingsScreen/`

**Requirements** (from `requirements.md`):
- OpenAI API URL configuration
- API KEY configuration

**Files to Create**:

1. **`SettingsScreen.tsx`** - Use existing `SettingsForm` organism
```typescript
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ScreenLayout } from '@components/templates';
import { SettingsForm } from '@components/organisms';
import { updateApiConfig } from '@store/slices/settingsSlice';
import { OpenAIService } from '@services/api';

export const SettingsScreen: React.FC = () => {
  const dispatch = useDispatch();
  const apiConfig = useSelector(state => state.settings.apiConfig);

  const handleSave = (config) => {
    dispatch(updateApiConfig(config));
  };

  const handleTest = async (config) => {
    const service = new OpenAIService(config);
    return await service.testConnection();
  };

  return (
    <ScreenLayout title="Settings">
      <SettingsForm
        config={apiConfig}
        onSave={handleSave}
        onTest={handleTest}
      />
    </ScreenLayout>
  );
};
```

---

### TASK 6: Create App.tsx Entry Point (Priority: HIGH)

**Location**: `src/App.tsx`

**File to Create**:

```typescript
import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from 'styled-components/native';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import { AppNavigator } from './navigation';
import { lightTheme } from './theme';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={lightTheme}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </GestureHandlerRootView>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
```

---

### TASK 7: Platform Configuration (Priority: MEDIUM)

#### Android Configuration

**File**: `android/app/src/main/AndroidManifest.xml`

Add permissions:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.INTERNET" />
```

#### iOS Configuration

**File**: `ios/AniVision/Info.plist`

Add usage descriptions:
```xml
<key>NSCameraUsageDescription</key>
<string>AniVision needs camera access to photograph animals for species identification</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>AniVision needs photo library access to identify species from your images</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>AniVision needs permission to save identified animal photos</string>
```

---

### TASK 8: Integration & Testing (Priority: MEDIUM)

1. **Connect Services to UI**
   - Wire up Redux actions to components
   - Connect OpenAIService to useSpeciesScanner hook
   - Connect ImageStorageService to useImageStorage hook

2. **Test Critical Flows**
   - Welcome → Camera → Scan → Results → Save
   - Welcome → Settings → Configure API → Test
   - Gallery → View Image → Re-scan

3. **Error Handling**
   - Test network errors
   - Test invalid API key
   - Test long responses
   - Test no species found

---

## 📊 Progress Tracking

Use this checklist to track completion:

- [ ] Redux Store implemented
- [ ] Storage Services implemented
- [ ] Image Processing Services implemented
- [ ] All screens completed
- [ ] Platform configuration done
- [ ] App.tsx created
- [ ] Services integrated with UI
- [ ] Error handling tested
- [ ] App runs on Android
- [ ] App runs on iOS
- [ ] All requirements met

---

## 🔗 Quick Reference Links

- **Architecture Docs**: `/Docs/architecture/`
- **Requirements**: `/Docs/architecture/requirements.md`
- **Implementation Status**: `/IMPLEMENTATION_STATUS.md`
- **OpenSpec**: `/openspec/`
- **Package Dependencies**: `/Docs/architecture/08-dependencies.md`

---

## 💡 Tips

1. **Start with Redux Store** - Everything else depends on it
2. **Test services independently** - Create test files before integrating
3. **Use existing components** - Don't recreate what exists
4. **Follow the architecture docs** - They contain detailed implementations
5. **Check IMPLEMENTATION_STATUS.md** - Track what's done vs. what's pending

---

## 🐛 Troubleshooting

### Issue: Module not found errors
**Solution**: Check tsconfig.json path aliases and babel.config.js module resolver

### Issue: Native module errors
**Solution**: Re-run `pod install` for iOS or rebuild Android

### Issue: Redux state not persisting
**Solution**: Verify Redux Persist configuration in store/index.ts

### Issue: API calls failing
**Solution**: Check API configuration in Settings, verify API key format

---

## 📞 Support

For questions or issues:
1. Check `/Docs/architecture/` documentation
2. Review IMPLEMENTATION_STATUS.md for context
3. Consult `/Docs/architecture/11-error-handling.md` for error patterns

---

**Last Updated**: October 21, 2025
**Estimated Completion**: 3-4 weeks (1 developer) | 1-2 weeks (full team)
