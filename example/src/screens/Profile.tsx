import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Header,
  LargeHeader,
  ScalingView,
  ScrollHeaderProps,
  ScrollLargeHeaderProps,
  ScrollViewWithHeaders,
} from '@codeherence/react-native-header';
import { range } from '../utils';
import { BackButton, Avatar } from '../components';
import { RANDOM_IMAGE_NUM } from '../constants';
import type { ProfileScreenNavigationProps } from '../navigation';

const HeaderComponent: React.FC<ScrollHeaderProps> = ({ showNavBar }) => {
  return (
    <Header
      showNavBar={showNavBar}
      ignoreTopSafeArea={Platform.OS === 'ios'}
      headerCenter={
        <>
          <Avatar size="xs" source={{ uri: `https://i.pravatar.cc/128?img=${RANDOM_IMAGE_NUM}` }} />
          <Text style={styles.navBarTitle} numberOfLines={1}>
            Profile
          </Text>
        </>
      }
      headerCenterStyle={styles.smallHeaderCenterStyle}
      headerRight={<BackButton style="close" />}
    />
  );
};

const LargeHeaderComponent: React.FC<ScrollLargeHeaderProps> = ({ scrollY }) => (
  <LargeHeader headerStyle={styles.largeHeaderStyle}>
    <ScalingView scrollY={scrollY} style={styles.centerHeaderContainer} translationDirection="none">
      <Avatar
        size="lg"
        source={{ uri: `https://i.pravatar.cc/128?img=${RANDOM_IMAGE_NUM}` }}
        style={styles.avatar}
      />
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.profileText}>
        Let&apos;s get you set up with your profile so you can start using the app.
      </Text>
    </ScalingView>
  </LargeHeader>
);

const Profile: React.FC<ProfileScreenNavigationProps> = () => {
  const { bottom } = useSafeAreaInsets();

  return (
    <ScrollViewWithHeaders
      style={styles.container}
      HeaderComponent={HeaderComponent}
      LargeHeaderComponent={LargeHeaderComponent}
      contentContainerStyle={{ paddingBottom: bottom }}
    >
      <View style={styles.children}>
        {range({ end: 100 }).map((i) => (
          <Text key={`profile-text-${i}`}>Scroll to see header animation</Text>
        ))}
      </View>
    </ScrollViewWithHeaders>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1 },
  children: { paddingVertical: 32, justifyContent: 'center', alignItems: 'center' },
  navBarTitle: { fontSize: 16, fontWeight: 'bold' },
  title: { fontSize: 32, fontWeight: 'bold' },
  profileText: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#8E8E93',
    maxWidth: '80%',
    textAlign: 'center',
  },
  centerHeaderContainer: { justifyContent: 'center', alignItems: 'center' },
  avatar: { marginBottom: 8 },
  smallHeaderCenterStyle: { gap: 4 },
  largeHeaderStyle: { alignItems: 'center', justifyContent: 'center' },
});
