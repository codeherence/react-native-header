import React, { useMemo, useState } from 'react';
import { RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Header, LargeHeader, ScrollViewWithHeaders } from '@codeherence/react-native-header';
import type {
  ScrollHeaderProps,
  ScrollLargeHeaderProps,
  ScrollLargeHeaderSubtitleProps,
} from '@codeherence/react-native-header';
import { range } from '../../utils';
import { Avatar, BackButton } from '../../components';
import { RANDOM_IMAGE_NUM } from '../../constants';
import type { SimpleUsageScreenNavigationProps } from '../../navigation';

const HeaderComponent: React.FC<ScrollHeaderProps> = ({ showNavBar }) => {
  const navigation = useNavigation();
  const onPressProfile = () => navigation.navigate('Profile');

  return (
    <Header
      showNavBar={showNavBar}
      headerCenterFadesIn={false}
      borderColor="red"
      initialBorderColor="blue"
      headerCenter={
        <Text style={styles.navBarTitle} numberOfLines={1}>
          Header
        </Text>
      }
      headerRight={
        <TouchableOpacity onPress={onPressProfile}>
          <Avatar
            size="sm"
            source={{
              uri: `https://i.pravatar.cc/128?img=${RANDOM_IMAGE_NUM}`,
            }}
          />
        </TouchableOpacity>
      }
      headerRightFadesIn
      headerLeft={<BackButton />}
    />
  );
};

const LargeHeaderComponent: React.FC<ScrollLargeHeaderProps> = () => {
  const navigation = useNavigation();
  const onPressProfile = () => navigation.navigate('Profile');

  return (
    <LargeHeader headerStyle={styles.largeHeaderStyle}>
      <TouchableOpacity onPress={onPressProfile}>
        <Avatar size="sm" source={{ uri: `https://i.pravatar.cc/128?img=${RANDOM_IMAGE_NUM}` }} />
      </TouchableOpacity>
    </LargeHeader>
  );
};

const LargeHeaderSubtitleComponent: React.FC<ScrollLargeHeaderSubtitleProps> = () => (
  <Text style={styles.largeHeaderSubtitleStyle}>Scroll to see header animation</Text>
);

const Simple: React.FC<SimpleUsageScreenNavigationProps> = () => {
  const { bottom } = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const data = useMemo(() => range({ end: 100 }), []);

  const onRefresh = async () => {
    if (refreshing) return;

    setRefreshing(true);
    // Mimic some asynchronous task
    await new Promise((res) => setTimeout(res, 2500));
    setRefreshing(false);
  };

  return (
    <ScrollViewWithHeaders
      HeaderComponent={HeaderComponent}
      LargeHeaderComponent={LargeHeaderComponent}
      LargeHeaderSubtitleComponent={LargeHeaderSubtitleComponent}
      automaticallyAdjustsScrollIndicatorInsets={false}
      scrollIndicatorInsets={{ bottom }}
      contentContainerStyle={{ paddingBottom: bottom }}
      refreshControl={
        <RefreshControl refreshing={refreshing} colors={['#8E8E93']} onRefresh={onRefresh} />
      }
    >
      <View style={styles.children}>
        {data.map((i) => (
          <View key={`text-${i}`} style={styles.box} />
        ))}
      </View>
    </ScrollViewWithHeaders>
  );
};

export default Simple;

const styles = StyleSheet.create({
  children: { marginTop: 16, paddingHorizontal: 16 },
  box: {
    backgroundColor: 'lightgray',
    height: 50,
    marginVertical: 8,
    borderRadius: 8,
  },
  navBarTitle: { fontSize: 16, fontWeight: 'bold' },
  largeHeaderStyle: { flexDirection: 'row-reverse' },
  largeHeaderSubtitleStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 16,
  },
});
