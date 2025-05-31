import React, { useCallback, useMemo, useState } from 'react';
import { RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Header,
  LargeHeader,
  ScalingView,
  ScrollViewWithHeaders,
  ScrollHeaderProps,
  ScrollLargeHeaderProps,
} from '@codeherence/react-native-header';

import { range } from '../../utils';
import { BackButton } from '../../components';
import type { TestScreenNavigationProps } from '../../navigation';

const HeaderComponent: React.FC<ScrollHeaderProps> = ({ showNavBar }) => {
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
      headerLeft={<BackButton />}
    />
  );
};

const Simple: React.FC<TestScreenNavigationProps> = () => {
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

  const LargeHeaderComponent: React.FC<ScrollLargeHeaderProps> = useCallback(({ scrollY }) => {
    return (
      <LargeHeader>
        <ScalingView scrollY={scrollY}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 24,
            }}
          >
            <Text style={{ fontSize: 24 }}>List</Text>
            <TouchableOpacity onPress={() => console.log('Pressed')}>
              <Text>Icon</Text>
            </TouchableOpacity>
          </View>
        </ScalingView>
      </LargeHeader>
    );
  }, []);

  return (
    <ScrollViewWithHeaders
      HeaderComponent={HeaderComponent}
      LargeHeaderComponent={LargeHeaderComponent}
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
