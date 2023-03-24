import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedRef } from 'react-native-reanimated';

import FadingView from './FadingView';
import { useScrollContainerLogic } from './useScrollContainerLogic';
import type { DisallowedScrollContainerProps, SharedScrollContainerProps } from './types';

type AnimatedScrollViewProps = React.ComponentProps<typeof Animated.ScrollView> & {
  children?: React.ReactNode;
};

const AnimatedScrollViewWithHeaders: React.FC<
  Omit<AnimatedScrollViewProps, DisallowedScrollContainerProps> & SharedScrollContainerProps
> = ({
  largeHeaderShown,
  containerStyle,
  LargeHeaderComponent,
  largeHeaderContainerStyle,
  HeaderComponent,
  onLargeHeaderLayout,
  ignoreLeftSafeArea,
  ignoreRightSafeArea,
  onScrollBeginDrag,
  onScrollEndDrag,
  onMomentumScrollBegin,
  onMomentumScrollEnd,
  disableAutoFixScroll,
  children,
  // @ts-ignore - onScroll is not allowed, but we need to remove it from the props
  onScroll: _unusedOnScroll,
  ...rest
}) => {
  const insets = useSafeAreaInsets();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const {
    scrollY,
    showNavBar,
    largeHeaderHeight,
    largeHeaderOpacity,
    scrollHandler,
    debouncedFixScroll,
  } = useScrollContainerLogic({
    scrollRef,
    largeHeaderShown,
    disableAutoFixScroll,
    largeHeaderExists: !!LargeHeaderComponent,
  });

  return (
    <View
      style={[
        styles.container,
        containerStyle,
        !ignoreLeftSafeArea && { paddingLeft: insets.left },
        !ignoreRightSafeArea && { paddingRight: insets.right },
      ]}
    >
      {HeaderComponent({ showNavBar })}
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        overScrollMode="auto"
        onScroll={scrollHandler}
        automaticallyAdjustContentInsets={false}
        onScrollBeginDrag={(e) => {
          debouncedFixScroll.cancel();
          if (onScrollBeginDrag) onScrollBeginDrag(e);
        }}
        onScrollEndDrag={(e) => {
          debouncedFixScroll();
          if (onScrollEndDrag) onScrollEndDrag(e);
        }}
        onMomentumScrollBegin={(e) => {
          debouncedFixScroll.cancel();
          if (onMomentumScrollBegin) onMomentumScrollBegin(e);
        }}
        onMomentumScrollEnd={(e) => {
          debouncedFixScroll();
          if (onMomentumScrollEnd) onMomentumScrollEnd(e);
        }}
        {...rest}
      >
        {LargeHeaderComponent ? (
          <View
            onLayout={(e) => {
              largeHeaderHeight.value = e.nativeEvent.layout.height;

              if (onLargeHeaderLayout) onLargeHeaderLayout(e.nativeEvent.layout);
            }}
          >
            <FadingView opacity={largeHeaderOpacity} style={largeHeaderContainerStyle}>
              {LargeHeaderComponent({ scrollY, showNavBar })}
            </FadingView>
          </View>
        ) : null}
        {children}
      </Animated.ScrollView>
    </View>
  );
};

export default AnimatedScrollViewWithHeaders;

const styles = StyleSheet.create({ container: { flex: 1 } });
