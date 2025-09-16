import React, { useCallback } from 'react';
import { SectionListRenderItem, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Header,
  LargeHeader,
  ScalingView,
  ScrollHeaderProps,
  ScrollLargeHeaderProps,
  SectionListWithHeaders,
} from '@codeherence/react-native-header';
import { Avatar, BackButton } from '../../components';
import { RANDOM_IMAGE_NUM } from '../../constants';
import type { SectionListUsageScreenNavigationProps } from '../../navigation';

const DATA = [
  {
    title: 'Main dishes',
    data: ['Pizza', 'Burger', 'Risotto', 'Pasta', 'Lasagna'],
  },
  {
    title: 'Sides',
    data: ['French Fries', 'Onion Rings', 'Fried Shrimps', 'Mozzarella Sticks', 'Garlic Bread'],
  },
  {
    title: 'Drinks',
    data: ['Water', 'Coke', 'Beer', 'Wine', 'Mojito', 'Cuba Libre', 'Pina Colada', 'Margarita'],
  },
  {
    title: 'Desserts',
    data: ['Cheese Cake', 'Ice Cream', 'Chocolate Cake', 'Tiramisu', 'Panna Cotta', 'Profiteroles'],
  },
];

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

// Used for SectionList optimization
const ITEM_HEIGHT = 60;

const SectionList: React.FC<SectionListUsageScreenNavigationProps> = () => {
  const { bottom } = useSafeAreaInsets();

  const renderItem: SectionListRenderItem<string, { title: string; data: string[] }> = useCallback(
    ({ item }) => {
      return (
        <View style={styles.item}>
          <Text style={styles.itemText}>{item}. Scroll to see header animation</Text>
        </View>
      );
    },
    []
  );

  return (
    <SectionListWithHeaders
      HeaderComponent={HeaderComponent}
      LargeHeaderComponent={LargeHeaderComponent}
      contentContainerStyle={{ paddingBottom: bottom }}
      sections={DATA}
      keyExtractor={(item, index) => item + index}
      renderItem={renderItem}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.sectionTitle}>{title}</Text>
      )}
      windowSize={10}
      getItemLayout={(_, index) => ({ index, length: ITEM_HEIGHT, offset: index * ITEM_HEIGHT })}
      initialNumToRender={50}
      maxToRenderPerBatch={100}
    />
  );
};

export default SectionList;

const styles = StyleSheet.create({
  navBarTitle: { fontSize: 16, fontWeight: 'bold' },
  title: { fontSize: 32, fontWeight: 'bold' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    width: '100%',
    backgroundColor: '#E6E6E6',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  leftHeader: { gap: 2 },
  item: { minHeight: ITEM_HEIGHT, padding: 16, justifyContent: 'center', alignItems: 'center' },
  itemText: { textAlign: 'center' },
});
