/**
 * Drawer Navigator
 *
 * Implements the slide-out drawer for accessing app settings and information.
 * The drawer is accessible from the welcome screen and provides:
 * - Settings screen access
 * - App information/about screen
 * - API configuration options
 * - Version information
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContentComponentProps,
  DrawerItemList,
} from '@react-navigation/drawer';
import type { DrawerParamList } from './types';

// Placeholder imports for screens (will be implemented later)
// import StackNavigator from './StackNavigator';
// import SettingsScreen from '../screens/SettingsScreen';
// import AboutScreen from '../screens/AboutScreen';

const Drawer = createDrawerNavigator<DrawerParamList>();

/**
 * Custom Drawer Content Component
 * Provides a customized drawer UI with header, menu items, and footer
 */
const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { navigation, state } = props;

  return (
    <SafeAreaView style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerContent}
      >
        {/* Drawer Header */}
        <View style={styles.drawerHeader}>
          <Text style={styles.appTitle}>AniVision</Text>
          <Text style={styles.appSubtitle}>Animal Species Identifier</Text>
        </View>

        {/* Drawer Menu Items */}
        <View style={styles.drawerItems}>
          <DrawerItemList {...props} />
        </View>

        {/* Custom Menu Items */}
        <View style={styles.customItems}>
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => navigation.navigate('Settings')}
            accessibilityLabel="Settings"
            accessibilityRole="button"
          >
            <Text style={styles.drawerItemIcon}>⚙️</Text>
            <Text style={styles.drawerItemText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => navigation.navigate('About')}
            accessibilityLabel="About"
            accessibilityRole="button"
          >
            <Text style={styles.drawerItemIcon}>ℹ️</Text>
            <Text style={styles.drawerItemText}>About</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>

      {/* Drawer Footer */}
      <View style={styles.drawerFooter}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
        <Text style={styles.footerSubtext}>Powered by OpenAI Vision</Text>
      </View>
    </SafeAreaView>
  );
};

/**
 * Drawer Navigator Component
 * Configures the drawer navigation with all screens and options
 */
const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: 'left',
        drawerType: 'slide',
        drawerStyle: styles.drawer,
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        swipeEnabled: true,
        swipeEdgeWidth: 50,
        headerShown: false,
        drawerActiveTintColor: '#007AFF',
        drawerInactiveTintColor: '#666',
        drawerLabelStyle: styles.drawerLabel,
        drawerItemStyle: styles.drawerItemStyle,
      }}
    >
      {/* Main Stack Navigator (will contain all app screens) */}
      <Drawer.Screen
        name="Main"
        component={MainStackPlaceholder}
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ focused, color, size }) => (
            <Text style={{ fontSize: size, color }}>🏠</Text>
          ),
        }}
      />

      {/* Settings Screen */}
      <Drawer.Screen
        name="Settings"
        component={SettingsScreenPlaceholder}
        options={{
          drawerLabel: 'Settings',
          drawerIcon: ({ focused, color, size }) => (
            <Text style={{ fontSize: size, color }}>⚙️</Text>
          ),
        }}
      />

      {/* About Screen */}
      <Drawer.Screen
        name="About"
        component={AboutScreenPlaceholder}
        options={{
          drawerLabel: 'About',
          drawerIcon: ({ focused, color, size }) => (
            <Text style={{ fontSize: size, color }}>ℹ️</Text>
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

/**
 * Placeholder Components (to be replaced with actual screens)
 */
const MainStackPlaceholder: React.FC = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>Main Stack Navigator</Text>
    <Text style={styles.placeholderSubtext}>
      This will be replaced with StackNavigator
    </Text>
  </View>
);

const SettingsScreenPlaceholder: React.FC = () => (
  <SafeAreaView style={styles.placeholder}>
    <ScrollView contentContainerStyle={styles.placeholderContent}>
      <Text style={styles.placeholderTitle}>Settings</Text>
      <Text style={styles.placeholderText}>
        Configure your OpenAI API settings here
      </Text>

      {/* API Configuration Section */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>API Configuration</Text>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>OpenAI API URL</Text>
          <Text style={styles.settingValue}>
            https://api.openai.com/v1/chat/completions
          </Text>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>API Key</Text>
          <Text style={styles.settingValue}>••••••••••••••••</Text>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Test Connection</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.primaryButton]}>
          <Text style={[styles.buttonText, styles.primaryButtonText]}>
            Save Settings
          </Text>
        </TouchableOpacity>
      </View>

      {/* App Preferences Section */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>App Preferences</Text>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Auto-save Images</Text>
          <Text style={styles.settingValue}>Enabled</Text>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Image Quality</Text>
          <Text style={styles.settingValue}>High</Text>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
);

const AboutScreenPlaceholder: React.FC = () => (
  <SafeAreaView style={styles.placeholder}>
    <ScrollView contentContainerStyle={styles.placeholderContent}>
      <Text style={styles.placeholderTitle}>About AniVision</Text>

      <View style={styles.aboutSection}>
        <Text style={styles.aboutText}>
          AniVision is an AI-powered animal species identification application
          that uses OpenAI's Vision API to identify animals from photos.
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version:</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Build:</Text>
          <Text style={styles.infoValue}>100</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Platform:</Text>
          <Text style={styles.infoValue}>{Platform.OS}</Text>
        </View>
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.sectionTitle}>Features</Text>
        <Text style={styles.featureText}>• AI-powered species identification</Text>
        <Text style={styles.featureText}>• Scientific and common names</Text>
        <Text style={styles.featureText}>• Local image storage</Text>
        <Text style={styles.featureText}>• Detailed species information</Text>
        <Text style={styles.featureText}>• Image history and gallery</Text>
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.sectionTitle}>Technology</Text>
        <Text style={styles.featureText}>• React Native</Text>
        <Text style={styles.featureText}>• OpenAI Vision API</Text>
        <Text style={styles.featureText}>• TypeScript</Text>
        <Text style={styles.featureText}>• React Navigation</Text>
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.copyrightText}>
          © 2024 AniVision. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  </SafeAreaView>
);

/**
 * Styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  drawer: {
    width: '80%',
    maxWidth: 300,
    backgroundColor: '#fff',
  },
  drawerContent: {
    flexGrow: 1,
  },
  drawerHeader: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#007AFF',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  drawerItems: {
    marginTop: 10,
  },
  customItems: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 2,
  },
  drawerItemIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  drawerItemText: {
    fontSize: 16,
    color: '#333',
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  drawerItemStyle: {
    marginVertical: 2,
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
    marginTop: 4,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  placeholderContent: {
    padding: 20,
    alignItems: 'center',
  },
  placeholderTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  settingsSection: {
    width: '100%',
    marginTop: 30,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  settingItem: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  settingValue: {
    fontSize: 16,
    color: '#333',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  primaryButtonText: {
    color: '#fff',
  },
  aboutSection: {
    width: '100%',
    marginTop: 20,
  },
  aboutText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
    paddingLeft: 10,
  },
  copyrightText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default DrawerNavigator;
