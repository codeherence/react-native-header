import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';

interface HeaderBottomBorderProps {
  /**
   * Animated value that controls the opacity of the bottom border.
   *
   * @type {Animated.SharedValue<number>}
   */
  opacity: Animated.SharedValue<number>;
  /**
   * Style of the bottom border component.
   */
  style?: StyleProp<ViewStyle>;
  /**
   *
   */
  initialBorderColor?: string;
  /**
   * Color of the bottom border.
   *
   * @default '#E5E5E5'
   */
  borderColor?: string;
  /**
   * Width of the bottom border.
   *
   * @default 1
   */
  borderWidth?: number;
}

const HeaderBottomBorder: React.FC<HeaderBottomBorderProps> = ({
  opacity,
  style,
  initialBorderColor = '#E5E5E5',
  borderColor = '#E5E5E5',
  borderWidth = 1,
}) => {
  const borderBottomStyle = useAnimatedStyle(
    () => ({
      backgroundColor: interpolateColor(opacity.value, [0, 1], [initialBorderColor, borderColor]),
    }),
    [initialBorderColor, borderColor]
  );

  return <Animated.View style={[styles.line, borderBottomStyle, { height: borderWidth }, style]} />;
};

export default HeaderBottomBorder;

const styles = StyleSheet.create({ line: { width: '100%' } });
