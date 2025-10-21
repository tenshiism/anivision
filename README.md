# Anivision
Animal vision (Anivision) identifies species with scientific names

---

## 🚀 Quick Start

### Web Demo (Fastest)
```bash
# Install dependencies
npm install

# Run web version
npm run web

# Open http://localhost:3000 in your browser
```

### Mobile Development
```bash
# Install dependencies
npm install

# iOS setup
cd ios && pod install && cd ..

# Run the app
npm run ios           # For iOS
npm run android       # For Android
npm run android:device # For Android device via ADB
```

---

## 📱 What is AniVision?

AniVision is an application that uses OpenAI's Vision API to identify animal species from photos. Available as both a web demo and mobile app (in development).

### Key Features
- 📸 **Instant Identification** - Identify species from camera or image URL
- 🔬 **Scientific Names** - Get accurate binomial nomenclature
- 📝 **AI Summaries** - Detailed descriptions of each species
- ⚙️ **Configurable** - Use your own OpenAI API key
- 🌐 **Web Demo** - Try it now in your browser
- 📱 **Mobile App** - Native iOS/Android (in development)
- 💾 **Local Storage** - Images saved with species-based naming (mobile)
- 🌓 **Dark Mode** - Full theme support (mobile)

---

## 📚 Documentation

This project has comprehensive documentation:

### For Users
- **[Project Summary](PROJECT_SUMMARY.md)** - Overview and features
- **[Getting Started](#-quick-start)** - Installation and setup

### For Developers
- **[Implementation Status](IMPLEMENTATION_STATUS.md)** - What's done and what's pending
- **[Next Steps Guide](NEXT_STEPS.md)** - How to complete the implementation
- **[Architecture Documentation](Docs/architecture/)** - Detailed technical specs
  - System Architecture
  - Component Structure
  - API Integration Strategy
  - Data Flow & State Management
  - Image Storage
  - UI/UX Design
  - File Structure
  - Dependencies
  - Implementation Roadmap
  - Error Handling
  - Security Architecture

---

## 🏗️ Current Status

**Development Progress**: 65% Complete

✅ **Completed**
- Project structure and configuration
- Complete type system
- Theme system (light/dark modes)
- Full component library (50+ components)
- Navigation system
- OpenAI API integration
- Utility functions and hooks

⏳ **In Progress**
- Redux store setup
- Storage services
- Screen implementations
- Platform configuration

See [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) for detailed breakdown.

---

## 🛠️ Technology Stack

- **Framework**: React Native 0.72.6 + React Native Web
- **Language**: TypeScript 5.2.2
- **State**: Redux Toolkit + Redux Persist
- **Navigation**: React Navigation v6
- **Build Tools**: Webpack 5 (web), Metro (mobile)
- **API**: OpenAI Vision API (GPT-4o)
- **Storage**: React Native FS + SQLite (mobile)
- **Web**: Fully responsive, works on all devices

---

## 📋 Requirements

### For Web Demo
- Node.js 18+
- Modern web browser
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### For Mobile Development
- Node.js 18+
- React Native development environment
- iOS: Xcode 14+ and CocoaPods
- Android: Android Studio and SDK 33+
- OpenAI API key

---

## 🎯 Core Features

### 1. Species Identification
- Take photo or select from gallery
- AI analyzes and identifies species
- Returns scientific name with confidence score

### 2. Detailed Information
Each identification includes:
- Common name and scientific name
- One-sentence AI summary
- Habitat information
- Behavior patterns
- Conservation status
- Interesting facts

### 3. Local Storage
- Images saved with species-based filenames
- Example: `felis_catus_1634567890123.jpg`
- Offline access to previous identifications
- Gallery view with thumbnails

### 4. Settings
- Configure OpenAI API URL
- Add your API key
- Test connection
- App preferences

---

## 📱 Screenshots

(Screenshots will be added as screens are completed)

---

## 🔧 Development

### Project Structure
```
src/
├── components/     # UI components (Atomic Design)
├── screens/        # Screen components
├── navigation/     # Navigation config
├── services/       # Business logic
├── store/          # Redux store
├── hooks/          # Custom hooks
├── utils/          # Utilities
├── types/          # TypeScript types
├── constants/      # Constants
└── theme/          # Theme system
```

### Available Scripts
```bash
npm start           # Start Metro bundler
npm run web         # Run web version (http://localhost:3000)
npm run ios         # Run on iOS
npm run android     # Run on Android
npm run android:device # Run on physical Android device
npm test            # Run tests
npm run lint        # Lint code
npm run type-check  # TypeScript check
```

### Next Steps
See [NEXT_STEPS.md](NEXT_STEPS.md) for detailed implementation guide.

---

## 🤝 Contributing

### Code Standards
- TypeScript strict mode
- ESLint + Prettier enforced
- Atomic Design principles
- Redux Toolkit patterns
- Comprehensive documentation

### Testing
- Unit tests for services and utilities
- Integration tests for screens
- Minimum 80% coverage target

---

## 📖 API Integration

AniVision uses OpenAI's Vision API (GPT-4o model) for species identification.

### Request Format
```typescript
{
  model: "gpt-4o",
  messages: [{
    role: "user",
    content: [
      { type: "text", text: "Identify this animal species..." },
      { type: "image_url", image_url: { url: "base64_image" } }
    ]
  }],
  max_tokens: 500,
  temperature: 0.1
}
```

### Response Format
```json
{
  "species": {
    "commonName": "Domestic Cat",
    "scientificName": "Felis catus",
    "confidence": 0.95,
    "family": "Felidae"
  },
  "summary": "A domestic cat with typical feline characteristics...",
  "details": { ... }
}
```

See [API Integration docs](Docs/architecture/04-api-integration.md) for full details.

---

## 🔒 Security & Privacy

- API keys encrypted in local storage
- No data sent to external servers (except OpenAI API)
- Images stored locally on device
- No user accounts or tracking
- Open source and transparent

---

## 🐛 Known Issues

See [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) for current limitations and pending features.

---

## 📄 License

MIT with attribution

---

## 🙏 Acknowledgments

- OpenAI for Vision API
- React Native community
- All contributors to dependencies

---

## 📞 Support

### Documentation
- [Implementation Status](IMPLEMENTATION_STATUS.md)
- [Next Steps](NEXT_STEPS.md)
- [Project Summary](PROJECT_SUMMARY.md)
- [Architecture Docs](Docs/architecture/)

### Resources
- [React Native Docs](https://reactnative.dev)
- [OpenAI Vision API](https://platform.openai.com/docs/guides/vision)
- [Redux Toolkit](https://redux-toolkit.js.org)

---

**Status**: 🟡 In Development (65% Complete)
**Est. Completion**: 3-4 weeks
**Last Updated**: October 21, 2025
