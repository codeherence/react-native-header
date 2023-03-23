import type {
  LayoutRectangle,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import type Animated from 'react-native-reanimated';

/**
 * The props supplied to the large header component of this scroll container.
 */
export interface ScrollLargeHeaderProps {
  /**
   * The scroll position of the scroll view.
   *
   * @type {Animated.SharedValue<number>}
   */
  scrollY: Animated.SharedValue<number>;
  /**
   * Animated value between 0 and 1 that indicates whether the small header's content should be
   * visible. This is used to animate the header's content in and out.
   *
   * @type {Animated.SharedValue<number>}
   */
  showNavBar: Animated.SharedValue<number>;
}

export interface ScrollHeaderProps {
  /**
   * Animated value between 0 and 1 that indicates whether the small header's content should be
   * visible.
   *
   * @type {Animated.SharedValue<number>}
   */
  showNavBar: Animated.SharedValue<number>;
}

/**
 * The props for the scroll container. This is a container that has a large header component that
 * is rendered under the navigation bar. The navigation bar is rendered on top of the scroll view.
 */
export type SharedScrollContainerProps = {
  /**
   * Whether or not the large header should be shown. This is used to animate the large header in
   * and out.
   */
  largeHeaderShown?: Animated.SharedValue<number>;
  /**
   * The large header component. This is the component that is rendered under the navigation bar.
   *
   * @param {ScrollLargeHeaderProps} props The props given to the large header component.
   * @returns {React.ReactNode}
   */
  LargeHeaderComponent?: (props: ScrollLargeHeaderProps) => React.ReactNode;
  /**
   * The small header component. This is the component that is rendered on top of the scroll view.
   *
   * @param {ScrollHeaderProps} props The props given to the small header component.
   * @returns {React.ReactNode}
   */
  HeaderComponent: (props: ScrollHeaderProps) => React.ReactNode;
  /**
   * This is executed when the onLayout event is fired on the large header container component.
   *
   * @param {LayoutRectangle} rect
   */
  onLargeHeaderLayout?: (rect: LayoutRectangle) => void;
  /**
   * The large header's container style.
   *
   * @default undefined
   * @type {StyleProp<ViewStyle>}
   */
  largeHeaderContainerStyle?: StyleProp<ViewStyle>;
  /**
   * The style of the root container of the scoll container.
   *
   * @default undefined
   * @type {StyleProp<ViewStyle>}
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Whether the scroll container should ignore the left safe area. This is useful for landscape
   * mode on iOS where devices have a notch/status bar on the left side.
   */
  ignoreLeftSafeArea?: boolean;
  /**
   * Whether the scroll container should ignore the right safe area. This is useful for landscape
   * mode on iOS where devices have a notch/status bar on the right side.
   */
  ignoreRightSafeArea?: boolean;
  /**
   * Fires if a user initiates a scroll gesture.
   *
   * @param {NativeSyntheticEvent<NativeScrollEvent>} event
   */
  onScrollBeginDrag?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /**
   * Fires when a user has finished scrolling.
   *
   * @param {NativeSyntheticEvent<NativeScrollEvent>} event
   */
  onScrollEndDrag?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /**
   * Fires when scroll view has begun moving.
   *
   * @param {NativeSyntheticEvent<NativeScrollEvent>} event
   */
  onMomentumScrollBegin?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /**
   * Fires when scroll view has finished moving.
   *
   * @param {NativeSyntheticEvent<NativeScrollEvent>} event
   */
  onMomentumScrollEnd?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};
