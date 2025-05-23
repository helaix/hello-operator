import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

interface ApiKeySetupProps {
  onComplete: () => void;
}

export const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onComplete }) => {
  const [geminiKey, setGeminiKey] = useState('');
  const [linearKey, setLinearKey] = useState('');
  const [githubKey, setGithubKey] = useState('');
  const [codegenKey, setCodegenKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!geminiKey || !linearKey || !githubKey || !codegenKey) {
      Alert.alert('Missing Keys', 'Please provide all required API keys.');
      return;
    }

    setIsLoading(true);
    try {
      await SecureStore.setItemAsync('gemini_api_key', geminiKey);
      await SecureStore.setItemAsync('linear_api_key', linearKey);
      await SecureStore.setItemAsync('github_api_key', githubKey);
      await SecureStore.setItemAsync('codegen_api_key', codegenKey);
      
      Alert.alert('Success', 'API keys saved successfully!', [
        { text: 'OK', onPress: onComplete }
      ]);
    } catch (error) {
      console.error('Error saving API keys:', error);
      Alert.alert('Error', 'Failed to save API keys. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadExistingKeys = async () => {
    try {
      const existingGemini = await SecureStore.getItemAsync('gemini_api_key');
      const existingLinear = await SecureStore.getItemAsync('linear_api_key');
      const existingGithub = await SecureStore.getItemAsync('github_api_key');
      const existingCodegen = await SecureStore.getItemAsync('codegen_api_key');

      if (existingGemini) setGeminiKey(existingGemini);
      if (existingLinear) setLinearKey(existingLinear);
      if (existingGithub) setGithubKey(existingGithub);
      if (existingCodegen) setCodegenKey(existingCodegen);
    } catch (error) {
      console.error('Error loading existing keys:', error);
    }
  };

  React.useEffect(() => {
    loadExistingKeys();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔑 API Key Setup</Text>
        <Text style={styles.subtitle}>
          Configure your API keys to enable voice assistant functionality
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gemini API Key</Text>
          <Text style={styles.description}>
            Required for AI conversation and function calling
          </Text>
          <TextInput
            style={styles.input}
            value={geminiKey}
            onChangeText={setGeminiKey}
            placeholder="Enter your Gemini API key"
            secureTextEntry
            autoCapitalize="none"
          />
          <Text style={styles.helpText}>
            Get your key from: https://aistudio.google.com/app/apikey
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Linear API Key</Text>
          <Text style={styles.description}>
            Required for managing Linear issues and projects
          </Text>
          <TextInput
            style={styles.input}
            value={linearKey}
            onChangeText={setLinearKey}
            placeholder="Enter your Linear API key"
            secureTextEntry
            autoCapitalize="none"
          />
          <Text style={styles.helpText}>
            Get your key from: https://linear.app/settings/api
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>GitHub API Key</Text>
          <Text style={styles.description}>
            Required for accessing GitHub repositories and issues
          </Text>
          <TextInput
            style={styles.input}
            value={githubKey}
            onChangeText={setGithubKey}
            placeholder="Enter your GitHub API key"
            secureTextEntry
            autoCapitalize="none"
          />
          <Text style={styles.helpText}>
            Get your key from: https://github.com/settings/tokens
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Codegen API Key</Text>
          <Text style={styles.description}>
            Required for interacting with Codegen services
          </Text>
          <TextInput
            style={styles.input}
            value={codegenKey}
            onChangeText={setCodegenKey}
            placeholder="Enter your Codegen API key"
            secureTextEntry
            autoCapitalize="none"
          />
          <Text style={styles.helpText}>
            Get your key from your Codegen dashboard
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save API Keys'}
          </Text>
        </TouchableOpacity>

        <View style={styles.securityNote}>
          <Text style={styles.securityTitle}>🔒 Security Note</Text>
          <Text style={styles.securityText}>
            Your API keys are stored securely on your device using Expo SecureStore.
            They are never transmitted to any third-party servers except the official APIs.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  helpText: {
    fontSize: 12,
    color: '#2196f3',
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  securityNote: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 5,
  },
  securityText: {
    fontSize: 12,
    color: '#2e7d32',
    lineHeight: 18,
  },
});

