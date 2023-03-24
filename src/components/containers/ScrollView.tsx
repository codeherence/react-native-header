import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedRef } from 'react-native-reanimated';

import FadingView from './FadingView';
import { useScrollContainerLogic } from './useScrollContainerLogic';
import type { SharedScrollContainerProps } from './types';

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
    disableAutoFixScroll,
    children,
    /** At the moment, we will not allow overriding of this since the scrollHandler needs it. */
    onScroll: _unusedOnScroll,
    ...rest
  }: AnimatedScrollViewProps & SharedScrollContainerProps,
  ref: React.Ref<Animated.ScrollView>
) => {
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
        ref={(_ref) => {
          // @ts-ignore
          scrollRef.current = _ref;
          // @ts-ignore
          if (ref) ref.current = _ref;
        }}
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

const ScrollViewWithHeaders = React.forwardRef<
  Animated.ScrollView,
  AnimatedScrollViewProps & SharedScrollContainerProps
>(ScrollViewWithHeadersInputComp);

export default ScrollViewWithHeaders;

const styles = StyleSheet.create({ container: { flex: 1 } });
