import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Speech from 'expo-speech';
import Voice from '@react-native-voice/voice';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as SecureStore from 'expo-secure-store';

import { VoiceAssistant } from './src/components/VoiceAssistant';
import { ApiKeySetup } from './src/components/ApiKeySetup';
import { ConversationHistory } from './src/components/ConversationHistory';
import { FunctionCallHandler } from './src/services/FunctionCallHandler';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  functionCalls?: any[];
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasApiKeys, setHasApiKeys] = useState(false);
  const [geminiClient, setGeminiClient] = useState<GoogleGenerativeAI | null>(null);
  const [functionHandler, setFunctionHandler] = useState<FunctionCallHandler | null>(null);

  useEffect(() => {
    checkApiKeys();
    initializeVoice();
    
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const checkApiKeys = async () => {
    try {
      const geminiKey = await SecureStore.getItemAsync('gemini_api_key');
      const linearKey = await SecureStore.getItemAsync('linear_api_key');
      const githubKey = await SecureStore.getItemAsync('github_api_key');
      const codegenKey = await SecureStore.getItemAsync('codegen_api_key');

      if (geminiKey && linearKey && githubKey && codegenKey) {
        setHasApiKeys(true);
        const genAI = new GoogleGenerativeAI(geminiKey);
        setGeminiClient(genAI);
        
        const handler = new FunctionCallHandler({
          linearApiKey: linearKey,
          githubApiKey: githubKey,
          codegenApiKey: codegenKey,
        });
        setFunctionHandler(handler);
      }
    } catch (error) {
      console.error('Error checking API keys:', error);
    }
  };

  const initializeVoice = () => {
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechError = (error) => {
      console.error('Speech error:', error);
      setIsListening(false);
      Alert.alert('Speech Error', 'Failed to recognize speech. Please try again.');
    };
    Voice.onSpeechResults = (event) => {
      if (event.value && event.value[0]) {
        handleUserInput(event.value[0]);
      }
    };
  };

  const handleUserInput = async (text: string) => {
    if (!geminiClient || !functionHandler) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Use Gemini 2.5 Flash for faster responses, Pro for complex tasks
      const model = geminiClient.getGenerativeModel({ 
        model: text.length > 100 || text.includes('complex') ? 'gemini-2.5-pro' : 'gemini-2.5-flash',
        tools: functionHandler.getToolDefinitions() as any,
      });

      const chat = model.startChat({
        history: messages.slice(-10).map(msg => ({
          role: msg.isUser ? 'user' : 'model',
          parts: [{ text: msg.text }],
        })),
      });

      const result = await chat.sendMessage(text);
      const response = await result.response;

      // Handle function calls if present
      let responseText = response.text();
      let functionCalls: any[] = [];

      const responseFunctionCalls = response.functionCalls?.();
      if (responseFunctionCalls) {
        functionCalls = responseFunctionCalls;
        for (const call of functionCalls) {
          try {
            const functionResult = await functionHandler.executeFunction(call.name, call.args);
            responseText += `\n\n✅ Executed ${call.name}: ${JSON.stringify(functionResult, null, 2)}`;
          } catch (error) {
            responseText += `\n\n❌ Error executing ${call.name}: ${error}`;
          }
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date(),
        functionCalls,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Speak the response
      Speech.speak(responseText, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.9,
      });

    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error processing your request. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const startListening = async () => {
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      Alert.alert('Voice Error', 'Failed to start voice recognition. Please check permissions.');
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  };

  if (!hasApiKeys) {
    return <ApiKeySetup onComplete={checkApiKeys} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Sparkflow Voice Assistant</Text>
        <Text style={styles.subtitle}>Real-time voice interaction with Gemini AI</Text>
      </View>

      <ConversationHistory messages={messages} />

      <VoiceAssistant
        isListening={isListening}
        isProcessing={isProcessing}
        onStartListening={startListening}
        onStopListening={stopListening}
        onTextInput={handleUserInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
});
