import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './package.json';

// Register the app for React Native
AppRegistry.registerComponent(appName, () => App);

// Run the app for web
if (typeof document !== 'undefined') {
  AppRegistry.runApplication(appName, {
    rootTag: document.getElementById('root'),
  });
}
