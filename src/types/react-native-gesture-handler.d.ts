declare module 'react-native-gesture-handler' {
  import { ComponentType } from 'react';
  import { ViewProps } from 'react-native';

  export enum State {
    UNDETERMINED = 0,
    FAILED,
    BEGAN,
    CANCELLED,
    ACTIVE,
    END,
  }

  export interface PanGestureHandlerProps extends ViewProps {
    onGestureEvent?: (event: any) => void;
    onHandlerStateChange?: (event: any) => void;
    minDist?: number;
    activeOffsetX?: number | number[];
    activeOffsetY?: number | number[];
    failOffsetX?: number | number[];
    failOffsetY?: number | number[];
  }

  export const PanGestureHandler: ComponentType<PanGestureHandlerProps>;
  export const TapGestureHandler: ComponentType<any>;
  export const LongPressGestureHandler: ComponentType<any>;
  export const PinchGestureHandler: ComponentType<any>;
  export const RotationGestureHandler: ComponentType<any>;
  export const FlingGestureHandler: ComponentType<any>;
  export const ForceTouchGestureHandler: ComponentType<any>;
  export const NativeViewGestureHandler: ComponentType<any>;
  export const RawButton: ComponentType<any>;
  export const BaseButton: ComponentType<any>;
  export const RectButton: ComponentType<any>;
  export const BorderlessButton: ComponentType<any>;
  export const TouchableHighlight: ComponentType<any>;
  export const TouchableNativeFeedback: ComponentType<any>;
  export const TouchableOpacity: ComponentType<any>;
  export const TouchableWithoutFeedback: ComponentType<any>;
  export const ScrollView: ComponentType<any>;
  export const Switch: ComponentType<any>;
  export const TextInput: ComponentType<any>;
  export const DrawerLayoutAndroid: ComponentType<any>;
  export const FlatList: ComponentType<any>;
  export const Swipeable: ComponentType<any>;
  export const GestureHandlerRootView: ComponentType<ViewProps>;
} 