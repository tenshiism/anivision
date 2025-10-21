/**
 * Stack Navigator
 *
 * Implements the main stack navigation for all app screens.
 * Handles navigation between Welcome, Home, Camera, Gallery,
 * ImageDetail, and ScanResult screens with proper animations
 * and transitions.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import type {
  RootStackParamList,
  WelcomeScreenProps,
  HomeScreenProps,
  CameraScreenProps,
  GalleryScreenProps,
  ImageDetailScreenProps,
  ScanResultScreenProps,
} from './types';

const Stack = createStackNavigator<RootStackParamList>();

/**
 * Default Stack Navigator Options
 * Provides consistent styling across all screens
 */
const defaultScreenOptions: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: '#007AFF',
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  headerBackTitleVisible: false,
  cardStyle: {
    backgroundColor: '#fff',
  },
  animationEnabled: true,
  gestureEnabled: true,
  gestureDirection: 'horizontal',
};

/**
 * Welcome Screen Component (Placeholder)
 * Initial landing screen with drawer access
 */
const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        {/* Header with Menu Button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.getParent()?.openDrawer?.()}
            accessibilityLabel="Open menu"
            accessibilityRole="button"
          >
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* Welcome Content */}
        <View style={styles.content}>
          <Text style={styles.logo}>🦁</Text>
          <Text style={styles.title}>AniVision</Text>
          <Text style={styles.subtitle}>
            AI-Powered Animal Species Identification
          </Text>
          <Text style={styles.description}>
            Take a photo or select from gallery to identify any animal species
          </Text>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => navigation.navigate('Camera')}
              accessibilityLabel="Take photo"
              accessibilityRole="button"
            >
              <Text style={styles.buttonIcon}>📷</Text>
              <Text style={styles.primaryButtonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => navigation.navigate('Gallery')}
              accessibilityLabel="Choose from gallery"
              accessibilityRole="button"
            >
              <Text style={styles.buttonIcon}>🖼️</Text>
              <Text style={styles.secondaryButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => navigation.navigate('Home')}
              accessibilityLabel="View history"
              accessibilityRole="button"
            >
              <Text style={styles.buttonIcon}>📚</Text>
              <Text style={styles.secondaryButtonText}>View History</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by OpenAI Vision</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

/**
 * Home Screen Component (Placeholder)
 * Displays grid of previously identified images
 */
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.screenTitle}>Image History</Text>
        <Text style={styles.screenSubtitle}>
          Your previously identified animals
        </Text>

        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📸</Text>
          <Text style={styles.emptyText}>No images yet</Text>
          <Text style={styles.emptySubtext}>
            Start by taking a photo or selecting from gallery
          </Text>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.navigate('Camera')}
          >
            <Text style={styles.primaryButtonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

/**
 * Camera Screen Component (Placeholder)
 * Camera interface for capturing animal photos
 */
const CameraScreen: React.FC<CameraScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.screenTitle}>Camera</Text>
        <View style={styles.cameraPlaceholder}>
          <Text style={styles.cameraIcon}>📷</Text>
          <Text style={styles.cameraText}>Camera View</Text>
          <Text style={styles.cameraSubtext}>
            Camera functionality will be implemented here
          </Text>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton, styles.captureButton]}
            onPress={() => {
              // Simulate navigation to scan result
              navigation.navigate('ScanResult', {
                result: {
                  image: {
                    uri: 'placeholder',
                    fileName: 'captured.jpg',
                    type: 'image/jpeg',
                    fileSize: 1024,
                  },
                  identification: {
                    commonName: 'African Lion',
                    scientificName: 'Panthera leo',
                    confidence: 0.95,
                    summary: 'A large carnivorous feline from Africa.',
                  },
                  timestamp: new Date(),
                },
              });
            }}
          >
            <Text style={styles.primaryButtonText}>Capture Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

/**
 * Gallery Screen Component (Placeholder)
 * Gallery picker for selecting existing photos
 */
