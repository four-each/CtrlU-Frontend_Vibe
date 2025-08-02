import {AppRegistry} from 'react-native';
import App from './src/App';

AppRegistry.registerComponent('main', () => App);

// 웹 플랫폼 지원
if (typeof document !== 'undefined') {
  AppRegistry.runApplication('main', {
    rootTag: document.getElementById('root') || document.getElementById('main'),
  });
} 