import React, { useCallback, useMemo } from 'react';
import { ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Header,
  LargeHeader,
  ScalingView,
  ScrollHeaderProps,
  ScrollLargeHeaderProps,
  FlatListWithHeaders,
} from '@codeherence/react-native-header';
import { range } from '../../utils';
import { Avatar, BackButton } from '../../components';
import { RANDOM_IMAGE_NUM } from '../../constants';
import type { FlatListUsageScreenNavigationProps } from '../../navigation';

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

// Used for FlatList optimization
const ITEM_HEIGHT = 60;

const FlatList: React.FC<FlatListUsageScreenNavigationProps> = () => {
  const { bottom } = useSafeAreaInsets();

  const data = useMemo(() => range({ end: 500 }), []);

  const renderItem: ListRenderItem<number> = useCallback(({ item }) => {
    return (
      <View style={styles.item}>
        <Text style={styles.itemText}>{item}. Scroll to see header animation</Text>
      </View>
    );
  }, []);

  return (
    <FlatListWithHeaders
      HeaderComponent={HeaderComponent}
      LargeHeaderComponent={LargeHeaderComponent}
      contentContainerStyle={{ paddingBottom: bottom }}
      data={data}
      renderItem={renderItem}
      windowSize={10}
      getItemLayout={(_, index) => ({ index, length: ITEM_HEIGHT, offset: index * ITEM_HEIGHT })}
      initialNumToRender={50}
      maxToRenderPerBatch={100}
      keyExtractor={(_, i) => `text-row-${i}`}
    />
  );
};

export default FlatList;

const styles = StyleSheet.create({
  navBarTitle: { fontSize: 16, fontWeight: 'bold' },
  title: { fontSize: 32, fontWeight: 'bold' },
  leftHeader: { gap: 2 },
  item: { minHeight: ITEM_HEIGHT, padding: 16, justifyContent: 'center', alignItems: 'center' },
  itemText: { textAlign: 'center' },
});
