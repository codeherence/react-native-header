import React from 'react';
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
    disableAutoFixScroll,
    /** At the moment, we will not allow overriding of this since the scrollHandler needs it. */
    onScroll: _unusedOnScroll,
    ...rest
  }: AnimatedFlatListProps<ItemT> & SharedScrollContainerProps,
  ref: React.Ref<AnimatedFlatListType<ItemT>>
) => {
  const insets = useSafeAreaInsets();
  const scrollRef = useAnimatedRef<Animated.FlatList<ItemT>>();

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
      <Animated.FlatList
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
const FlatListWithHeaders = React.forwardRef(FlatListWithHeadersInputComp) as <ItemT = any>(
  props: AnimatedFlatListProps<ItemT> &
    SharedScrollContainerProps & { ref?: React.Ref<Animated.FlatList<ItemT>> }
) => React.ReactElement;

export default FlatListWithHeaders;

const styles = StyleSheet.create({ container: { flex: 1 } });
