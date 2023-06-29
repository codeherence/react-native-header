import React, { useImperativeHandle } from 'react';
import { View, FlatListProps, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedRef, AnimateProps } from 'react-native-reanimated';

import FadingView from '../containers/FadingView';
import { useScrollContainerLogic } from './useScrollContainerLogic';
import type { SharedScrollContainerProps } from './types';

type AnimatedFlatListType<ItemT = any> = React.ComponentClass<
  AnimateProps<FlatListProps<ItemT>>,
  ItemT
>;
type AnimatedFlatListBaseProps<ItemT> = React.ComponentProps<AnimatedFlatListType<ItemT>>;
type AnimatedFlatListProps<ItemT> = AnimatedFlatListBaseProps<ItemT>;

const FlatListWithHeadersInputComp = <ItemT extends unknown>(
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
    absoluteHeader = false,
    initialAbsoluteHeaderHeight = 0,
    contentContainerStyle,
    automaticallyAdjustsScrollIndicatorInsets,
    headerFadeInThreshold = 1,
    disableLargeHeaderFadeAnim = false,
    ...rest
  }: AnimatedFlatListProps<ItemT> & SharedScrollContainerProps,
  ref: React.Ref<Animated.FlatList<ItemT> | null>
) => {
  const insets = useSafeAreaInsets();
  const scrollRef = useAnimatedRef<Animated.FlatList<ItemT>>();
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
    headerFadeInThreshold,
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
      <Animated.FlatList
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
          // @ts-ignore
          // Unfortunately there are issues with Reanimated typings, so will ignore for now.
          contentContainerStyle,
          absoluteHeader ? { paddingTop: absoluteHeaderHeight } : undefined,
        ]}
        automaticallyAdjustsScrollIndicatorInsets={
          automaticallyAdjustsScrollIndicatorInsets !== undefined
            ? automaticallyAdjustsScrollIndicatorInsets
            : !absoluteHeader
        }
        scrollIndicatorInsets={{ top: absoluteHeader ? absoluteHeaderHeight : 0 }}
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
const FlatListWithHeaders = React.forwardRef(FlatListWithHeadersInputComp) as <ItemT = any>(
  props: AnimatedFlatListProps<ItemT> &
    SharedScrollContainerProps & { ref?: React.Ref<Animated.FlatList<ItemT>> }
) => React.ReactElement;

export default FlatListWithHeaders;

const styles = StyleSheet.create({
  container: { flex: 1 },
  absoluteHeader: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
  },
});
