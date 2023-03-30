/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Remove this line to enable type checking
// @ts-nocheck
import React, { useCallback, useMemo, useState } from 'react';
import {
  Image,
  Linking,
  SectionListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  FadingView,
  Header,
  LargeHeader,
  ScalingView,
  SectionListWithHeaders,
} from '@codeherence/react-native-header';
import type { ScrollHeaderProps, ScrollLargeHeaderProps } from '@codeherence/react-native-header';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { Avatar, AVATAR_SIZE_MAP, BackButton } from '../../components';
import { BlurView } from '@react-native-community/blur';
import TwitterVerifiedSvg from '../../../assets/twitter-verified.svg';
import type { TwitterProfileStarterScreenNavigationProps } from '../../navigation';
import { Platform } from 'react-native';

// From reading comments online, the BlurView does not work properly for Android <= 11.
// We will have a boolean to check if we can use the BlurView.
// Note that Android 12 begins at SDK version 31
const canUseBlurView =
  Platform.OS === 'ios' || (Platform.OS === 'android' && Number(Platform.Version) >= 31);

const VERTICAL_SPACING = 12;
const ROOT_HORIZONTAL_PADDING = 12;
const TWITTER_PRIMARY_COLOR = '#1d9bf0';
const DISABLED_COLOR = 'rgba(255, 255, 255, 0.6)';
const AVATAR_SIZE = 'md';
const AVATAR_START_SCALE = 1;
const AVATAR_END_SCALE = 0.5;
const AVATAR_SIZE_VALUE = AVATAR_SIZE_MAP[AVATAR_SIZE];
const BANNER_BOTTOM_HEIGHT_ADDITION = AVATAR_SIZE_VALUE;
const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const HeaderComponent: React.FC<ScrollHeaderProps> = ({ showNavBar }) => {
  return (
    <Header
      showNavBar={showNavBar}
      noBottomBorder
      headerCenter={
        <Text numberOfLines={1} style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
          Twitter Profile Starter
        </Text>
      }
      headerLeft={<BackButton color="white" />}
    />
  );
};

const LargeHeaderComponent: React.FC<ScrollLargeHeaderProps> = () => {
  const { left, right } = useSafeAreaInsets();

  const onPressLink = useCallback(async () => {
    try {
      const supported = await Linking.canOpenURL('https://codeherence.com');

      if (supported) {
        await Linking.openURL('https://codeherence.com');
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <LargeHeader headerStyle={[styles.largeHeaderStyle]}>
      <View style={styles.profileHandleContainer}>
        <View style={styles.profileHeaderRow}>
          <Text style={styles.title}>Evan Younan</Text>
          <TwitterVerifiedSvg height={18} width={18} />
        </View>

        <Text style={styles.disabledText}>@e_younan</Text>
      </View>

      <Text style={styles.text}>
        Founder of <Text style={styles.primaryText}>@codeherence</Text> • Helping companies develop
        and enhance their React Native apps
      </Text>

      <View style={styles.dataRow}>
        <Feather name="calendar" color={DISABLED_COLOR} size={12} />
        <Text style={styles.disabledText}>Joined March 2023</Text>
      </View>

      <View style={styles.locationAndWebContainer}>
        <View style={styles.dataRow}>
          <Feather name="map-pin" color={DISABLED_COLOR} size={12} />
          <Text style={styles.disabledText}>Toronto, Ontario</Text>
        </View>

        <View style={styles.dataRow}>
          <Feather name="link" color={DISABLED_COLOR} size={12} />
          <Text onPress={onPressLink} style={styles.primaryText}>
            codeherence.com
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <TouchableOpacity style={styles.dataRow}>
          <Text style={styles.mediumText}>186</Text>
          <Text style={styles.disabledText}>Following</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dataRow}>
          <Text style={styles.mediumText}>132.8M</Text>
          <Text style={styles.disabledText}>Followers</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.whoFollowsThemContainer}>
        <View style={styles.followerPreviewContainer}>
          {[4, 5, 2].map((num, index) => {
            return (
              <Avatar
                key={`avatar-${num}`}
                size="sm"
                source={{ uri: `https://i.pravatar.cc/128?img=${num}` }}
                style={{
                  top: 0,
                  zIndex: 3 - index,
                  position: index !== 0 ? 'absolute' : undefined,
                  left: (AVATAR_SIZE_MAP.sm / 1.5) * index,
                  borderWidth: 1,
                }}
              />
            );
          })}
        </View>

        <Text style={[styles.disabledText, styles.followerText]}>
          Followed by Jane, John Wick, Miley Cyrus, and 23 others
        </Text>
      </View>
    </LargeHeader>
  );
};

const SomeComponent: SectionListRenderItem<number, { data: number[] }> = ({ index }) => (
  <View style={styles.children}>
    <Text style={styles.text}>{index}</Text>
  </View>
);

// Do not re-render this component at all
const MemoizedComponent = React.memo(SomeComponent, () => true);

const TwitterProfileStarter: React.FC<TwitterProfileStarterScreenNavigationProps> = () => {
  const { bottom } = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(0);

  const data: Array<{ data: number[] }> = useMemo(() => [{ data: Array.from({ length: 50 }) }], []);

  return (
    <>
      <StatusBar style="light" />
      <SectionListWithHeaders
        HeaderComponent={HeaderComponent}
        LargeHeaderComponent={LargeHeaderComponent}
        sections={data}
        style={styles.container}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: bottom }]}
        containerStyle={styles.rootContainer}
        renderItem={(props) => <MemoizedComponent {...props} />}
        stickySectionHeadersEnabled
        renderSectionHeader={() => (
          <View style={styles.tabBarContainer}>
            {['Tweets', 'Replies', 'Media', 'Likes'].map((tab, index) => (
              <TouchableOpacity
                key={`option-${index}`}
                style={styles.tabButton}
                onPress={() => setActiveTab(index)}
              >
                <Text style={styles.tabText}>{tab}</Text>
                {activeTab === index && <View style={styles.blueUnderline} />}
              </TouchableOpacity>
            ))}
          </View>
        )}
      />
    </>
  );
};

