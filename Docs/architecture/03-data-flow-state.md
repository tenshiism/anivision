# Data Flow & State Management

## Overview
AniVision uses a hybrid state management approach combining Redux Toolkit for global state and React Query for server state. This provides optimal performance, caching, and synchronization while maintaining predictable data flow patterns.

## State Management Architecture

### Global State (Redux Toolkit)
```
┌─────────────────────────────────────┐
│           Redux Store               │
├─────────────────────────────────────┤
│ • Settings Slice                    │
│ • UI Slice                          │
│ • Navigation Slice                  │
│ • Cache Slice                       │
└─────────────────────────────────────┘
```

### Server State (React Query)
```
┌─────────────────────────────────────┐
│         React Query Cache            │
├─────────────────────────────────────┤
│ • API Queries                       │
│ • Mutations                         │
│ • Cached Results                    │
│ • Background Updates                │
└─────────────────────────────────────┘
```

### Local State (React Components)
```
┌─────────────────────────────────────┐
│         Component State              │
├─────────────────────────────────────┤
│ • Form Data                         │
│ • UI State                          │
│ • Temporary Data                    │
│ • Animation States                  │
└─────────────────────────────────────┘
```

## Redux Store Structure

### Store Configuration
```typescript
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@redux-persist/async-storage';
import { combineReducers } from '@reduxjs/toolkit';

import settingsReducer from './slices/settingsSlice';
import uiReducer from './slices/uiSlice';
import navigationReducer from './slices/navigationSlice';
import cacheReducer from './slices/cacheSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['settings', 'cache'], // Only persist these slices
};

const rootReducer = combineReducers({
  settings: settingsReducer,
  ui: uiReducer,
  navigation: navigationReducer,
  cache: cacheReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
```

### Settings Slice
```typescript
interface SettingsState {
  apiConfig: {
    url: string;
    apiKey: string;
    model: string;
    maxTokens: number;
    temperature: number;
  };
  preferences: {
    autoSaveImages: boolean;
    imageQuality: 'low' | 'medium' | 'high';
    theme: 'light' | 'dark' | 'auto';
    language: string;
  };
  isFirstLaunch: boolean;
  lastSyncTime: number | null;
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setApiConfig: (state, action) => {
      state.apiConfig = { ...state.apiConfig, ...action.payload };
    },
    setPreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setFirstLaunchComplete: (state) => {
      state.isFirstLaunch = false;
    },
    updateLastSyncTime: (state) => {
      state.lastSyncTime = Date.now();
    },
  },
});
```

### UI Slice
```typescript
interface UIState {
  isDrawerOpen: boolean;
  isLoading: boolean;
  activeScreen: string;
  toast: {
    message: string;
    type: 'success' | 'error' | 'info';
    visible: boolean;
  } | null;
  networkStatus: 'online' | 'offline' | 'unknown';
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setActiveScreen: (state, action) => {
      state.activeScreen = action.payload;
    },
    showToast: (state, action) => {
      state.toast = action.payload;
    },
    hideToast: (state) => {
      state.toast = null;
    },
    setNetworkStatus: (state, action) => {
      state.networkStatus = action.payload;
    },
  },
});
```

### Navigation Slice
```typescript
interface NavigationState {
  stack: string[];
  params: Record<string, any>;
  canGoBack: boolean;
}

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    pushScreen: (state, action) => {
      state.stack.push(action.payload.screen);
      state.params = { ...state.params, ...action.payload.params };
      state.canGoBack = state.stack.length > 1;
    },
    popScreen: (state) => {
      state.stack.pop();
      state.canGoBack = state.stack.length > 1;
    },
    resetStack: (state, action) => {
      state.stack = [action.payload.screen];
      state.params = action.payload.params || {};
      state.canGoBack = false;
    },
  },
});
```

### Cache Slice
```typescript
interface CacheState {
  images: Record<string, CachedImage>;
  scanResults: Record<string, ScanResult>;
  lastCleanup: number;
  maxSize: number; // in bytes
  currentSize: number; // in bytes
}

interface CachedImage {
  uri: string;
  timestamp: number;
  size: number;
  metadata: ImageMetadata;
}

const cacheSlice = createSlice({
  name: 'cache',
  initialState,
  reducers: {
    cacheImage: (state, action) => {
      const { id, image } = action.payload;
      state.images[id] = image;
      state.currentSize += image.size;
    },
    removeCachedImage: (state, action) => {
      const id = action.payload;
      if (state.images[id]) {
        state.currentSize -= state.images[id].size;
        delete state.images[id];
      }
    },
    cacheScanResult: (state, action) => {
      const { imageId, result } = action.payload;
      state.scanResults[imageId] = result;
    },
    clearCache: (state) => {
      state.images = {};
      state.scanResults = {};
      state.currentSize = 0;
      state.lastCleanup = Date.now();
    },
  },
});
```

