import React, { useImperativeHandle } from 'react';
import { View, SectionList, StyleSheet, SectionListProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedRef } from 'react-native-reanimated';

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

const SectionListWithHeadersInputComp = <ItemT extends any = any, SectionT = DefaultSectionT>(
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
  }: AnimatedSectionListType<ItemT, SectionT>,
  ref: React.Ref<Animated.ScrollView>
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
      <AnimatedSectionList
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
const SectionListWithHeaders = React.forwardRef(SectionListWithHeadersInputComp) as <
  ItemT = any,
  SectionT = DefaultSectionT
>(
  props: AnimatedSectionListType<ItemT, SectionT> & { ref?: React.Ref<Animated.ScrollView> }
) => React.ReactElement;

export default SectionListWithHeaders;

const styles = StyleSheet.create({ container: { flex: 1 } });
