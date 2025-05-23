# Sparkflow Voice Assistant Demo

## Quick Demo Script

### 1. Initial Setup
1. Launch the app
2. Enter your API keys when prompted:
   - **Gemini API Key**: Get from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - **Linear API Key**: Get from [Linear Settings](https://linear.app/settings/api)
   - **GitHub API Key**: Get from [GitHub Settings](https://github.com/settings/tokens)
   - **Codegen API Key**: Get from your Codegen dashboard

### 2. Voice Commands Demo

#### Linear Integration
```
🎤 "Show me my Linear issues"
🎤 "Create a new issue called 'Add voice recognition to mobile app'"
🎤 "What issues are assigned to me?"
🎤 "List all issues in the frontend team"
```

#### GitHub Integration
```
🎤 "List my GitHub repositories"
🎤 "Show me issues in the sparkflow repository"
🎤 "Create a GitHub issue about improving documentation"
🎤 "What's the status of my pull requests?"
```

#### Codegen Integration
```
🎤 "What's the status of Codegen services?"
🎤 "Trigger a code review task for the main branch"
🎤 "Help me with Codegen workflows"
🎤 "Start a new development task"
```

### 3. Advanced Conversations

#### Multi-step Tasks
```
🎤 "I need to create a new feature branch and track it in Linear"
→ AI will guide you through:
  1. Creating a GitHub branch
  2. Creating a Linear issue
  3. Linking them together
```

#### Context-Aware Responses
```
🎤 "Show me my issues"
🎤 "Create a similar one for the mobile app"
→ AI remembers the previous context and creates a related issue
```

#### Complex Queries
```
🎤 "Find all high-priority issues assigned to me that haven't been updated in the last week"
🎤 "Create a summary report of my team's progress this sprint"
```

### 4. Quick Actions Demo

Instead of voice, you can use the quick action buttons:
- **📋 Linear Issues**: Instantly view your Linear issues
- **📁 GitHub Repos**: Browse your repositories
- **🤖 Codegen Help**: Get help with Codegen

### 5. Text Input Alternative

If voice isn't working or you prefer typing:
1. Tap the ⌨️ button
2. Type your command
3. Tap Send

### 6. Real-time Features

#### Voice Recognition
- Real-time speech-to-text conversion
- Visual feedback while listening (pulsing microphone)
- Error handling for unclear speech

#### AI Response
- Automatic model selection (Flash for quick queries, Pro for complex tasks)
- Function calling for API integrations
- Text-to-speech for responses

#### Conversation History
- Scrollable chat interface
- Timestamps for all messages
- Function call details displayed
- Context preservation across conversations

## Demo Tips

### For Best Voice Recognition
- Speak clearly and at normal pace
- Use natural language (no need for robotic commands)
- Wait for the pulsing animation to stop before speaking again

### Example Natural Commands
Instead of: "Execute function get_linear_issues with filter team_id equals frontend"
Say: "Show me the issues for the frontend team"

### Troubleshooting During Demo
- If voice recognition fails: Use the text input option
- If API calls fail: Check internet connection and API keys
- If responses are slow: Try shorter, more specific commands

## Advanced Demo Scenarios

### Scenario 1: Bug Triage Workflow
```
🎤 "Show me all open bugs in the mobile app repository"
🎤 "Create a Linear issue for the login bug with high priority"
🎤 "Assign it to the mobile team and link it to the GitHub issue"
```

### Scenario 2: Sprint Planning
```
🎤 "What issues are planned for this sprint?"
🎤 "Create a new epic for the voice assistant feature"
🎤 "Break it down into smaller tasks"
```

### Scenario 3: Code Review Process
```
🎤 "Show me pull requests that need review"
🎤 "Trigger a Codegen review for PR #123"
🎤 "Create a Linear issue to track the review feedback"
```

This demo showcases the seamless integration between voice interaction, AI intelligence, and productivity tools, making complex workflows as simple as having a conversation.

