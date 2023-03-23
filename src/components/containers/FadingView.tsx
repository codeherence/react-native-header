import React, { forwardRef } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useAnimatedProps, useAnimatedStyle } from 'react-native-reanimated';

type AnimatedViewPointerEvents = React.ComponentProps<typeof Animated.View>['pointerEvents'];

type FadingViewProps = {
  /**
   * Animated props to be passed to the Animated.View
   *
   * @default undefined
   * @type {Animated.AnimateStyle<StyleProp<ViewStyle>>}
   */
  style?: StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>>;
  /**
   * The opacity value to be used for the fade animation.
   *
   * @default undefined
   * @type {Animated.SharedValue<number>}
   */
  opacity: Animated.SharedValue<number>;
  /**
   * The opacity threshold to enable pointer events. If the opacity value is greater
   * than or equal to this value, pointer events will be enabled. Otherwise, pointer
   * events will be disabled.
   *
   * @default 1
   * @type {number}
   */
  opacityThresholdToEnablePointerEvents?: number;
  /**
   * The children to be rendered inside the FadingView.
   */
  children: React.ReactNode;
} & React.ComponentProps<typeof Animated.View>;

const FadingView = forwardRef<Animated.View, FadingViewProps>(
  (
    {
      children,
      style,
      opacity,
      animatedProps = {},
      opacityThresholdToEnablePointerEvents = 1,
      ...rest
    },
    ref
  ) => {
    const _animatedProps = useAnimatedProps(() => {
      const _pointerEvents: AnimatedViewPointerEvents =
        opacity.value >= opacityThresholdToEnablePointerEvents ? 'auto' : 'none';
      return { pointerEvents: _pointerEvents };
    }, [opacityThresholdToEnablePointerEvents]);
    const fadeStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

    return (
      <Animated.View
        ref={ref}
        style={[styles.container, style, fadeStyle]}
        animatedProps={{ ..._animatedProps, ...animatedProps }}
        {...rest}
      >
        {children}
      </Animated.View>
    );
  }
);

export default FadingView;

const styles = StyleSheet.create({ container: { opacity: 0 } });
