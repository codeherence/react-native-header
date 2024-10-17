import React, { useCallback, useMemo, useRef } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Header,
  LargeHeader,
  ScalingView,
  ScrollHeaderProps,
  ScrollLargeHeaderProps,
  MasonryFlashListWithHeaders,
} from '@codeherence/react-native-header';
import { range } from '../../utils';
import { Avatar, BackButton } from '../../components';
import { RANDOM_IMAGE_NUM } from '../../constants';
import type { MasonryFlashListUsageScreenNavigationProps } from '../../navigation';
import type { ListRenderItem, MasonryFlashListRef } from '@shopify/flash-list';

const { width: dWidth, height: dHeight } = Dimensions.get('window');

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
const ITEM_HEIGHT = 60;

const MasonryFlashListExample: React.FC<MasonryFlashListUsageScreenNavigationProps> = () => {
  const { bottom } = useSafeAreaInsets();
  const ref = useRef<MasonryFlashListRef<number>>(null);

  const data = useMemo(() => range({ end: 500 }), []);

  const renderItem: ListRenderItem<number> = useCallback(({ item }) => {
    return (
      <View style={styles.item}>
        <Text style={styles.itemText}>{item}. Scroll to see header animation</Text>
      </View>
    );
  }, []);

  return (
    <MasonryFlashListWithHeaders
      ref={ref}
      HeaderComponent={HeaderComponent}
      LargeHeaderComponent={LargeHeaderComponent}
      contentContainerStyle={{ paddingBottom: bottom }}
      data={data}
      numColumns={2}
      renderItem={renderItem}
      estimatedItemSize={ITEM_HEIGHT}
      estimatedListSize={{ height: Math.min(ITEM_HEIGHT * data.length, dHeight), width: dWidth }}
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
  itemText: { textAlign: 'center' },
});