## React Query Configuration

### Query Client Setup
```typescript
import { QueryClient, QueryClientProvider } from 'react-query';
import { onlineManager } from 'react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Configure online status
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener(state => {
    setOnline(state.isConnected ?? false);
  });
});
```

### API Queries
```typescript
// Species identification query
export const useIdentifySpecies = (imageUri: string) => {
  return useQuery(
    ['identifySpecies', imageUri],
    () => OpenAIService.identifySpecies(imageUri),
    {
      enabled: !!imageUri,
      select: (data) => {
        // Process and format the response
        return processSpeciesData(data);
      },
      onError: (error) => {
        // Handle API errors
        console.error('Species identification failed:', error);
      },
    }
  );
};

// Image metadata query
export const useImageMetadata = (imageUri: string) => {
  return useQuery(
    ['imageMetadata', imageUri],
    () => ImageService.getMetadata(imageUri),
    {
      enabled: !!imageUri,
      staleTime: Infinity, // Metadata doesn't change
    }
  );
};
```

### API Mutations
```typescript
// Save image mutation
export const useSaveImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ imageUri, metadata }: SaveImageParams) => 
      ImageService.saveImage(imageUri, metadata),
    {
      onSuccess: (savedImage) => {
        // Invalidate related queries
        queryClient.invalidateQueries('savedImages');
        // Update cache
        queryClient.setQueryData(
          ['savedImage', savedImage.id],
          savedImage
        );
      },
      onError: (error) => {
        console.error('Failed to save image:', error);
      },
    }
  );
};

// Delete image mutation
export const useDeleteImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (imageId: string) => ImageService.deleteImage(imageId),
    {
      onSuccess: (_, imageId) => {
        // Invalidate related queries
        queryClient.invalidateQueries('savedImages');
        // Remove from cache
        queryClient.removeQueries(['savedImage', imageId]);
      },
    }
  );
};
```

## Data Flow Patterns

### 1. Image Upload Flow
```
User Action → Component → Hook → Service → API → Redux → UI Update
    ↓           ↓         ↓        ↓      ↓       ↓        ↓
Select Image → ImagePicker → useImagePicker → ImageService → OpenAI → updateCache → ResultPanel
```

### 2. Settings Update Flow
```
User Input → Component → Hook → Redux → AsyncStorage → UI Update
     ↓         ↓         ↓        ↓         ↓           ↓
Form Change → SettingsForm → useSettings → settingsSlice → persist → Validation
```

### 3. Image Storage Flow
```
Scan Result → Component → Hook → Service → FileSystem → Redux → UI Update
      ↓         ↓         ↓        ↓         ↓         ↓        ↓
Save Image → ResultPanel → useImageStorage → ImageService → RNFS → cacheSlice → ImageGrid
```

### 4. Error Handling Flow
```
API Error → Service → Query → Component → Redux → UI Update
    ↓        ↓        ↓         ↓         ↓        ↓
Network Error → OpenAIService → useIdentifySpecies → ErrorBoundary → uiSlice → ErrorDisplay
```

## State Synchronization

### 1. Online/Offline Sync
```typescript
const useNetworkSync = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const isOnline = state.isConnected ?? false;
      dispatch(setNetworkStatus(isOnline ? 'online' : 'offline'));
      
      if (isOnline) {
        // Refetch all stale queries
        queryClient.refetchQueries({
          stale: true,
          active: true,
        });
      }
    });
    
    return unsubscribe;
  }, [dispatch, queryClient]);
};
```

### 2. Background Sync
```typescript
const useBackgroundSync = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnline) {
        // Sync cached data
        dispatch(syncCachedData());
        dispatch(updateLastSyncTime());
      }
    }, 5 * 60 * 1000); // Sync every 5 minutes
    
    return () => clearInterval(interval);
  }, [dispatch]);
};
```

### 3. Cache Management
```typescript
const useCacheManagement = () => {
  const dispatch = useDispatch();
  const cacheSize = useSelector(state => state.cache.currentSize);
  const maxSize = useSelector(state => state.cache.maxSize);
  
  useEffect(() => {
    if (cacheSize > maxSize * 0.9) {
      // Clean up old cache entries
      dispatch(cleanupCache());
    }
  }, [cacheSize, maxSize, dispatch]);
};
```

## Performance Optimizations

