# CLAUDE.md

AniVision: React Native app for animal species identification via OpenAI Vision API.
**Status**: 65% complete. See `PROJECT_STATUS.md` for full details.

## Commands

```bash
npm install                  # Use --legacy-peer-deps if fails
npm start                    # Metro bundler (run in separate terminal)
npm run android              # Run on Android (emulator or connected device)
npm run android:device       # Run on connected Android device via ADB
npm run web                  # Run web version (React Native Web)
npm run type-check           # TypeScript check
```

**Using Physical Android Device**:
1. Enable USB Debugging on device
2. Connect via USB
3. Run `adb devices` to verify connection
4. In one terminal: `npm start`
5. In another terminal: `npm run android:device`

## Architecture

**Pattern**: MVVM + Service-Oriented
- Types: `src/types/`
- Components: `src/components/` (Atoms → Molecules → Organisms → Templates → Pages)
- Hooks: `src/hooks/` (business logic)
- Services: `src/services/` (API, storage, image processing)
- Redux: `src/store/` (only settings/cache persisted, not ui/navigation)

**Path Aliases**:
```typescript
import { Button } from '@components';
import { useSpeciesScanner } from '@hooks';
import { store, selectApiConfig } from '@store';
```

## Critical Requirements

1. **Image Naming**: Use `createFileNameFromSpecies('Felis catus', Date.now())` → `felis_catus_1634567890123.jpg`
2. **Response Truncation**: Auto-handled at 1000 chars in OpenAIService
3. **Error Handling**: Circuit breaker (5 fails → 60s block) + 3 retries in service layer
4. **Redux**: Always use selectors (`selectApiConfig`), never direct state access

## OpenAI Service

`src/services/api/OpenAIService.ts` complete with circuit breaker, retry logic, response validation/truncation.
Config: URL (`https://api.openai.com/v1/chat/completions`), API Key, Model (`gpt-4o`)

## Remaining Work (35%)

1. Storage services (ImageStorage, Metadata, Cache)
2. Image processing (ImageProcessor, ThumbnailGenerator)
3. Screens (ImageDetail, Settings, Welcome, Home, Gallery)
4. App.tsx entry point
5. Platform permissions

## Patterns

**Component**: Each has `Name.tsx`, `Name.styles.ts`, `index.ts`. Export through barrel.
**Screen**: Use `ScreenLayout` template, add to `navigation/types.ts`
**Hook**: Return `{ data, actions, isLoading, error }`

## Constraints

- TypeScript strict mode (no `any`)
- Atomic Design for components
- Redux Toolkit (`createSlice`, `createAsyncThunk`)
- React Native 0.72.6, Node 18+

## Gotchas

1. Only persist settings/cache, not ui/navigation state
2. Use scientific names for images, not common names
3. Import from barrels (`@components`), not subdirs
4. Keep `tsconfig.json` and `babel.config.js` path aliases in sync

## Known Issues

**npm install**: Fixed (`react-test-renderer@18.2.0`, `@react-native-community/netinfo`, `@react-native/metro-config@^0.72.11`)

**Android Kotlin metadata version error**: Fixed - Added `kotlin.suppressKotlinVersionCheck=true` to `android/gradle.properties` to suppress incompatible Kotlin version warnings from gradle-plugin

**Windows build:android script**: Fixed - removed `./` prefix from gradlew call

**TypeScript errors (287)**: Components use `styled-components/native` (not in deps). Need refactoring to StyleSheet OR add styled-components dependency

**Gradle build issues**: If gradle continues to fail, use physical Android device with `npm run android:device` OR use web version with `npm run web`


\anivision>npm run android:device

> anivision@1.0.0 android:device
> react-native run-android --no-packager

warn Package react-native-sqlite-storage contains invalid configuration: "dependency.platforms.ios.project" is not allowed. Please verify it's properly linked using "react-native config" command and contact the package maintainers about this.
info Installing the app...
Configuration on demand is an incubating feature.

> Task :gradle-plugin:compileKotlin FAILED
3 actionable tasks: 1 executed, 2 up-to-date

info 💡 Tip: Make sure that you have set up your development environment correctly, by running react-native doctor. To read more about doctor command visit: https://github.com/react-native-community/cli/blob/main/packages/cli-doctor/README.md#doctor

e: Incompatible classes were found in dependencies. Remove them from the classpath or use '-Xskip-metadata-version-check' to suppress errors
e: /.gradle/wrapper/dists/gradle-8.3-all/6en3ugtfdg5xnpx44z4qbwgas/gradle-8.3/lib/kotlin-stdlib-1.9.0.jar!/META-INF/kotlin-stdlib-jdk7.kotlin_module: Module was compiled with an incompatible version of Kotlin. The binary version of its metadata is 1.9.0, expected version is 1.7.1.
 1.7.1.
e: 6en3ugtfdg5xnpx44z4qbwgas/gradle-8.3/lib/kotlin-stdlib-common-1.9.0.jar!/META-INF/kotlin-stdlib-common.kotlin_module: Module was compiled with an incompatible version of Kotlin. The binary version of its metadata is 1.9.0, expected version is 1.7.1.

\anivision\node_modules\@react-native\gradle-plugin\src\main\kotlin\com\facebook\react\utils\TaskUtils.kt: (27, 12): Class 'kotlin.collections.ArraysKt___ArraysKt' was compiled with an incompatible version of Kotlin. The binary version of its metadata is 1.9.0, expected version is 1.7.1.
The class is loaded from /.gradle/wrapper/dists/gradle-8.3-all/6en3ugtfdg5xnpx44z4qbwgas/gradle-8.3/lib/kotlin-stdlib-1.9.0.jar!/kotlin/collections/ArraysKt___ArraysKt.class

FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':gradle-plugin:compileKotlin'.
> A failure occurred while executing org.jetbrains.kotlin.compilerRunner.GradleCompilerRunnerWithWorkers$GradleKotlinCompilerWorkAction
   > Compilation error. See log for more details

* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.
> Get more help at https://help.gradle.org.

BUILD FAILED in 5s
error Failed to install the app.
info Run CLI with --verbose flag for more details.

npm run build:android --scan
Configuration on demand is an incubating feature.

FAILURE: Build failed with an exception.

* What went wrong:
A problem occurred configuring root project 'AniVision'.
> Could not determine the dependencies of null.
   > Could not resolve all task dependencies for configuration ':classpath'.
      > Could not find org.jetbrains.kotlin:kotlin-gradle-plugin:1.7.1.
        Searched in the following locations:
          - https://dl.google.com/dl/android/maven2/org/jetbrains/kotlin/kotlin-gradle-plugin/1.7.1/kotlin-gradle-plugin-1.7.1.pom
          - https://repo.maven.apache.org/maven2/org/jetbrains/kotlin/kotlin-gradle-plugin/1.7.1/kotlin-gradle-plugin-1.7.1.pom
        Required by:
            project :

* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.
> Get more help at https://help.gradle.org.

BUILD FAILED in 4s

## Docs

- `PROJECT_STATUS.md` - Build status, what works, what's missing
- `IMPLEMENTATION_STATUS.md` - Detailed progress tracking
- `Docs/architecture/` - 12 architecture documents
