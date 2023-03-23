import React from 'react';
import { View, FlatList, FlatListProps, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedRef,
  useScrollViewOffset,
  AnimateProps,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FadingView from '../containers/FadingView';
import type { SharedScrollContainerProps } from './types';
import { useScrollContainerLogic } from './useScrollContainerLogic';

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
  data,
  renderItem,
  largeHeaderShown,
  containerStyle,
  LargeHeaderComponent,
  largeHeaderContainerStyle,
  HeaderComponent,
  ignoreLeftSafeArea,
  ignoreRightSafeArea,
  ...rest
}: AnimatedFlatListProps<ItemT> & SharedScrollContainerProps) => {
  const insets = useSafeAreaInsets();
  const scrollRef = useAnimatedRef<Animated.FlatList<ItemT>>();
  // Need to use `any` here because useScrollViewOffset is not typed for Animated.FlatList
  const scrollY = useScrollViewOffset(scrollRef as any);

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
      <AnimatedFlatList
        ref={scrollRef}
        scrollEventThrottle={16}
        overScrollMode={'auto'}
        automaticallyAdjustContentInsets={false}
        onScrollBeginDrag={debouncedFixScroll.cancel}
        onScrollEndDrag={debouncedFixScroll}
        onMomentumScrollBegin={debouncedFixScroll.cancel}
        onMomentumScrollEnd={debouncedFixScroll}
        showsVerticalScrollIndicator={true}
        ListHeaderComponent={
          LargeHeaderComponent ? (
            <View
              onLayout={(e) => {
                largeHeaderHeight.value = e.nativeEvent.layout.height;
              }}
            >
              <FadingView opacity={largeHeaderOpacity} style={largeHeaderContainerStyle}>
                {LargeHeaderComponent({ scrollY, showNavBar })}
              </FadingView>
            </View>
          ) : undefined
        }
        data={data}
        renderItem={renderItem}
        {...rest}
      />
    </View>
  );
};

export default AnimatedFlatListWithHeaders;

const styles = StyleSheet.create({ container: { flex: 1 } });
