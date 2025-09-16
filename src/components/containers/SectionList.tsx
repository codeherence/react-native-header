import React from 'react';
import { View, SectionList, StyleSheet, SectionListProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { AnimatedProps, useAnimatedRef } from 'react-native-reanimated';

import FadingView from '../containers/FadingView';
import { useScrollContainerLogic } from './useScrollContainerLogic';
import type { SharedScrollContainerProps } from './types';
import type { DefaultSectionT } from 'react-native';

type AnimatedSectionListType<ItemT, SectionT = DefaultSectionT> = SectionListProps<
  ItemT,
  SectionT
> &
  SharedScrollContainerProps;

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList) as React.ComponentClass<
  AnimatedProps<SectionListProps<any, any>>,
  any
>;

type SectionListWithHeadersProps<ItemT, SectionT = DefaultSectionT> = Omit<
  AnimatedSectionListType<ItemT, SectionT>,
  'onScroll'
>;

const SectionListWithHeaders = <ItemT extends any = any, SectionT = DefaultSectionT>({
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
  contentContainerStyle,
  automaticallyAdjustsScrollIndicatorInsets,
  headerFadeInThreshold = 1,
  disableLargeHeaderFadeAnim = false,
  scrollIndicatorInsets = {},
  inverted,
  ...rest
}: SectionListWithHeadersProps<ItemT, SectionT>) => {
  if (_unusedOnScroll) {
    throw new Error(
      "The 'onScroll' property is not supported. Please use onScrollWorklet to track the scroll container's state."
    );
  }

  const insets = useSafeAreaInsets();
  const scrollRef = useAnimatedRef<InstanceType<typeof AnimatedSectionList>>();

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
      <AnimatedSectionList
        // ref={scrollRef} // TODO: Fix this since createAnimatedComponent is not working with SectionList
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
          scrollViewAdjustments.contentContainerStyle,
          // @ts-ignore
          // Unfortunately there are issues with Reanimated typings, so will ignore for now.
          contentContainerStyle,
        ]}
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

export default SectionListWithHeaders;

const styles = StyleSheet.create({
  container: { flex: 1 },
  absoluteHeader: { position: 'absolute', top: 0, right: 0, left: 0 },
});
