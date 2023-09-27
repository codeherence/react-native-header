import { useCallback, useMemo, useState } from 'react';
import { LayoutChangeEvent, NativeScrollEvent } from 'react-native';
import Animated, {
  interpolate,
  runOnUI,
  scrollTo,
  useDerivedValue,
  useSharedValue,
  withTiming,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { useDebouncedCallback } from 'use-debounce';
import type { SharedScrollContainerProps } from './types';

/**
 * The arguments for the useScrollContainerLogic hook.
 */
interface UseScrollContainerLogicArgs {
  /**
   * The ScrollView or FlatList ref that is rendered in the scroll container.
   *
   * @type {React.RefObject<Animated.ScrollView | Animated.FlatList<any>>}
   */
  scrollRef: React.RefObject<Animated.ScrollView | Animated.FlatList<any>>;
  /**
   * This is a hack to ensure that the larger repositions itself correctly.
   *
   * @type {number}
   * @default 4
   */
  adjustmentOffset?: number;
  /**
   * Whether or not the large header should be shown. This is used to animate the large header in
   * and out.
   *
   * @type {SharedScrollContainerProps['largeHeaderShown']}
   */
  largeHeaderShown: SharedScrollContainerProps['largeHeaderShown'];
  /**
   * Whether or not the large header exists.
   */
  largeHeaderExists: boolean;
  /**
   * Disables the auto fix scroll mechanism. This is useful if you want to disable the auto scroll
   * when the large header is partially visible.
   *
   * @default false
   */
  disableAutoFixScroll?: boolean;
  /**
   * This property controls whether or not the header component is absolutely positioned.
   * This is useful if you want to render a header component that allows for transparency.
   */
  absoluteHeader?: boolean;
  /**
   * This property is used when `absoluteHeader` is true. This is the initial height of the
   * absolute header. Since the header's height is computed on its layout event, this is used
   * to set the initial height of the header so that it doesn't jump when it is initially rendered.
   */
  initialAbsoluteHeaderHeight?: number;
  /**
   * A number between 0 and 1 representing at what point the header should fade in,
   * based on the percentage of the LargeHeader's height. For example, if this is set to 0.5,
   * the header will fade in when the scroll position is at 50% of the LargeHeader's height.
   *
   * @default 1
   */
  headerFadeInThreshold?: number;
  /**
   * Whether or not the scroll container is inverted.
   */
  inverted?: boolean;
  /**
   * A custom worklet that allows custom tracking scroll container's
   * state (i.e., its scroll contentInset, contentOffset, etc.). Please
   * ensure that this function is a [worklet](https://docs.swmansion.com/react-native-reanimated/docs/2.x/fundamentals/worklets/).
   */
  onScrollWorklet?: (evt: NativeScrollEvent) => void;
}

/**
 * This hook computes the animation logic for the scroll container.
 *
 * @param {UseScrollContainerLogicArgs} args
 * @returns {ReturnType<UseScrollContainerLogicArgs>}
 */
export const useScrollContainerLogic = ({
  scrollRef,
  largeHeaderShown,
  largeHeaderExists,
  disableAutoFixScroll = false,
  adjustmentOffset = 4,
  absoluteHeader = false,
  initialAbsoluteHeaderHeight = 0,
  headerFadeInThreshold = 1,
  inverted,
  onScrollWorklet,
}: UseScrollContainerLogicArgs) => {
  const [absoluteHeaderHeight, setAbsoluteHeaderHeight] = useState(initialAbsoluteHeaderHeight);
  const scrollY = useSharedValue(0);
  const largeHeaderHeight = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(
    (event) => {
      if (onScrollWorklet) onScrollWorklet(event);

      scrollY.value = event.contentOffset.y;
    },
    [onScrollWorklet]
  );

  const showNavBar = useDerivedValue(() => {
    if (!largeHeaderExists) return withTiming(scrollY.value <= 0 ? 0 : 1, { duration: 250 });

    if (largeHeaderHeight.value < adjustmentOffset) return 0;

    if (largeHeaderShown) {
      largeHeaderShown.value = withTiming(
        scrollY.value <= largeHeaderHeight.value * headerFadeInThreshold - adjustmentOffset ? 0 : 1,
        { duration: 250 }
      );
    }

    return withTiming(
      scrollY.value <= largeHeaderHeight.value * headerFadeInThreshold - adjustmentOffset ? 0 : 1,
      { duration: 250 }
    );
  }, [largeHeaderExists]);

  const largeHeaderOpacity = useDerivedValue(() => {
    return interpolate(showNavBar.value, [0, 1], [1, 0]);
  });

  const debouncedFixScroll = useDebouncedCallback(() => {
    if (disableAutoFixScroll) return;

    if (largeHeaderHeight.value !== 0 && scrollRef && scrollRef.current) {
      if (scrollY.value >= largeHeaderHeight.value / 2 && scrollY.value < largeHeaderHeight.value) {
        // Scroll to end of large header
        runOnUI(() => {
          'worklet';
          scrollTo(scrollRef, 0, largeHeaderHeight.value, true);
        })();
      } else if (scrollY.value >= 0 && scrollY.value < largeHeaderHeight.value / 2) {
        // Scroll to top
        runOnUI(() => {
          'worklet';
          scrollTo(scrollRef, 0, 0, true);
        })();
      }
    }
  }, 50);

  const onAbsoluteHeaderLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (absoluteHeader) {
        setAbsoluteHeaderHeight(e.nativeEvent.layout.height);
      }
    },
    [absoluteHeader]
  );

  const scrollViewAdjustments = useMemo(() => {
    return {
      scrollIndicatorInsets: {
        top: absoluteHeader && !inverted ? absoluteHeaderHeight : 0,
        bottom: absoluteHeader && inverted ? absoluteHeaderHeight : 0,
      },
      contentContainerStyle: {
        paddingTop: absoluteHeader && !inverted ? absoluteHeaderHeight : 0,
        paddingBottom: absoluteHeader && inverted ? absoluteHeaderHeight : 0,
      },
    };
  }, [inverted, absoluteHeaderHeight, absoluteHeader]);

  return {
    scrollY,
    showNavBar,
    largeHeaderHeight,
    largeHeaderOpacity,
    scrollHandler,
    debouncedFixScroll,
    absoluteHeaderHeight,
    onAbsoluteHeaderLayout,
    scrollViewAdjustments,
  };
};
