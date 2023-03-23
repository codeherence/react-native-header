import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedRef, useScrollViewOffset } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FadingView from './FadingView';
import type { SharedScrollContainerProps } from './types';
import { useScrollContainerLogic } from './useScrollContainerLogic';

type AnimatedScrollViewProps = React.ComponentProps<typeof Animated.ScrollView> & {
  children?: React.ReactNode;
};

const AnimatedScrollViewWithHeaders: React.FC<
  AnimatedScrollViewProps & SharedScrollContainerProps
> = ({
  largeHeaderShown,
  containerStyle,
  LargeHeaderComponent,
  largeHeaderContainerStyle,
  HeaderComponent,
  onLargeHeaderLayout,
  ignoreLeftSafeArea,
  ignoreRightSafeArea,
  children,
  ...rest
}) => {
  const insets = useSafeAreaInsets();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useScrollViewOffset(scrollRef);

  const { showNavBar, largeHeaderHeight, largeHeaderOpacity, debouncedFixScroll } =
    useScrollContainerLogic({
      scrollRef,
      scrollY,
      largeHeaderShown,
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
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        overScrollMode={'auto'}
        automaticallyAdjustContentInsets={false}
        onScrollBeginDrag={debouncedFixScroll.cancel}
        onScrollEndDrag={debouncedFixScroll}
        onMomentumScrollBegin={debouncedFixScroll.cancel}
        onMomentumScrollEnd={debouncedFixScroll}
        showsVerticalScrollIndicator={true}
        {...rest}
      >
        {LargeHeaderComponent ? (
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
        ) : null}
        {children}
      </Animated.ScrollView>
    </View>
  );
};

export default AnimatedScrollViewWithHeaders;

const styles = StyleSheet.create({ container: { flex: 1 } });