const GalleryScreen: React.FC<GalleryScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.screenTitle}>Gallery</Text>
        <View style={styles.galleryPlaceholder}>
          <Text style={styles.galleryIcon}>🖼️</Text>
          <Text style={styles.galleryText}>Select Image</Text>
          <Text style={styles.gallerySubtext}>
            Gallery picker will be implemented here
          </Text>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => {
              // Simulate navigation to scan result
              navigation.navigate('ScanResult', {
                result: {
                  image: {
                    uri: 'placeholder',
                    fileName: 'selected.jpg',
                    type: 'image/jpeg',
                    fileSize: 2048,
                  },
                  identification: {
                    commonName: 'Bengal Tiger',
                    scientificName: 'Panthera tigris tigris',
                    confidence: 0.92,
                    summary: 'A tiger subspecies found primarily in India.',
                  },
                  timestamp: new Date(),
                },
              });
            }}
          >
            <Text style={styles.primaryButtonText}>Select from Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

/**
 * Image Detail Screen Component (Placeholder)
 * Shows detailed information about an identified image
 */
const ImageDetailScreen: React.FC<ImageDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { image } = route.params;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.screenTitle}>Image Details</Text>

        <View style={styles.detailCard}>
          <Text style={styles.detailIcon}>🦁</Text>
          <Text style={styles.detailTitle}>
            {image.identification.commonName}
          </Text>
          <Text style={styles.detailScientific}>
            {image.identification.scientificName}
          </Text>
          <Text style={styles.detailSummary}>
            {image.identification.summary}
          </Text>

          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>Confidence:</Text>
            <Text style={styles.confidenceValue}>
              {(image.identification.confidence * 100).toFixed(0)}%
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Re-scan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

/**
 * Scan Result Screen Component (Placeholder)
 * Displays scan results after image identification
 */
const ScanResultScreen: React.FC<ScanResultScreenProps> = ({
  navigation,
  route,
}) => {
  const { result } = route.params;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.screenTitle}>Scan Result</Text>

        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultIcon}>✅</Text>
            <Text style={styles.resultStatus}>Identification Complete</Text>
          </View>

          <View style={styles.resultContent}>
            <Text style={styles.resultCommonName}>
              {result.identification.commonName}
            </Text>
            <Text style={styles.resultScientificName}>
              {result.identification.scientificName}
            </Text>

            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceBadgeText}>
                {(result.identification.confidence * 100).toFixed(0)}% Confident
              </Text>
            </View>

            <View style={styles.summaryContainer}>
              <Text style={styles.summaryLabel}>Summary:</Text>
              <Text style={styles.summaryText}>
                {result.identification.summary}
              </Text>
            </View>
          </View>

          <View style={styles.resultActions}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.primaryButtonText}>Save to History</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => navigation.navigate('Welcome')}
            >
              <Text style={styles.secondaryButtonText}>Scan Another</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

/**
 * Stack Navigator Component
 * Configures the main stack navigation with all screens
 */
const StackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={defaultScreenOptions}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'History',
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          title: 'Take Photo',
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{
          title: 'Select Photo',
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="ImageDetail"
        component={ImageDetailScreen}
        options={{
          title: 'Details',
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="ScanResult"
        component={ScanResultScreen}
        options={{
          title: 'Result',
          headerShown: true,
          headerLeft: () => null, // Prevent back navigation
          gestureEnabled: false, // Disable swipe back gesture
        }}
      />
    </Stack.Navigator>
  );
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  menuButton: {
    padding: 10,
  },
  menuIcon: {
    fontSize: 28,
    color: '#007AFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 8,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  screenSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 40,
  },
  cameraIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  cameraText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cameraSubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
  },
  captureButton: {
    width: '80%',
  },
  galleryPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 40,
  },
  galleryIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  galleryText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  gallerySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  detailIcon: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 15,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  detailScientific: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  detailSummary: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  confidenceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  confidenceLabel: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  confidenceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  resultStatus: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
  },
  resultContent: {
    marginBottom: 20,
  },
  resultCommonName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  resultScientificName: {
    fontSize: 20,
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  confidenceBadge: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  confidenceBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  summaryContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  resultActions: {
    marginTop: 10,
  },
});

export default StackNavigator;
