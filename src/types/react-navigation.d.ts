declare module '@react-navigation/native' {
  import { ComponentType } from 'react';
  import { RouteProp } from '@react-navigation/native';

  export function useNavigation<T = any>(): T;
  export function useRoute<T = any>(): RouteProp<T>;
  export function useFocusEffect(effect: () => void | (() => void)): void;
  
  export interface RouteProp<ParamList extends ParamListBase, RouteName extends keyof ParamList> {
    key: string;
    name: RouteName;
    params: ParamList[RouteName];
  }
  
  export interface ParamListBase {
    [key: string]: object | undefined;
  }

  export const NavigationContainer: ComponentType<any>;
}

declare module '@react-navigation/stack' {
  import { ComponentType } from 'react';
  import { ParamListBase } from '@react-navigation/native';

  export interface StackNavigationProp<ParamList extends ParamListBase, RouteName extends keyof ParamList = keyof ParamList> {
    navigate<RouteName extends keyof ParamList>(...args: undefined extends ParamList[RouteName] ? [screen: RouteName] | [screen: RouteName, params: ParamList[RouteName]] : [screen: RouteName, params: ParamList[RouteName]]): void;
    goBack(): void;
    replace<RouteName extends keyof ParamList>(...args: undefined extends ParamList[RouteName] ? [screen: RouteName] | [screen: RouteName, params: ParamList[RouteName]] : [screen: RouteName, params: ParamList[RouteName]]): void;
  }

  export function createStackNavigator<ParamList extends ParamListBase>(): {
    Navigator: ComponentType<any>;
    Screen: ComponentType<any>;
  };
} 