import React from 'react';
import { View, SectionList, StyleSheet, SectionListProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedRef, useScrollViewOffset } from 'react-native-reanimated';

import FadingView from '../containers/FadingView';
import { useScrollContainerLogic } from './useScrollContainerLogic';
import type { SharedScrollContainerProps } from './types';
import type { DefaultSectionT } from 'react-native';

type AnimatedSectionListType<ItemT, SectionT = DefaultSectionT> = React.ComponentProps<
  React.ComponentClass<Animated.AnimateProps<SectionListProps<ItemT, SectionT>>, any>
> &
  SharedScrollContainerProps;

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList) as React.ComponentClass<
  Animated.AnimateProps<SectionListProps<any, any>>,
  any
>;

const AnimatedSectionListWithHeaders = <ItemT = any, SectionT = DefaultSectionT>({
  largeHeaderShown,
  containerStyle,
  LargeHeaderComponent,
  largeHeaderContainerStyle,
  HeaderComponent,
  onLargeHeaderLayout,
  onScrollBeginDrag,
  onScrollEndDrag,
  onMomentumScrollBegin,
  onMomentumScrollEnd,
  ignoreLeftSafeArea,
  ignoreRightSafeArea,
  disableAutoFixScroll,
  ...rest
}: AnimatedSectionListType<ItemT, SectionT>) => {
  const insets = useSafeAreaInsets();
  const scrollRef = useAnimatedRef<any>();
  // Need to use `any` here because useScrollViewOffset is not typed for Animated.SectionList
  const scrollY = useScrollViewOffset(scrollRef as any);

  const { showNavBar, largeHeaderHeight, largeHeaderOpacity, debouncedFixScroll } =
    useScrollContainerLogic({
      scrollRef,
      scrollY,
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
      <AnimatedSectionList
        ref={scrollRef}
        scrollEventThrottle={16}
        overScrollMode="auto"
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
        ListHeaderComponent={
          LargeHeaderComponent ? (
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
          ) : undefined
        }
        {...rest}
      />
    </View>
  );
};

export default AnimatedSectionListWithHeaders;

const styles = StyleSheet.create({ container: { flex: 1 } });
