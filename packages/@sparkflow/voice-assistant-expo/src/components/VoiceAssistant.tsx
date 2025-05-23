import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

interface VoiceAssistantProps {
  isListening: boolean;
  isProcessing: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onTextInput: (text: string) => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  isListening,
  isProcessing,
  onStartListening,
  onStopListening,
  onTextInput,
}) => {
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  React.useEffect(() => {
    if (isListening) {
      // Create pulsing animation while listening
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening]);

  const handleVoicePress = () => {
    if (isListening) {
      onStopListening();
    } else {
      onStartListening();
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      onTextInput(textInput.trim());
      setTextInput('');
      setShowTextInput(false);
    }
  };

  const getButtonColor = () => {
    if (isProcessing) return '#ff9800';
    if (isListening) return '#f44336';
    return '#4caf50';
  };

  const getButtonText = () => {
    if (isProcessing) return 'Processing...';
    if (isListening) return 'Stop Listening';
    return 'Start Voice';
  };

  return (
    <View style={styles.container}>
      {showTextInput && (
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            value={textInput}
            onChangeText={setTextInput}
            placeholder="Type your message..."
            multiline
            autoFocus
          />
          <View style={styles.textInputButtons}>
            <TouchableOpacity
              style={[styles.textButton, styles.cancelButton]}
              onPress={() => {
                setShowTextInput(false);
                setTextInput('');
              }}
            >
              <Text style={styles.textButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.textButton, styles.sendButton]}
              onPress={handleTextSubmit}
              disabled={!textInput.trim()}
            >
              <Text style={styles.textButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.textToggleButton}
          onPress={() => setShowTextInput(!showTextInput)}
        >
          <Text style={styles.textToggleButtonText}>
            {showTextInput ? '🎤' : '⌨️'}
          </Text>
        </TouchableOpacity>

        <Animated.View style={[styles.voiceButtonContainer, { transform: [{ scale: pulseAnim }] }]}>
          <TouchableOpacity
            style={[styles.voiceButton, { backgroundColor: getButtonColor() }]}
            onPress={handleVoicePress}
            disabled={isProcessing}
          >
            <Text style={styles.voiceButtonText}>
              {isListening ? '🔴' : isProcessing ? '⏳' : '🎤'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.placeholder} />
      </View>

      <Text style={styles.statusText}>{getButtonText()}</Text>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => onTextInput('Show me my Linear issues')}
        >
          <Text style={styles.quickActionText}>📋 Linear Issues</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => onTextInput('List my GitHub repositories')}
        >
          <Text style={styles.quickActionText}>📁 GitHub Repos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => onTextInput('Help me with Codegen')}
        >
          <Text style={styles.quickActionText}>🤖 Codegen Help</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  textInputContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textInput: {
    minHeight: 80,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  textInputButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  textButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  sendButton: {
    backgroundColor: '#4caf50',
  },
  textButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  textToggleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2196f3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textToggleButtonText: {
    fontSize: 24,
  },
  voiceButtonContainer: {
    alignItems: 'center',
  },
  voiceButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  voiceButtonText: {
    fontSize: 32,
  },
  placeholder: {
    width: 50,
  },
  statusText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 10,
  },
  quickActionButton: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2196f3',
    minWidth: (width - 60) / 3,
  },
  quickActionText: {
    color: '#1976d2',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
});

