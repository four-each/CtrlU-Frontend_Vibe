declare module 'react-native-safe-area-context' {
  import { ComponentType } from 'react';
  import { ViewProps } from 'react-native';

  export interface SafeAreaViewProps extends ViewProps {
    edges?: ('top' | 'right' | 'bottom' | 'left')[];
  }

  export const SafeAreaView: ComponentType<SafeAreaViewProps>;
  export const SafeAreaProvider: ComponentType<ViewProps>;
  export const useSafeAreaInsets: () => {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
} 