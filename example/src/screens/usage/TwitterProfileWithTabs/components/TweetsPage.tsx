import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { SharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IPost, POSTS } from '../../../../domain';
import { Post } from '../../../../components';

interface TweetsPageProps {
  page: string;
  scrollY: SharedValue<number>;
}

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<IPost>);
const ItemSeparator: React.FC = () => <View style={styles.separator} />;

const TweetsPage: React.FC<TweetsPageProps> = ({ page, scrollY }) => {
  const { bottom } = useSafeAreaInsets();
  const [data] = useState(POSTS);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  return (
    <View style={styles.childView} key={page}>
      <AnimatedFlashList
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator
        indicatorStyle="white"
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Post post={item} />}
        estimatedItemSize={280}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={{ paddingBottom: bottom }}
      />
    </View>
  );
};

export default TweetsPage;

const styles = StyleSheet.create({
  childView: {
    height: '100%',
    width: '100%',
    zIndex: 3,
  },
  listText: {
    paddingVertical: 24,
    color: '#fff',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});
