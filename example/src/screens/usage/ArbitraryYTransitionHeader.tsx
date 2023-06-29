import React, { useMemo, useState } from 'react';
import { RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Header,
  LargeHeader,
  ScalingView,
  ScrollViewWithHeaders,
} from '@codeherence/react-native-header';
import type { ScrollHeaderProps, ScrollLargeHeaderProps } from '@codeherence/react-native-header';
import { range } from '../../utils';
import { Avatar, BackButton } from '../../components';
import { RANDOM_IMAGE_NUM } from '../../constants';
import type { ArbitraryYTransitionHeaderUsageScreenNavigationProps } from '../../navigation';

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
        <TouchableOpacity onPress={onPressProfile}>
          <Avatar size="sm" source={{ uri: `https://i.pravatar.cc/128?img=${RANDOM_IMAGE_NUM}` }} />
        </TouchableOpacity>
      }
      headerRightFadesIn
      headerLeft={<BackButton />}
    />
  );
};

const LargeHeaderComponent: React.FC<ScrollLargeHeaderProps> = ({ scrollY }) => {
  return (
    <LargeHeader headerStyle={styles.largeHeaderStyle}>
      <ScalingView scrollY={scrollY} style={styles.leftHeader}>
        <Text style={styles.title}>Large Header</Text>
        <Text style={styles.subtext}>
          We test a larger LargeHeader in order to test the arbitrary y-value.
        </Text>
      </ScalingView>

      <View style={styles.redBox} />
    </LargeHeader>
  );
};

const ArbitraryYTransitionHeader: React.FC<
  ArbitraryYTransitionHeaderUsageScreenNavigationProps
> = () => {
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
      headerFadeInThreshold={0.5}
      disableLargeHeaderFadeAnim
      LargeHeaderComponent={LargeHeaderComponent}
      contentContainerStyle={{ paddingBottom: bottom }}
      refreshControl={
        <RefreshControl refreshing={refreshing} colors={['#8E8E93']} onRefresh={onRefresh} />
      }
    >
      <View style={styles.children}>
        {data.map((i) => (
          <Text key={`text-${i}`}>Scroll to see header animation</Text>
        ))}
      </View>
    </ScrollViewWithHeaders>
  );
};

export default ArbitraryYTransitionHeader;

const styles = StyleSheet.create({
  children: { marginTop: 16, paddingHorizontal: 16 },
  navBarTitle: { fontSize: 16, fontWeight: 'bold' },
  largeHeaderStyle: { flexDirection: 'column' },
  title: { fontSize: 32, fontWeight: 'bold' },
  leftHeader: { gap: 4 },
  subtext: { color: '#8E8E93' },
  redBox: { width: 100, height: 100, backgroundColor: 'red' },
});
