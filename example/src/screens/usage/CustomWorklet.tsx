import React, { useMemo } from 'react';
import { NativeScrollEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Header, LargeHeader, ScrollViewWithHeaders } from '@codeherence/react-native-header';
import type { ScrollHeaderProps, ScrollLargeHeaderProps } from '@codeherence/react-native-header';
import { range } from '../../utils';
import { Avatar, BackButton } from '../../components';
import { RANDOM_IMAGE_NUM } from '../../constants';
import type { CustomOnScrollWorkletUsageScreenNavigationProps } from '../../navigation';

const HeaderComponent: React.FC<ScrollHeaderProps> = ({ showNavBar }) => {
  const navigation = useNavigation();
  const onPressProfile = () => navigation.navigate('Profile');

  return (
    <Header
      showNavBar={showNavBar}
      headerCenterFadesIn={false}
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

const CustomWorklet: React.FC<CustomOnScrollWorkletUsageScreenNavigationProps> = () => {
  const { bottom } = useSafeAreaInsets();

  const data = useMemo(() => range({ end: 100 }), []);

  // Example worklet that can be used to track the scroll container's state.
  const scrollHandlerWorklet = (evt: NativeScrollEvent) => {
    'worklet';
    console.log('offset: ', evt.contentOffset);
  };

  return (
    <ScrollViewWithHeaders
      HeaderComponent={HeaderComponent}
      LargeHeaderComponent={LargeHeaderComponent}
      contentContainerStyle={{ paddingBottom: bottom }}
      onScrollWorklet={scrollHandlerWorklet}
    >
      <View style={styles.children}>
        {data.map((i) => (
          <Text key={`text-${i}`}>Scroll to see header animation</Text>
        ))}
      </View>
    </ScrollViewWithHeaders>
  );
};

export default CustomWorklet;

const styles = StyleSheet.create({
  children: { marginTop: 16, paddingHorizontal: 16 },
  navBarTitle: { fontSize: 16, fontWeight: 'bold' },
  largeHeaderStyle: { flexDirection: 'row-reverse' },
});
