import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Header,
  LargeHeader,
  ScalingView,
  ScrollViewWithHeaders,
} from '@codeherence/react-native-header';
import type { ScrollHeaderProps, ScrollLargeHeaderProps } from '@codeherence/react-native-header';
import { Avatar } from '../../components';
import { RANDOM_IMAGE_NUM } from '../../constants';
import type { BackgroundInterpolateUsageScreenNavigationProps } from '../../navigation';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';

const HeaderComponent: React.FC<ScrollHeaderProps> = ({ showNavBar, scrollY }) => {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    const exampleImageUri = Image.resolveAssetSource(require('../../../assets/planets.jpeg')).uri;

    Image.getSize(
      exampleImageUri,
      (w, h) => {
        console.log('w', w, 'h', h);
      },
      (err) => console.log('err', err)
    );
  }, []);

  const goBack = () => navigation.canGoBack() && navigation.goBack();

  const blurOpacity = useDerivedValue(() => {
    console.log(scrollY.value);
    return interpolate(scrollY.value, [0, -height * 0.2], [0, 0.4], Extrapolate.CLAMP);
  }, [scrollY, height]);

  const blurStyle = useAnimatedStyle(() => {
    return {
      opacity: blurOpacity.value,
    };
  });

  return (
    <View style={styles.smallHeaderContainer}>
      <View style={StyleSheet.absoluteFill}>
        <ScalingView
          scrollY={scrollY}
          translationDirection="none"
          endScale={2}
          endRange={height * 0.5}
        >
          <Animated.View style={[StyleSheet.absoluteFill, styles.blurView, blurStyle]} />

          <Image
            source={require('../../../assets/planets.jpeg')}
            resizeMode="cover"
            style={(styles.imageStyle, { width })}
          />
        </ScalingView>
      </View>

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
        headerRightStyle={styles.headerRightStyle}
        headerLeft={
          <TouchableOpacity onPress={goBack} style={styles.backButtonContainer}>
            <Feather color="white" name={'arrow-left'} size={18} />
          </TouchableOpacity>
        }
        headerLeftStyle={styles.headerLeftStyle}
      />
    </View>
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

const BackgroundInterpolation: React.FC<BackgroundInterpolateUsageScreenNavigationProps> = () => {
  const { bottom } = useSafeAreaInsets();

  return (
    <>
      <StatusBar style="light" />
      <ScrollViewWithHeaders
        HeaderComponent={HeaderComponent}
        LargeHeaderComponent={LargeHeaderComponent}
        contentContainerStyle={{ paddingBottom: bottom }}
      >
        <View style={styles.children}>
          <Text>Hello?</Text>
        </View>
      </ScrollViewWithHeaders>
    </>
  );
};

export default BackgroundInterpolation;

const styles = StyleSheet.create({
  children: { marginTop: 16, paddingHorizontal: 16 },
  navBarTitle: { fontSize: 16, fontWeight: 'bold', color: 'white' },
  largeHeaderStyle: { flexDirection: 'row-reverse' },
  backButtonContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 100,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgImage: {
    backgroundColor: 'red',
  },
  headerStyle: { backgroundColor: 'transparent' },
  smallHeaderContainer: { position: 'relative' },
  headerRightStyle: { gap: 6, paddingLeft: 12 },
  headerLeftStyle: { gap: 6, paddingLeft: 12 },
  blurView: { zIndex: 2, backgroundColor: 'red' },
  imageStyle: { height: '100%' },
});
