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
    onMomentumScrollBegin,
    onMomentumScrollEnd,
    ignoreLeftSafeArea,
    ignoreRightSafeArea,
    disableAutoFixScroll = false,
    /** At the moment, we will not allow overriding of this since the scrollHandler needs it. */
    onScroll: _unusedOnScroll,
    ...rest
  }: AnimatedFlashListType<ItemT>,
  ref: React.Ref<FlashList<ItemT>>
) => {
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
      {HeaderComponent({ showNavBar, scrollY })}
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

// The typecast is needed to make the component generic.
const FlashListWithHeaders = React.forwardRef(FlashListWithHeadersInputComp) as <ItemT = any>(
  props: AnimatedFlashListType<ItemT> & { ref?: React.Ref<FlashList<ItemT>> }
) => React.ReactElement;

export default FlashListWithHeaders;

const styles = StyleSheet.create({ container: { flex: 1 } });