### 1. Memoization
```typescript
// Selectors with reselect
const selectImagesBySpecies = createSelector(
  [selectCachedImages, selectActiveSpecies],
  (images, activeSpecies) => {
    if (!activeSpecies) return images;
    return images.filter(img => 
      img.metadata.species?.toLowerCase() === activeSpecies.toLowerCase()
    );
  }
);

// Memoized components
const ImageGrid = React.memo(({ images, onImagePress }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  return prevProps.images.length === nextProps.images.length &&
         prevProps.onImagePress === nextProps.onImagePress;
});
```

### 2. Lazy Loading
```typescript
const LazyImageGrid = React.lazy(() => import('./ImageGrid'));
const LazyImageDetail = React.lazy(() => import('./ImageDetailScreen'));

// Usage with Suspense
<Suspense fallback={<LoadingIndicator />}>
  <LazyImageGrid images={images} onImagePress={handleImagePress} />
</Suspense>
```

### 3. Virtualization
```typescript
import { FlatList } from 'react-native';

const VirtualImageGrid = ({ images }) => {
  const renderItem = useCallback(({ item }) => (
    <ImageCard image={item} onPress={handleImagePress} />
  ), [handleImagePress]);
  
  const keyExtractor = useCallback((item) => item.id, []);
  
  return (
    <FlatList
      data={images}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={3}
      windowSize={10}
      initialNumToRender={12}
      maxToRenderPerBatch={6}
      updateCellsBatchingPeriod={50}
      removeClippedSubviews={true}
    />
  );
};
```

## State Persistence

### 1. Redux Persist Configuration
```typescript
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['settings', 'cache'], // Only persist essential data
  blacklist: ['ui'], // Don't persist UI state
  transforms: [
    // Transform data before persisting
    transformCircularJson(),
  ],
  throttle: 1000, // Throttle persisted writes
};
```

### 2. Migration Strategy
```typescript
const migrations = {
  1: (state) => {
    // Migration from version 0 to 1
    return {
      ...state,
      settings: {
        ...state.settings,
        preferences: {
          ...state.settings.preferences,
          newFeature: true,
        },
      },
    };
  },
  2: (state) => {
    // Migration from version 1 to 2
    return {
      ...state,
      cache: {
        ...state.cache,
        maxSize: 100 * 1024 * 1024, // 100MB
      },
    };
  },
};
```

## Debugging and Monitoring

### 1. Redux DevTools
```typescript
const store = configureStore({
  reducer: rootReducer,
  devTools: __DEV__,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
      immutableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});
```

### 2. React Query Devtools
```typescript
import { ReactQueryDevtools } from 'react-query/devtools';

// In your app component
<QueryClientProvider client={queryClient}>
  <App />
  {__DEV__ && <ReactQueryDevtools initialIsOpen={false} />}
</QueryClientProvider>
```

### 3. Performance Monitoring
```typescript
const usePerformanceMonitor = () => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());
  
  useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    
    if (__DEV__ && timeSinceLastRender < 16) {
      console.warn(`Component re-rendered too quickly: ${timeSinceLastRender}ms`);
    }
    
    lastRenderTime.current = now;
  });
};
```

## Testing Strategy

### 1. Redux Testing
```typescript
// Test reducer
describe('settingsSlice', () => {
  it('should set API config', () => {
    const initialState = { apiConfig: { url: '', apiKey: '' } };
    const action = setApiConfig({ url: 'https://api.openai.com', apiKey: 'test' });
    const result = settingsReducer(initialState, action);
    
    expect(result.apiConfig.url).toBe('https://api.openai.com');
    expect(result.apiConfig.apiKey).toBe('test');
  });
});
```

### 2. React Query Testing
```typescript
// Test custom hook
import { renderHook, waitFor } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';

const createWrapper = (client: QueryClient) => ({ children }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
);

test('should identify species successfully', async () => {
  const queryClient = new QueryClient();
  const wrapper = createWrapper(queryClient);
  
  const { result } = renderHook(
    () => useIdentifySpecies('test-image-uri'),
    { wrapper }
  );
  
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toHaveProperty('species');
});
```

### 3. Integration Testing
```typescript
// Test complete flow
describe('Image identification flow', () => {
  it('should complete full identification process', async () => {
    // Mock API responses
    mockOpenAIService.identifySpecies.mockResolvedValue(mockSpeciesData);
    
    // Render component
    const { getByTestId } = render(<WelcomeScreen />);
    
    // Simulate user actions
    fireEvent.press(getByTestId('camera-button'));
    
    // Wait for results
    await waitFor(() => {
      expect(getByTestId('species-result')).toBeInTheDocument();
    });
  });
});