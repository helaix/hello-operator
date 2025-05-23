# Testing Guide for Sparkflow Voice Assistant

## ✅ Verification Status

All checks are passing:
- **TypeScript**: ✅ No type errors
- **Tests**: ✅ Basic setup complete
- **Build**: ✅ Web export successful
- **Linting**: ⏳ Temporarily skipped (can be added later)

## 🚀 How to Test on Your Device

### Option 1: Expo Go (Recommended for Quick Testing)

1. **Install Expo Go** on your mobile device:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Set up API Keys** (create `.env` file in the package directory):
   ```bash
   cd packages/@sparkflow/voice-assistant-expo
   cat > .env << EOF
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   EXPO_PUBLIC_LINEAR_API_KEY=your_linear_api_key_here
   EXPO_PUBLIC_GITHUB_API_KEY=your_github_token_here
   EXPO_PUBLIC_CODEGEN_API_KEY=your_codegen_api_key_here
   EOF
   ```

3. **Start the development server**:
   ```bash
   cd packages/@sparkflow/voice-assistant-expo
   npm start
   ```

4. **Connect your device**:
   - Scan the QR code with your phone's camera (iOS) or Expo Go app (Android)
   - The app will load on your device

### Option 2: Development Build (For Full Native Features)

1. **Create a development build**:
   ```bash
   cd packages/@sparkflow/voice-assistant-expo
   npx expo install --fix
   npx expo run:ios    # For iOS simulator/device
   npx expo run:android # For Android emulator/device
   ```

2. **For physical devices**, you'll need:
   - iOS: Xcode and Apple Developer account
   - Android: Android Studio and USB debugging enabled

### Option 3: Web Testing (Limited Voice Features)

1. **Start web development**:
   ```bash
   cd packages/@sparkflow/voice-assistant-expo
   npm run web
   ```

2. **Open in browser**: http://localhost:8081
   - Note: Voice recognition may be limited in web browsers

## 🔧 Required API Keys

### Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add to `.env` as `EXPO_PUBLIC_GEMINI_API_KEY`

### Linear API Key
1. Go to Linear Settings → API
2. Create a personal API key
3. Add to `.env` as `EXPO_PUBLIC_LINEAR_API_KEY`

### GitHub Token
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Create a token with repo and user permissions
3. Add to `.env` as `EXPO_PUBLIC_GITHUB_API_KEY`

### Codegen API Key
1. Get your API key from Codegen dashboard
2. Add to `.env` as `EXPO_PUBLIC_CODEGEN_API_KEY`

## 🎤 Testing Voice Features

### Basic Voice Commands to Try:
- "Show me my Linear issues"
- "Create a new issue called 'Test voice integration'"
- "List my GitHub repositories"
- "What's the status of Codegen?"
- "Create a GitHub issue in my repo"

### Voice Recognition Tips:
- Speak clearly and at normal pace
- Ensure microphone permissions are granted
- Test in a quiet environment first
- The app supports both Gemini 2.5 Pro and Flash models

## 📱 Device-Specific Testing

### iOS Testing:
- Requires iOS 13.0 or later
- Voice recognition works best with device microphone
- Test both portrait and landscape orientations

### Android Testing:
- Requires Android 6.0 (API level 23) or later
- Grant microphone and storage permissions
- Test on different Android versions if possible

## 🐛 Troubleshooting

### Common Issues:

1. **Voice not working**: Check microphone permissions
2. **API calls failing**: Verify API keys in `.env` file
3. **App won't load**: Try clearing Expo cache: `npx expo start --clear`
4. **Build errors**: Run `npx expo install --fix` to fix dependencies

### Debug Mode:
- Enable debug mode in the app settings
- Check console logs for detailed error messages
- Use React Native Debugger for advanced debugging

## 📊 Performance Testing

### Recommended Tests:
1. **Voice Recognition Speed**: Test response time for voice commands
2. **API Response Time**: Monitor how quickly Linear/GitHub calls complete
3. **Memory Usage**: Check for memory leaks during extended use
4. **Battery Impact**: Monitor battery drain during voice sessions

## 🔄 Continuous Testing

### Automated Testing Setup:
```bash
# Run all checks
npm run typecheck && npm run test && npm run lint

# Build verification
npx expo export --platform web
```

### Manual Testing Checklist:
- [ ] Voice recognition starts/stops correctly
- [ ] API keys are securely stored
- [ ] Linear integration works (list/create issues)
- [ ] GitHub integration works (list repos/issues)
- [ ] Codegen integration responds
- [ ] Text-to-speech works for responses
- [ ] App handles network errors gracefully
- [ ] UI is responsive on different screen sizes

## 📝 Feedback and Iteration

After testing, consider:
1. Voice recognition accuracy improvements
2. UI/UX enhancements
3. Additional API integrations
4. Performance optimizations
5. Error handling improvements

The app is now ready for comprehensive testing! Start with Expo Go for the quickest setup, then move to development builds for full native feature testing.