export default TwitterProfileStarter;

const styles = StyleSheet.create({
  children: { marginTop: 16, paddingHorizontal: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  navBarTitle: { fontSize: 16, fontWeight: 'bold', color: 'white' },
  largeHeaderStyle: {
    flexDirection: 'column',
    gap: 12,
    // marginTop: AVATAR_SIZE_VALUE / 2 + VERTICAL_SPACING + BANNER_BOTTOM_HEIGHT_ADDITION,
  },
  backButtonContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 100,
    padding: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerStyle: { backgroundColor: 'transparent' },
  smallHeaderContainer: { position: 'relative', zIndex: 1 },
  headerRightStyle: { gap: 6, paddingLeft: 12 },
  headerLeftStyle: { gap: 12, paddingLeft: 12 },
  blurView: { zIndex: 1 },
  imageStyle: { height: '100%' },
  container: { flex: 1, backgroundColor: '#000' },
  contentContainer: { backgroundColor: '#000', flexGrow: 1 },
  text: { color: '#fff' },
  primaryText: { color: TWITTER_PRIMARY_COLOR },
  mediumText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  rootContainer: { backgroundColor: '#000' },
  profileFollowContainer: {
    position: 'absolute',
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  followText: { fontSize: 12, fontWeight: '600' },
  pillButton: {
    paddingVertical: 6,
    paddingHorizontal: 32,
    backgroundColor: '#fff',
    borderRadius: 200,
  },
  disabledSmallText: { color: DISABLED_COLOR, fontSize: 12 },
  disabledText: { color: DISABLED_COLOR, fontSize: 14 },
  profileHeaderRow: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  profileContainer: { paddingHorizontal: 12 },
  profileHandleContainer: { gap: 4 },
  statsContainer: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  whoFollowsThemContainer: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  followerPreviewContainer: { position: 'relative', width: AVATAR_SIZE_MAP.sm * (7 / 3) },
  followerText: { flex: 1 },
  tabBarContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#000' },
  tabButton: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabText: { color: 'white', fontSize: 14, fontWeight: '600', paddingVertical: 12 },
  blueUnderline: {
    height: 2,
    width: '50%',
    backgroundColor: TWITTER_PRIMARY_COLOR,
    borderRadius: 4,
  },
  locationAndWebContainer: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  dataRow: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  androidBlurViewBg: { backgroundColor: 'rgba(0,0,0,0.5)' },
});
