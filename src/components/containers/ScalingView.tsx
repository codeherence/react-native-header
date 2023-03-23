import React from 'react';
import { ViewProps, Dimensions } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

interface AnimatedScalingViewProps extends ViewProps {
  /**
   * The scroll position to use for scaling and translating the view.
   *
   * @type {Animated.SharedValue<number>}
   */
  scrollY: Animated.SharedValue<number>;
  /**
   * The start scroll position for scaling and translating the view. The view will
   * clamp to this value.
   *
   * @type {number}
   * @default 0
   */
  startRange?: number;
  /**
   * The scale to use at the start point.
   *
   * @type {number}
   * @default 1
   */
  startScale?: number;
  /**
   * The end scroll position for scaling and translating the view. The view will
   * clamp to this value.
   *
   * @type {number}
   * @default Dimensions.get('window').height * 0.1
   */
  endRange?: number;
  /**
   * The scale to use at the end point. The view will clamp to this scale.
   *
   * @type {number}
   * @default 1.05
   */
  endScale?: number;
  /**
   * The direction to translate the view. This is useful for mimicking the behavior
   * of the iOS navigation bar. **Note:** left translation has not been implemented
   * yet.
   *
   * right - The view will translate to the right.
   * left - The view will translate to the left.
   * none - The view will not translate - it will only scale.
   *
   * @type {'right' | 'left' | 'none'}
   * @default 'right'
   */
  translationDirection?: 'right' | 'left' | 'none';
  /**
   * The children to apply the scaling and translation to.
   *
   * @type {React.ReactNode}
   */
  children?: React.ReactNode;
}

/**
 * A view that scales and translates based on the scroll position. This is useful for
 * mimicking the behavior of the iOS navigation bar.
 *
 * @param {AnimatedScalingViewProps} props
 */
const AnimatedScalingView: React.FunctionComponent<AnimatedScalingViewProps> = ({
  style,
  startRange = 0,
  startScale = 1,
  endRange = Dimensions.get('window').height * 0.1,
  endScale = 1.05,
  scrollY,
  translationDirection = 'right',
  children,
  ...viewProps
}) => {
  const width = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const scaleInterpolation = interpolate(
      -scrollY.value,
      [startRange, endRange],
      [startScale, endScale],
      Extrapolate.CLAMP
    );

    if (translationDirection === 'none') {
      return { transform: [{ scale: scaleInterpolation }] };
    }

    if (translationDirection === 'right') {
      const scaleTransformOffset = interpolate(
        scaleInterpolation,
        [startScale, endScale],
        [0, (width.value * (endScale - startScale)) / 2],
        Extrapolate.CLAMP
      );

      return {
        transform: [{ scale: scaleInterpolation }, { translateX: scaleTransformOffset }],
      };
    }

    // For now, we only support right translations.
    // TODO: Implement left translations.
    return {};
  }, [translationDirection, startRange, endRange, startScale, endScale]);

  return (
    <Animated.View
      onLayout={(evt) => (width.value = evt.nativeEvent.layout.width)}
      style={[animatedStyle, style]}
      {...viewProps}
    >
      {children}
    </Animated.View>
  );
};

export default AnimatedScalingView;
