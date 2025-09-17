import React, { useImperativeHandle, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { AnimatedProps, isSharedValue, useAnimatedRef } from 'react-native-reanimated';
import { FlashList, FlashListProps, FlashListRef } from '@shopify/flash-list';

import type { SharedScrollContainerProps } from '.';
import FadingView from './FadingView';
import { useScrollContainerLogic } from './useScrollContainerLogic';

type AnimatedFlashListType<ItemT> = React.ComponentProps<
  React.ComponentClass<AnimatedProps<FlashListProps<ItemT>>, any>
> &
  SharedScrollContainerProps;

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList) as <ItemT>(
  props: AnimatedProps<FlashListProps<ItemT>> & { ref?: React.Ref<FlashListRef<ItemT>> }
) => React.ReactElement;

type FlashListWithHeadersProps<ItemT> = Omit<AnimatedFlashListType<ItemT>, 'onScroll'>;

const FlashListWithHeadersInputComp = <ItemT extends any = any>(
  {
    largeHeaderShown,
    containerStyle,
    LargeHeaderSubtitleComponent,
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
    ...rest
  }: FlashListWithHeadersProps<ItemT>,
  ref: React.ForwardedRef<FlashListRef<ItemT>>
): ReturnType<ForwardedFlashListWithHeadersProps<ItemT>> => {
  if (_unusedOnScroll) {
    throw new Error(
      "The 'onScroll' property is not supported. Please use onScrollWorklet to track the scroll container's state."
    );
  }

  const insets = useSafeAreaInsets();
  const scrollRef = useAnimatedRef<any>();
  useImperativeHandle(ref, () => scrollRef.current);

  const { maintainVisibleContentPosition } = rest;
  const inverted = useMemo(() => {
    if (maintainVisibleContentPosition === undefined) return false;
    if (isSharedValue(maintainVisibleContentPosition)) return false;

    return (
      (maintainVisibleContentPosition as FlashListProps<ItemT>['maintainVisibleContentPosition'])
        ?.startRenderingFromBottom ?? false
    );
  }, [maintainVisibleContentPosition]);

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
    inverted,
    onScrollWorklet,
    isFlashList: true,
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
      <AnimatedFlashList<ItemT>
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
          ...(contentContainerStyle as any),
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
          <>
            {LargeHeaderComponent && (
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
            )}
            {LargeHeaderSubtitleComponent && LargeHeaderSubtitleComponent({ showNavBar, scrollY })}
          </>
        }
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

type ForwardedFlashListWithHeadersProps<ItemT> = React.ForwardRefRenderFunction<
  FlashListRef<ItemT>,
  FlashListWithHeadersProps<ItemT>
>;

const FlashListWithHeaders = React.forwardRef(FlashListWithHeadersInputComp) as <ItemT = any>(
  props: FlashListWithHeadersProps<ItemT> & {
    ref?: React.RefObject<any>;
  }
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
