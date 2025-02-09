import React, { useImperativeHandle } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import { MasonryFlashList, MasonryFlashListProps, MasonryFlashListRef } from '@shopify/flash-list';

import type { SharedScrollContainerProps } from '.';
import FadingView from './FadingView';
import { useScrollContainerLogic } from './useScrollContainerLogic';

type AnimatedMasonryFlashListType<ItemT> = React.ComponentProps<
  React.ComponentClass<Animated.AnimateProps<MasonryFlashListProps<ItemT>>, any>
> &
  SharedScrollContainerProps;

const AnimatedMasonryFlashList = Animated.createAnimatedComponent(
  MasonryFlashList
) as unknown as React.ComponentClass<Animated.AnimateProps<MasonryFlashListProps<any>>>;

type MasonryFlashListWithHeadersProps<ItemT> = Omit<
  AnimatedMasonryFlashListType<ItemT>,
  'onScroll'
>;

const MasonryFlashListWithHeadersInputComp = <ItemT extends any = any>(
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
  }: MasonryFlashListWithHeadersProps<ItemT>,
  ref: React.Ref<typeof MasonryFlashList>
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
      <AnimatedMasonryFlashList
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

// The typecast is needed to make the component generic.
const MasonryFlashListWithHeaders = React.forwardRef(MasonryFlashListWithHeadersInputComp) as <
  ItemT = any
>(
  props: MasonryFlashListWithHeadersProps<ItemT> & {
    ref?: React.RefObject<MasonryFlashListRef<ItemT>>;
  }
) => React.ReactElement;

export default MasonryFlashListWithHeaders;

const styles = StyleSheet.create({
  container: { flex: 1 },
  absoluteHeader: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
  },
});
