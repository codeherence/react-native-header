import type { StyleProp, ViewStyle } from 'react-native';
import type Animated from 'react-native-reanimated';

export interface SurfaceComponentProps {
  /**
   * Animated value between 0 and 1 that indicates whether the small header's content should be
   * visible. This is used to animate the header's content in and out.
   *
   * @type {Animated.SharedValue<number>}
   */
  showNavBar: Animated.SharedValue<number>;
}

/**
 * The props for the navigation bar component.
 */
export interface HeaderProps {
  /**
   * The style of the root container of the header.
   *
   * @default undefined
   * @type {StyleProp<ViewStyle>}
   */
  headerStyle?: StyleProp<ViewStyle>;
  /**
   * The component to be rendered on the left side of the header. This is usually a back button.
   *
   * @default undefined
   * @type {React.ReactNode}
   */
  headerLeft?: React.ReactNode;
  /**
   * The style of the headerLeft container component.
   *
   * @default undefined
   * @type {StyleProp<ViewStyle>}
   */
  headerLeftStyle?: StyleProp<ViewStyle>;
  /**
   * Whether the headerLeft component should fade in when the header is scrolled up.
   *
   * @default false
   * @type {boolean}
   */
  headerLeftFadesIn?: boolean;
  /**
   * The component to be rendered in the center of the header.
   *
   * @default undefined
   * @type {React.ReactNode}
   */
  headerCenter?: React.ReactNode;
  /**
   * The style of the headerCenter container component.
   *
   * @default undefined
   * @type {StyleProp<ViewStyle>}
   */
  headerCenterStyle?: StyleProp<ViewStyle>;
  /**
   * Whether the headerCenter component should fade in when the header is scrolled up.
   *
   * @default true
   * @type {boolean}
   */
  headerCenterFadesIn?: boolean;
  /**
   * The component to be rendered on the right side of the header.
   *
   * @default undefined
   * @type {React.ReactNode}
   */
  headerRight?: React.ReactNode;
  /**
   * The style of the headerRight container component.
   *
   * @default undefined
   * @type {StyleProp<ViewStyle>}
   */
  headerRightStyle?: StyleProp<ViewStyle>;
  /**
   * Whether the headerRight component should fade in when the header is scrolled up.
   *
   * @default false
   * @type {boolean}
   */
  headerRightFadesIn?: boolean;
  /**
   * Whether the header should ignore the top safe area. If you are rendering the header in an iOS
   * modal, you should set this to true.
   *
   * @default false
   * @type {boolean}
   */
  ignoreTopSafeArea?: boolean;
  /**
   * Animated value between 0 and 1 that indicates whether the small header's content should be
   * visible. This is used to animate the header's content in and out.
   *
   * @type {Animated.SharedValue<number>}
   */
  showNavBar: Animated.SharedValue<number>;
  /**
   * Whether the header should have no bottom border.
   *
   * @default false
   * @type {boolean}
   */
  noBottomBorder?: boolean;
  /**
   * The color of the border when the header is not scrolled up.
   *
   * @default '#E5E5E5'
   * @type {string}
   */
  initialBorderColor?: string;
  /**
   * The color of the bottom border.
   *
   * @default '#E5E5E5'
   * @type {string}
   */
  borderColor?: string;
  /**
   * The width of the bottom border.
   *
   * @default {StyleSheet.hairlineWidth}
   * @type {number}
   */
  borderWidth?: number;
  /**
   * A custom component to be rendered as the header's surface. This is useful if you want to
   * customize the header's surface with a background/blur.
   *
   * @param {SurfaceComponentProps} props
   * @returns {React.ReactNode}
   */
  SurfaceComponent?: (props: SurfaceComponentProps) => React.ReactNode;
}

/**
 * The props for the large header component.
 */
export interface LargeHeaderProps {
  /**
   * The style of the root container of the header.
   *
   * @default undefined
   * @type {StyleProp<ViewStyle>}
   */
  headerStyle?: StyleProp<ViewStyle>;
}
