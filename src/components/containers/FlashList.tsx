import React, { useImperativeHandle } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import { FlashList, FlashListProps } from '@shopify/flash-list';

import type { SharedScrollContainerProps } from '.';
import FadingView from './FadingView';
import { useScrollContainerLogic } from './useScrollContainerLogic';

type AnimatedFlashListType<ItemT> = React.ComponentProps<
  React.ComponentClass<Animated.AnimateProps<FlashListProps<ItemT>>, any>
> &
  SharedScrollContainerProps;

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList) as React.ComponentClass<
  Animated.AnimateProps<FlashListProps<any>>,
  unknown
>;

type FlashListWithHeadersProps<ItemT> = Omit<AnimatedFlashListType<ItemT>, 'onScroll'>;

const FlashListWithHeadersInputComp = <ItemT extends any = any>(
  {
    largeHeaderShown,
    containerStyle,
    LargeHeaderComponent,
    largeHeaderContainerStyle,
    HeaderComponent,
    onLargeHeaderLayout,
    onScrollBeginDrag,
    onScrollEndDrag,
    onScrollWorklet,
    onMomentumScrollBegin,
    onMomentumScrollEnd,
    ignoreLeftSafeArea,
    ignoreRightSafeArea,
    disableAutoFixScroll = false,
    // We use this to ensure that the onScroll property isn't accidentally used.
    // @ts-ignore
    onScroll: _unusedOnScroll,
    absoluteHeader = false,
    initialAbsoluteHeaderHeight = 0,
    contentContainerStyle = {},
    automaticallyAdjustsScrollIndicatorInsets,
    headerFadeInThreshold = 1,
    disableLargeHeaderFadeAnim = false,
    scrollIndicatorInsets = {},
    inverted,
    ...rest
  }: FlashListWithHeadersProps<ItemT>,
  ref: React.Ref<FlashList<ItemT>>
) => {
  if (_unusedOnScroll) {
    throw new Error(
      "The 'onScroll' property is not supported. Please use onScrollWorklet to track the scroll container's state."
    );
  }

  const insets = useSafeAreaInsets();
  const scrollRef = useAnimatedRef<any>();
  useImperativeHandle(ref, () => scrollRef.current);

  const {
    scrollY,
    showNavBar,
    largeHeaderHeight,
    largeHeaderOpacity,
    scrollHandler,
    debouncedFixScroll,
    onAbsoluteHeaderLayout,
    scrollViewAdjustments,
  } = useScrollContainerLogic({
    scrollRef,
    largeHeaderShown,
    disableAutoFixScroll,
    largeHeaderExists: !!LargeHeaderComponent,
    absoluteHeader,
    initialAbsoluteHeaderHeight,
    headerFadeInThreshold,
    inverted: !!inverted,
    onScrollWorklet,
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
      <AnimatedFlashList
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
        contentContainerStyle={{
          // The reason why we do this is because FlashList does not support an array of
          // styles (will throw a warning when you supply one).
          ...scrollViewAdjustments.contentContainerStyle,
          ...contentContainerStyle,
        }}
        automaticallyAdjustsScrollIndicatorInsets={
          automaticallyAdjustsScrollIndicatorInsets !== undefined
            ? automaticallyAdjustsScrollIndicatorInsets
            : !absoluteHeader
        }
        scrollIndicatorInsets={{
          ...scrollViewAdjustments.scrollIndicatorInsets,
          ...scrollIndicatorInsets,
        }}
        ListHeaderComponent={
          LargeHeaderComponent ? (
            <View
              onLayout={(e) => {
                largeHeaderHeight.value = e.nativeEvent.layout.height;

                if (onLargeHeaderLayout) onLargeHeaderLayout(e.nativeEvent.layout);
              }}
            >
              {!disableLargeHeaderFadeAnim ? (
                <FadingView opacity={largeHeaderOpacity} style={largeHeaderContainerStyle}>
                  {LargeHeaderComponent({ scrollY, showNavBar })}
                </FadingView>
              ) : (
                <View style={largeHeaderContainerStyle}>
                  {LargeHeaderComponent({ scrollY, showNavBar })}
                </View>
              )}
            </View>
          ) : undefined
        }
        inverted={inverted}
        {...rest}
      />

      {absoluteHeader && (
        <View style={styles.absoluteHeader} onLayout={onAbsoluteHeaderLayout}>
          {HeaderComponent({ showNavBar, scrollY })}
        </View>
      )}
    </View>
  );
};

// The typecast is needed to make the component generic.
const FlashListWithHeaders = React.forwardRef(FlashListWithHeadersInputComp) as <ItemT = any>(
  props: FlashListWithHeadersProps<ItemT> & { ref?: React.RefObject<FlashList<ItemT>> }
) => React.ReactElement;

export default FlashListWithHeaders;

const styles = StyleSheet.create({
  container: { flex: 1 },
  absoluteHeader: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
  },
});
