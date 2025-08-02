import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Platform} from 'react-native';

import MainScreen from './screens/MainScreen';
import DetailScreen from './screens/DetailScreen';
import CreateTaskScreen from './screens/CreateTaskScreen';
import CameraScreen from './screens/CameraScreen';

export type RootStackParamList = {
  Main: undefined;
  Detail: {
    taskId: string;
    isMyTask: boolean;
    isCompleted: boolean;
  };
  CreateTask: undefined;
  Camera: {
    mode: 'start' | 'complete';
    taskId?: string;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  const AppContent = () => (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Main"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="Detail" component={DetailScreen} />
          <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
          <Stack.Screen name="Camera" component={CameraScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );

  // 웹에서는 GestureHandlerRootView를 사용하지 않음
  if (Platform.OS === 'web') {
    return <AppContent />;
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AppContent />
    </GestureHandlerRootView>
  );
};

export default App; 