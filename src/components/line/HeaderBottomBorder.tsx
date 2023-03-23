import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

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
  borderColor = '#E5E5E5',
  borderWidth = 1,
}) => {
  const borderBottomStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        styles.line,
        borderBottomStyle,
        { height: borderWidth, backgroundColor: borderColor },
        style,
      ]}
    />
  );
};

export default HeaderBottomBorder;

const styles = StyleSheet.create({ line: { width: '100%' } });
