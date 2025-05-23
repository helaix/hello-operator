# Sparkflow Voice Assistant Expo App

A real-time voice assistant mobile app built with Expo that integrates with Gemini 2.5 Pro/Flash for AI conversations and function calling to interact with Linear projects, GitHub repositories, and Codegen services.

## Features

- 🎤 **Real-time Voice Recognition**: Speak naturally to interact with the AI
- 🗣️ **Text-to-Speech**: AI responses are spoken back to you
- 🧠 **Gemini 2.5 Integration**: Uses both Pro and Flash models for optimal performance
- 🔧 **Function Calling**: Execute actions on Linear, GitHub, and Codegen
- 📱 **Cross-Platform**: Works on iOS, Android, and Web
- 🔒 **Secure**: API keys stored securely on device

## Supported Integrations

### Linear
- View and filter issues
- Create new issues
- Manage projects and teams
- Update issue status

### GitHub
- Browse repositories
- View and create issues
- Manage pull requests
- Repository statistics

### Codegen
- Check service status
- Trigger workflows
- Monitor task progress
- Get help and documentation

## Quick Start

1. **Install Dependencies**
   ```bash
   cd packages/@sparkflow/voice-assistant-expo
   npm install
   ```

2. **Set up API Keys**
   - Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Get your Linear API key from [Linear Settings](https://linear.app/settings/api)
   - Get your GitHub API key from [GitHub Settings](https://github.com/settings/tokens)
   - Get your Codegen API key from your Codegen dashboard

3. **Run the App**
   ```bash
   # For iOS (requires macOS)
   npm run ios
   
   # For Android
   npm run android
   
   # For Web
   npm run web
   ```

4. **Configure API Keys**
   - On first launch, you'll be prompted to enter your API keys
   - Keys are stored securely using Expo SecureStore
   - You can update keys anytime in the app settings

## Usage Examples

### Voice Commands

- "Show me my Linear issues"
- "Create a new issue called 'Fix login bug' in the frontend team"
- "List my GitHub repositories"
- "Create a GitHub issue in the sparkflow repo about voice recognition"
- "What's the status of Codegen services?"
- "Trigger a code review task for the main branch"

### Quick Actions

The app includes quick action buttons for common tasks:
- 📋 Linear Issues
- 📁 GitHub Repos  
- 🤖 Codegen Help

## Architecture

### Components
- **VoiceAssistant**: Main voice interaction interface
- **ConversationHistory**: Chat-like message display
- **ApiKeySetup**: Secure API key configuration

### Services
- **FunctionCallHandler**: Manages API integrations and function execution
- **Voice Recognition**: Expo Speech and react-native-voice integration
- **AI Integration**: Google Generative AI with function calling

### AI Models
- **Gemini 2.5 Flash**: For quick responses and simple queries
- **Gemini 2.5 Pro**: For complex tasks and detailed analysis

## Development

### Project Structure
```
src/
├── components/          # React Native components
│   ├── VoiceAssistant.tsx
│   ├── ConversationHistory.tsx
│   └── ApiKeySetup.tsx
├── services/           # Business logic and API integrations
│   └── FunctionCallHandler.ts
└── types/             # TypeScript type definitions
```

### Adding New Functions

1. Add function definition to `FunctionCallHandler.getToolDefinitions()`
2. Implement the function in `FunctionCallHandler.executeFunction()`
3. Test with voice commands or quick actions

### Building for Production

```bash
# Build for production
npm run build

# Create standalone builds
npx eas build --platform all
```

## Permissions

The app requires the following permissions:
- **Microphone**: For voice recognition
- **Internet**: For API calls
- **Network State**: For connectivity checks

## Security

- API keys are stored using Expo SecureStore (encrypted storage)
- No API keys are transmitted to third parties
- All API calls go directly to official services
- Voice data is processed locally when possible

## Troubleshooting

### Voice Recognition Issues
- Ensure microphone permissions are granted
- Check device microphone functionality
- Try speaking more clearly or closer to the device

### API Connection Issues
- Verify API keys are correct and have proper permissions
- Check internet connectivity
- Ensure API services are operational

### Performance Issues
- Close other apps to free up memory
- Restart the app if responses become slow
- Check device storage space

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on multiple platforms
5. Submit a pull request

## License

This project is part of the Sparkflow ecosystem and follows the same licensing terms.

