import React from 'react';
import { View, FlatList, FlatListProps, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedRef, AnimateProps } from 'react-native-reanimated';

import FadingView from '../containers/FadingView';
import { useScrollContainerLogic } from './useScrollContainerLogic';
import type { DisallowedScrollContainerProps, SharedScrollContainerProps } from './types';

type AnimatedFlatListType<ItemT = any> = React.ComponentClass<
  AnimateProps<FlatListProps<ItemT>>,
  ItemT
>;
type AnimatedFlatListBaseProps<ItemT> = React.ComponentProps<AnimatedFlatListType<ItemT>>;
type AnimatedFlatListProps<ItemT> = AnimatedFlatListBaseProps<ItemT> & {
  children?: React.ReactNode;
};
const AnimatedFlatList: AnimatedFlatListType = Animated.createAnimatedComponent(FlatList);

const AnimatedFlatListWithHeaders = <ItemT extends unknown>({
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
  // @ts-ignore - onScroll is not allowed, but we need to remove it from the props
  onScroll: _unusedOnScroll,
  ...rest
}: Omit<AnimatedFlatListProps<ItemT>, DisallowedScrollContainerProps> &
  SharedScrollContainerProps) => {
  const insets = useSafeAreaInsets();
  const scrollRef = useAnimatedRef<Animated.FlatList<ItemT>>();
  // Need to use `any` here because useScrollViewOffset is not typed for Animated.FlatList

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
      <AnimatedFlatList
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

export default AnimatedFlatListWithHeaders;

const styles = StyleSheet.create({ container: { flex: 1 } });
