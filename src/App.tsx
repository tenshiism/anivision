import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@store';

/**
 * Main App Component
 * Entry point for AniVision application
 * Simplified version for web without react-native-reanimated dependencies
 */
const MainContent: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!apiKey) {
      setResult('Please enter your OpenAI API key in the settings above.');
      return;
    }

    if (!imageUrl) {
      setResult('Please enter an image URL to analyze.');
      return;
    }

    setLoading(true);
    setResult('Analyzing image...');

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Identify the animal species in this image. Provide the scientific name, common name, and a brief description.' },
                { type: 'image_url', image_url: { url: imageUrl } }
              ]
            }
          ],
          max_tokens: 500
        })
      });

      const data = await response.json();

      if (data.error) {
        setResult(`Error: ${data.error.message}`);
      } else {
        const content = data.choices[0]?.message?.content || 'No response received';
        setResult(content);
      }
    } catch (error: any) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🦁 AniVision</Text>
        <Text style={styles.subtitle}>Animal Species Identification</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Settings</Text>
        <Text style={styles.label}>OpenAI API Key:</Text>
        <TextInput
          style={styles.input}
          placeholder="sk-..."
          value={apiKey}
          onChangeText={setApiKey}
          secureTextEntry
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📸 Scan Image</Text>
        <Text style={styles.label}>Image URL:</Text>
        <TextInput
          style={styles.input}
          placeholder="https://example.com/animal.jpg"
          value={imageUrl}
          onChangeText={setImageUrl}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleScan}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Analyzing...' : 'Identify Species'}
          </Text>
        </TouchableOpacity>
      </View>

      {result ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Results</Text>
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.infoTitle}>ℹ️ How to Use</Text>
        <Text style={styles.infoText}>
          1. Enter your OpenAI API key (get one at platform.openai.com){'\n'}
          2. Paste the URL of an animal image{'\n'}
          3. Click "Identify Species" to analyze{'\n'}
          {'\n'}
          Note: This is a web demo version. The full app includes:{'\n'}
          • Camera integration{'\n'}
          • Local image storage{'\n'}
          • Gallery view{'\n'}
          • Offline caching{'\n'}
          • Image history
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Platform: {Platform.OS} | Status: 65% Complete
        </Text>
      </View>
    </ScrollView>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MainContent />
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4a90e2',
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#e6f2ff',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#4a90e2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#95c3e8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultBox: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4a90e2',
  },
  resultText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});

export default App;
