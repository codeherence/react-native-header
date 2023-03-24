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
}: UseScrollContainerLogicArgs) => {
  const scrollY = useSharedValue(0);
  const largeHeaderHeight = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const showNavBar = useDerivedValue(() => {
    if (!largeHeaderExists) return withTiming(scrollY.value <= 0 ? 0 : 1, { duration: 250 });

    if (largeHeaderHeight.value < adjustmentOffset) return 0;

    if (largeHeaderShown) {
      largeHeaderShown.value = withTiming(
        scrollY.value <= largeHeaderHeight.value - adjustmentOffset ? 0 : 1,
        {
          duration: 250,
        }
      );
    }

    return withTiming(scrollY.value <= largeHeaderHeight.value - adjustmentOffset ? 0 : 1, {
      duration: 250,
    });
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

  return {
    scrollY,
    showNavBar,
    largeHeaderHeight,
    largeHeaderOpacity,
    scrollHandler,
    debouncedFixScroll,
  };
};
