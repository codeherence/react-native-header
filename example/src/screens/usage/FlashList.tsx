import React, { useCallback, useMemo } from 'react';
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
import type { FlashListUsageScreenNavigationProps } from '../../navigation';
import type { FlashListRef, ListRenderItem } from '@shopify/flash-list';
import { useAnimatedRef } from 'react-native-reanimated';

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

const FlashListExample: React.FC<FlashListUsageScreenNavigationProps> = () => {
  const { bottom } = useSafeAreaInsets();
  const ref = useAnimatedRef<FlashListRef<number>>();

  const data = useMemo(() => range({ end: 500 }), []);

  const renderItem: ListRenderItem<number> = useCallback(({ item }) => {
    return (
      <View style={styles.item}>
        <Text style={styles.itemText}>{item}. Scroll to see header animation</Text>
      </View>
    );
  }, []);

  return (
    <FlashListWithHeaders
      ref={ref}
      HeaderComponent={HeaderComponent}
      LargeHeaderComponent={LargeHeaderComponent}
      contentContainerStyle={{ paddingBottom: bottom }}
      data={data}
      renderItem={renderItem}
      keyExtractor={(_, i) => `text-row-${i}`}
    />
  );
};

export default FlashListExample;

const styles = StyleSheet.create({
  navBarTitle: { fontSize: 16, fontWeight: 'bold' },
  title: { fontSize: 32, fontWeight: 'bold' },
  leftHeader: { gap: 2 },
  item: { minHeight: ITEM_HEIGHT, padding: 16, justifyContent: 'center', alignItems: 'center' },
  itemText: { textAlign: 'center' },
});
