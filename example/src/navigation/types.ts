import type { NavigationProp } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  SimpleUsageScreen: undefined;
  FlatListUsageScreen: undefined;
};

// Overrides the typing for useNavigation in @react-navigation/native to support the internal
// navigation prop type.
declare module '@react-navigation/native' {
  export function useNavigation<
    T extends ReactNavigation.RootParamList = NavigationProp<RootStackParamList>
  >(): T;
}

export type HomeScreenNavigationProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export type ProfileScreenNavigationProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export type SimpleUsageScreenNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  'SimpleUsageScreen'
>;

export type FlatListUsageScreenNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  'FlatListUsageScreen'
>;