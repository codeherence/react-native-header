import React, { useImperativeHandle } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedRef } from 'react-native-reanimated';

import FadingView from './FadingView';
import { useScrollContainerLogic } from './useScrollContainerLogic';
import type { SharedScrollContainerProps } from './types';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

type AnimatedScrollViewProps = React.ComponentProps<typeof Animated.ScrollView> & {
  children?: React.ReactNode;
};

const ScrollViewWithHeadersInputComp = (
  {
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
    disableAutoFixScroll = false,
    children,
    /** At the moment, we will not allow overriding of this since the scrollHandler needs it. */
    onScroll: _unusedOnScroll,
    absoluteHeader = false,
    initialAbsoluteHeaderHeight = 0,
    contentContainerStyle,
    automaticallyAdjustsScrollIndicatorInsets,
    ...rest
  }: AnimatedScrollViewProps & SharedScrollContainerProps,
  ref: React.Ref<Animated.ScrollView | null>
) => {
  const insets = useSafeAreaInsets();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  useImperativeHandle(ref, () => scrollRef.current);

  const {
    scrollY,
    showNavBar,
    largeHeaderHeight,
    largeHeaderOpacity,
    scrollHandler,
    debouncedFixScroll,
    absoluteHeaderHeight,
    onAbsoluteHeaderLayout,
  } = useScrollContainerLogic({
    scrollRef,
    largeHeaderShown,
    disableAutoFixScroll,
    largeHeaderExists: !!LargeHeaderComponent,
    absoluteHeader,
    initialAbsoluteHeaderHeight,
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
      {!absoluteHeader && HeaderComponent({ showNavBar, scrollY })}
      <AnimatedScrollView
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
        contentContainerStyle={[
          contentContainerStyle,
          absoluteHeader ? { paddingTop: absoluteHeaderHeight } : undefined,
        ]}
        automaticallyAdjustsScrollIndicatorInsets={
          automaticallyAdjustsScrollIndicatorInsets !== undefined
            ? automaticallyAdjustsScrollIndicatorInsets
            : !absoluteHeader
        }
        scrollIndicatorInsets={{ top: absoluteHeader ? absoluteHeaderHeight : 0 }}
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
      </AnimatedScrollView>

      {absoluteHeader && (
        <View style={styles.absoluteHeader} onLayout={onAbsoluteHeaderLayout}>
          {HeaderComponent({ showNavBar, scrollY })}
        </View>
      )}
    </View>
  );
};

const ScrollViewWithHeaders = React.forwardRef<
  Animated.ScrollView,
  AnimatedScrollViewProps & SharedScrollContainerProps
>(ScrollViewWithHeadersInputComp);

export default ScrollViewWithHeaders;

const styles = StyleSheet.create({
  container: { flex: 1 },
  absoluteHeader: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
  },
});
