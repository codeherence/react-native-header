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
  /**
   * The scroll position of the scroll view.
   *
   * @type {Animated.SharedValue<number>}
   */
  scrollY: Animated.SharedValue<number>;
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
   */
  onLargeHeaderLayout?: (rect: LayoutRectangle) => void;
  /**
   * The large header's container style.
   *
   * @default undefined
   */
  largeHeaderContainerStyle?: StyleProp<ViewStyle>;
  /**
   * The style of the root container of the scoll container.
   *
   * @default undefined
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Whether the scroll container should ignore the left safe area. This is useful for landscape
   * mode on iOS where devices have a notch/status bar on the left side.
   *
   * @default false
   */
  ignoreLeftSafeArea?: boolean;
  /**
   * Whether the scroll container should ignore the right safe area. This is useful for landscape
   * mode on iOS where devices have a notch/status bar on the right side.
   *
   * @default false
   */
  ignoreRightSafeArea?: boolean;
  /**
   * Disables the auto fix scroll mechanism. This is useful if you want to disable the auto scroll
   * when the large header is partially visible.
   *
   * @default false
   */
  disableAutoFixScroll?: boolean;
  /**
   * Fires if a user initiates a scroll gesture.
   */
  onScrollBeginDrag?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /**
   * Fires when a user has finished scrolling.
   */
  onScrollEndDrag?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /**
   * Fires when scroll view has begun moving.
   */
  onMomentumScrollBegin?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /**
   * Fires when scroll view has finished moving.
   */
  onMomentumScrollEnd?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /**
   * This property is not supported at the moment. If you would like to listen to
   * scroll events, use the useScrollViewOffset hook with a ref.
   */
  onScroll?: React.ComponentProps<typeof Animated.ScrollView>['onScroll'];
};
