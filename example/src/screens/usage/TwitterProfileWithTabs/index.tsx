import React, { useCallback, useRef, useState } from 'react';
import {
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import PagerView from 'react-native-pager-view';
import { useNavigation } from '@react-navigation/native';
import { TwitterProfileWithTabsScreenNavigationProps } from '../../../navigation';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { AVATAR_SIZE_MAP, Avatar } from '../../../components';
import {
  FadingView,
  Header,
  LargeHeader,
  ScrollHeaderProps,
} from '@codeherence/react-native-header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import TwitterVerifiedSvg from '../../../../assets/twitter-verified.svg';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from '@react-native-community/blur';
import { TweetsPage } from './components';

// Note: The implementation of virtualized lists that should exist under some
// dynamic large header should be done in this way:
//  - We compute the height of the following: small header, large header, sticky tabs,
//    whole screen.
// Then we should derive the computations of the following:
//  - pager view height := whole screen - (small header + sticky tabs)
//
// The reason why the pager view should have a fixed height is to avoid layout changes.
// Layout animations are generally less performant, and also cause weird behaviour
// when changing the size of a scroll container while scrolling.
// However, there is some complexity introduced with the approach above. While it is the
// correct solution, we need to disable the scrolling on the scroll container at first,
// allow the user to "drag" the scroll container up until the large header is hidden,
// then enable scrolling. This suggests that we need a gesture handler to sit on top
// of the scrollview. From a quick glance, there is a valuable Medium post that highlights
// how to approach implementing simultaneous handlers on a scroll container:
// https://medium.com/@taitasciore/handling-pan-and-scroll-gestures-simultaneously-and-gracefully-with-gesture-handler-2-reanimated-63f0d8f72d3c

// The current approach is to simply perform a layout animation on the scroll container,
// which handles the "height" of the scrollview with the "top" and "bottom" styles.

// The only thing the implementation is now missing is having multiple scroll containers
// on each page. In order to implement this, you would need to instantiate x reanimated scroll
// handlers, enable them when their tab is active, and update the shared animation values
// as the current scroll container that is active is scrolled.

// Twitter large header constants
const canUseBlurView =
  Platform.OS === 'ios' || (Platform.OS === 'android' && Number(Platform.Version) >= 31);
const VERTICAL_SPACING = 12;
const ROOT_HORIZONTAL_PADDING = 12;
const TWITTER_PRIMARY_COLOR = '#1d9bf0';
const DISABLED_COLOR = 'rgba(255, 255, 255, 0.6)';
const AVATAR_SIZE = 'md';
const AVATAR_START_SCALE = 1;
const AVATAR_END_SCALE = 0.5;
const TABS = ['Tweets', 'Replies', 'Media', 'Likes'] as const;
const AVATAR_SIZE_VALUE = AVATAR_SIZE_MAP[AVATAR_SIZE];
const BANNER_BOTTOM_HEIGHT_ADDITION = AVATAR_SIZE_VALUE;
const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const HeaderComponent: React.FC<ScrollHeaderProps> = ({ showNavBar, scrollY }) => {
  const navigation = useNavigation();
  const { left, right } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const bannerHeight = useSharedValue(48 + BANNER_BOTTOM_HEIGHT_ADDITION);

  const blurStyle = useAnimatedStyle(() => {
    const blurOpacity = interpolate(Math.abs(scrollY.value), [0, 40], [0, 1], Extrapolate.CLAMP);

    return { opacity: blurOpacity };
  });

  const profileImageScale = useDerivedValue(() => {
    return interpolate(
      scrollY.value,
      [0, BANNER_BOTTOM_HEIGHT_ADDITION],
      [AVATAR_START_SCALE, AVATAR_END_SCALE],
      Extrapolate.CLAMP
    );
  });

  const bannerTranslationStyle = useAnimatedStyle(() => {
    const bannerTranslation = interpolate(
      scrollY.value,
      [0, BANNER_BOTTOM_HEIGHT_ADDITION],
      [0, -BANNER_BOTTOM_HEIGHT_ADDITION],
      Extrapolate.CLAMP
    );

    return { transform: [{ translateY: bannerTranslation }] };
  });

  // This allows the profile container to translate as the user scrolls.
  const profileContainerTranslationStyle = useAnimatedStyle(() => {
    const translateY = -scrollY.value + BANNER_BOTTOM_HEIGHT_ADDITION / 2;

    return { transform: [{ translateY }] };
  });

  // Once the profile image has been scaled down, we allow the profile container to be
  // hidden behind the banner. This is done by setting the zIndex to -1.
  const rootProfileRowZIndexStyle = useAnimatedStyle(() => {
    return { zIndex: profileImageScale.value <= AVATAR_END_SCALE ? -1 : 1 };
  });

  // Slow down the avatar's translation to allow it to scale down and
  // still stay at its position.
  const profileImageScaleStyle = useAnimatedStyle(() => {
    const profileImageTranslationY = interpolate(
      profileImageScale.value,
      [AVATAR_START_SCALE, AVATAR_END_SCALE],
      [0, AVATAR_SIZE_VALUE / 2],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale: profileImageScale.value }, { translateY: profileImageTranslationY }],
    };
  });

  const animatedScaleStyle = useAnimatedStyle(() => {
    const bannerHeightRatio = height / bannerHeight.value;

    const scaleY = interpolate(
      scrollY.value,
      [0, -(height + bannerHeight.value)],
      [1, bannerHeightRatio],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scaleY }, { scaleX: scaleY }],
    };
  }, [height]);

  return (
    <View style={styles.smallHeaderContainer}>
      <Animated.View style={[StyleSheet.absoluteFill, bannerTranslationStyle]}>
        <Animated.View
          onLayout={(e) => (bannerHeight.value = e.nativeEvent.layout.height)}
          style={animatedScaleStyle}
        >
          <View style={{ marginBottom: -BANNER_BOTTOM_HEIGHT_ADDITION }}>
            {canUseBlurView ? (
              <AnimatedBlurView
                style={[StyleSheet.absoluteFill, styles.blurView, blurStyle]}
                blurType="dark"
                reducedTransparencyFallbackColor="white"
                blurAmount={5}
                // @ts-ignore
                // https://github.com/Kureev/react-native-blur/issues/414
                // Fixes Android issue where the blur view will take up the whole screen.
                overlayColor="transparent"
              />
            ) : (
              <Animated.View
                style={[
                  StyleSheet.absoluteFill,
                  styles.blurView,
                  styles.androidBlurViewBg,
                  blurStyle,
                ]}
              />
            )}

            <AnimatedImage
              source={require('../../../../assets/planets.jpeg')}
              resizeMode="cover"
              style={[styles.imageStyle, { width }]}
            />
          </View>
        </Animated.View>
      </Animated.View>

      <Header
        showNavBar={showNavBar}
        headerCenterFadesIn={false}
        headerStyle={styles.headerStyle}
        noBottomBorder
        headerRight={
          <>
            <TouchableOpacity style={styles.backButtonContainer}>
              <Feather color="white" name="more-horizontal" size={18} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButtonContainer}>
              <Feather color="white" name="search" size={18} />
            </TouchableOpacity>
          </>
        }
        headerRightStyle={[
          styles.headerRightStyle,
          { paddingLeft: Math.max(right, ROOT_HORIZONTAL_PADDING) },
        ]}
        headerLeft={
          <>
            <TouchableOpacity
              onPress={() => navigation.canGoBack() && navigation.goBack()}
              style={styles.backButtonContainer}
            >
              <Feather color="white" name={'arrow-left'} size={18} />
            </TouchableOpacity>
            {/* Fade the name + tweets on the left header once the navBar should be shown. */}
            <FadingView opacity={showNavBar}>
              <Text style={styles.navBarTitle}>Evan</Text>
              <Text style={styles.disabledSmallText}>19.4k Tweets</Text>
            </FadingView>
          </>
        }
        headerLeftStyle={[
          styles.headerLeftStyle,
          { paddingLeft: Math.max(left, ROOT_HORIZONTAL_PADDING) },
        ]}
      />

      <Animated.View style={[styles.profileContainer, rootProfileRowZIndexStyle]}>
        <Animated.View
          style={[
            styles.profileFollowContainer,
            {
              left: Math.max(left, ROOT_HORIZONTAL_PADDING),
              right: Math.max(right, ROOT_HORIZONTAL_PADDING),
            },
            profileContainerTranslationStyle,
          ]}
        >
          <Animated.View style={profileImageScaleStyle}>
            <TouchableOpacity>
              <Avatar size={AVATAR_SIZE} source={require('../../../../assets/circle-pic.png')} />
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity style={styles.pillButton}>
            <Text style={styles.followText}>Follow</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const LargeHeaderComponent: React.FC = () => {
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
    <LargeHeader
      headerStyle={[
        styles.largeHeaderStyle,
        {
          paddingLeft: Math.max(left, ROOT_HORIZONTAL_PADDING),
          paddingRight: Math.max(right, ROOT_HORIZONTAL_PADDING),
        },
      ]}
    >
      <View style={styles.profileHandleContainer}>
        <View style={styles.profileHeaderRow}>
          <Text style={styles.title}>Evan</Text>
          <TwitterVerifiedSvg height={18} width={18} />
        </View>

        <Text style={styles.disabledText}>@evan</Text>
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
                // eslint-disable-next-line react-native/no-inline-styles
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

const useScrollLogicHandler = () => {
  // State variables
  const [tabsHeight, setTabsHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [largeHeaderHeight, setLargeHeaderHeight] = useState(0);

  const scrollY = useSharedValue(0);

  // Now, when we have the large header height, we want to ensure that a scroll on the inner
  // container modifies the translationY of the large header.
  const translationY = useDerivedValue(() => {
    if (largeHeaderHeight === 0) return 0;
    return Math.max(-scrollY.value, -largeHeaderHeight);
  }, [largeHeaderHeight, tabsHeight]);

  const showNavBar = useDerivedValue(() => {
    return withTiming(scrollY.value >= largeHeaderHeight ? 1 : 0, { duration: 200 });
  }, [largeHeaderHeight]);

  const scrollComponentStyle = useAnimatedStyle(() => {
    // The scroll component must have its height and translationY be modified in conjunction to the
    // header offsets.

    // The headerHeight includes the top inset and small header size.
    const baseAdjustment = headerHeight + largeHeaderHeight + tabsHeight;
    if (-translationY.value < 0) {
      return { top: baseAdjustment };
    }

    return { top: baseAdjustment + translationY.value };
  }, [translationY, largeHeaderHeight, headerHeight, tabsHeight]);

  const largeHeaderStyle = useAnimatedStyle(() => {
    return { transform: [{ translateY: translationY.value }] };
  }, []);

  const animatedTabsStyle = useAnimatedStyle(() => {
    return { transform: [{ translateY: translationY.value }] };
  }, []);

  return {
    scrollY,
    showNavBar,
    largeHeaderStyle,
    animatedTabsStyle,
    scrollComponentStyle,
    setTabsHeight,
    setHeaderHeight,
    setLargeHeaderHeight,
  };
};

const TwitterProfileWithTabs: React.FC<TwitterProfileWithTabsScreenNavigationProps> = () => {
  const pagerRef = useRef<PagerView>(null);
  const [activeTab, setActiveTab] = useState(0);

  const {
    scrollY,
    showNavBar,
    largeHeaderStyle,
    animatedTabsStyle,
    scrollComponentStyle,
    setTabsHeight,
    setHeaderHeight,
    setLargeHeaderHeight,
  } = useScrollLogicHandler();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
        <HeaderComponent showNavBar={showNavBar} scrollY={scrollY} />
      </View>
      <Animated.View
        style={[styles.staticLargeHeaderStyle, largeHeaderStyle]}
        onLayout={({ nativeEvent }) => setLargeHeaderHeight(nativeEvent.layout.height)}
      >
        <LargeHeaderComponent />
      </Animated.View>

      {/* We also need a component for the tabs */}
      <Animated.View style={animatedTabsStyle}>
        <View
          onLayout={({ nativeEvent }) => setTabsHeight(nativeEvent.layout.height)}
          style={styles.tabBarContainer}
        >
          {TABS.map((tab, index) => (
            <TouchableOpacity
              key={`option-${index}`}
              style={styles.tabButton}
              onPress={() => pagerRef.current?.setPage(index)}
            >
              <Text style={styles.tabText}>{tab}</Text>
              {activeTab === index && <View style={styles.blueUnderline} />}
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      <AnimatedPagerView
        ref={pagerRef}
        style={[styles.pagerView, scrollComponentStyle]}
        initialPage={0}
        overScrollMode="always"
        overdrag
        onPageSelected={(e) => {
          setActiveTab(e.nativeEvent.position);
        }}
      >
        {TABS.map((tab, i) => (
          <TweetsPage key={tab} page={String(i + 1)} scrollY={scrollY} />
        ))}
      </AnimatedPagerView>
    </View>
  );
};

export default TwitterProfileWithTabs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  pagerViewParent: {
    flex: 1,
  },
  pagerView: {
    // flex: 1,
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  childView: {
    width: '100%',
    height: '100%',
    zIndex: 3,
  },
  contentContainer: {
    flexGrow: 1,
  },
  topContainer: {
    flex: 1,
    backgroundColor: 'blue',
  },
  staticLargeHeaderStyle: {
    zIndex: -1,
    backgroundColor: 'black',
  },
  listText: {
    paddingVertical: 24,
    color: '#fff',
  },
  tweetsListStyle: {
    flex: 1,
  },
  tweetsListContainerStyle: {
    flexGrow: 1,
  },

  // Twitter large header styles
  children: { marginTop: 16, paddingHorizontal: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  navBarTitle: { fontSize: 16, fontWeight: 'bold', color: 'white' },
  largeHeaderStyle: {
    flexDirection: 'column',
    gap: 12,
    marginTop: AVATAR_SIZE_VALUE / 2 + VERTICAL_SPACING + BANNER_BOTTOM_HEIGHT_ADDITION,
  },
  backButtonContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 100,
    padding: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // headerStyle: { backgroundColor: 'black' },
  headerStyle: { backgroundColor: 'transparent' },
  smallHeaderContainer: { position: 'relative', zIndex: 1 },
  headerRightStyle: { gap: 6, paddingLeft: 12 },
  headerLeftStyle: { gap: 12, paddingLeft: 12 },
  blurView: { zIndex: 1 },
  imageStyle: { height: '100%' },
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
