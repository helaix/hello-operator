import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Message } from '../../App';

interface ConversationHistoryProps {
  messages: Message[];
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({ messages }) => {
  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderFunctionCalls = (functionCalls: any[]) => {
    if (!functionCalls || functionCalls.length === 0) return null;

    return (
      <View style={styles.functionCallsContainer}>
        <Text style={styles.functionCallsTitle}>🔧 Function Calls:</Text>
        {functionCalls.map((call, index) => (
          <View key={index} style={styles.functionCall}>
            <Text style={styles.functionName}>{call.name}</Text>
            <Text style={styles.functionArgs}>
              {JSON.stringify(call.args, null, 2)}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  if (messages.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>👋 Welcome to Sparkflow Voice Assistant!</Text>
        <Text style={styles.emptySubtitle}>
          Start a conversation by tapping the microphone or using the quick actions below.
        </Text>
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>What I can help you with:</Text>
          <Text style={styles.feature}>📋 Manage your Linear issues and projects</Text>
          <Text style={styles.feature}>📁 Browse and interact with GitHub repositories</Text>
          <Text style={styles.feature}>🤖 Get help with Codegen workflows</Text>
          <Text style={styles.feature}>🎯 Execute complex tasks through voice commands</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {messages.map((message) => (
        <View
          key={message.id}
          style={[
            styles.messageContainer,
            message.isUser ? styles.userMessage : styles.assistantMessage,
          ]}
        >
          <View style={styles.messageHeader}>
            <Text style={styles.messageSender}>
              {message.isUser ? '👤 You' : '🤖 Assistant'}
            </Text>
            <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
          </View>
          
          <Text style={styles.messageText}>{message.text}</Text>
          
          {message.functionCalls && renderFunctionCalls(message.functionCalls)}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 15,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  featuresContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: '100%',
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  feature: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    lineHeight: 20,
  },
  messageContainer: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    maxWidth: '85%',
  },
  userMessage: {
    backgroundColor: '#2196f3',
    alignSelf: 'flex-end',
  },
  assistantMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  messageTime: {
    fontSize: 10,
    color: '#999',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
  },
  functionCallsContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#2196f3',
  },
  functionCallsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 5,
  },
  functionCall: {
    marginBottom: 8,
  },
  functionName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  functionArgs: {
    fontSize: 10,
    color: '#666',
    fontFamily: 'monospace',
    marginTop: 2,
  },
});

