import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Header,
  LargeHeader,
  ScalingView,
  ScrollHeaderProps,
  ScrollLargeHeaderProps,
  FlashListWithHeaders,
} from '@codeherence/react-native-header';
import { range } from '../../utils';
import { Avatar, BackButton } from '../../components';
import { RANDOM_IMAGE_NUM } from '../../constants';
import type { MasonryFlashListUsageScreenNavigationProps } from '../../navigation';
import type { FlashListRef, ListRenderItem } from '@shopify/flash-list';
import { Image } from 'expo-image';

const HeaderComponent: React.FC<ScrollHeaderProps> = ({ showNavBar }) => {
  const navigation = useNavigation();
  const onPressProfile = () => navigation.navigate('Profile');

  return (
    <Header
      showNavBar={showNavBar}
      headerCenter={
        <Text style={styles.navBarTitle} numberOfLines={1}>
          Header
        </Text>
      }
      headerRight={
        <>
          <TouchableOpacity onPress={onPressProfile}>
            <Avatar
              size="sm"
              source={{ uri: `https://i.pravatar.cc/128?img=${RANDOM_IMAGE_NUM}` }}
            />
          </TouchableOpacity>
        </>
      }
      headerRightFadesIn
      headerLeft={<BackButton />}
    />
  );
};

const LargeHeaderComponent: React.FC<ScrollLargeHeaderProps> = ({ scrollY }) => {
  const navigation = useNavigation();
  const onPressProfile = () => navigation.navigate('Profile');

  return (
    <LargeHeader>
      <ScalingView scrollY={scrollY} style={styles.leftHeader}>
        <Text style={styles.title}>Large Header</Text>
      </ScalingView>
      <TouchableOpacity onPress={onPressProfile}>
        <Avatar size="sm" source={{ uri: `https://i.pravatar.cc/128?img=${RANDOM_IMAGE_NUM}` }} />
      </TouchableOpacity>
    </LargeHeader>
  );
};

// Used for FlashList optimization
const ITEM_HEIGHT = 200;

const MasonryFlashListExample: React.FC<MasonryFlashListUsageScreenNavigationProps> = () => {
  const { bottom } = useSafeAreaInsets();
  const ref = useRef<FlashListRef<number> | null>(null);

  const data = useMemo(() => range({ end: 500 }), []);

  const renderItem: ListRenderItem<number> = useCallback(({ item, index }) => {
    const randomHeights = [100, 150, 200, 250];
    const randomHeight = randomHeights[index % randomHeights.length];
    return (
      <View style={styles.item}>
        <Image
          source={`https://picsum.photos/150/${randomHeight}`}
          style={{ ...styles.image, height: randomHeight }}
        />
        <Text style={styles.itemText}>{item}</Text>
      </View>
    );
  }, []);

  return (
    <FlashListWithHeaders
      ref={ref}
      masonry={true}
      HeaderComponent={HeaderComponent}
      LargeHeaderComponent={LargeHeaderComponent}
      contentContainerStyle={{ paddingBottom: bottom }}
      data={data}
      numColumns={3}
      renderItem={renderItem}
      automaticallyAdjustsScrollIndicatorInsets={false}
      keyExtractor={(_, i) => `text-row-${i}`}
    />
  );
};

export default MasonryFlashListExample;

const styles = StyleSheet.create({
  navBarTitle: { fontSize: 16, fontWeight: 'bold' },
  title: { fontSize: 32, fontWeight: 'bold' },
  leftHeader: { gap: 2 },
  item: { minHeight: ITEM_HEIGHT, padding: 16, justifyContent: 'center', alignItems: 'center' },
  image: { width: 150 },
  itemText: { textAlign: 'center' },
});
