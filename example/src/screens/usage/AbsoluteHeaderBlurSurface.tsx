import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { AbsoluteHeaderBlurSurfaceUsageScreenNavigationProps } from '../../navigation';
import {
  FadingView,
  Header,
  LargeHeader,
  ScalingView,
  ScrollHeaderProps,
  ScrollLargeHeaderProps,
  ScrollViewWithHeaders,
  SurfaceComponentProps,
} from '@codeherence/react-native-header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { BackButton } from '../../components';
import { range } from '../../utils';

const HeaderSurface: React.FC<SurfaceComponentProps> = ({ showNavBar }) => {
  return (
    <FadingView opacity={showNavBar} style={StyleSheet.absoluteFill}>
      <BlurView style={StyleSheet.absoluteFill} tint="light" />
    </FadingView>
  );
};

const HeaderComponent: React.FC<ScrollHeaderProps> = ({ showNavBar }) => {
  const insets = useSafeAreaInsets();

  return (
    <Header
      showNavBar={showNavBar}
      noBottomBorder
      headerStyle={{ height: 44 + insets.top }}
      headerCenter={<Text style={styles.headerTitle}>react-native-header</Text>}
      headerLeft={<BackButton />}
      SurfaceComponent={HeaderSurface}
    />
  );
};

const LargeHeaderComponent: React.FC<ScrollLargeHeaderProps> = ({ scrollY }) => {
  return (
    <LargeHeader>
      <ScalingView scrollY={scrollY} style={styles.leftHeader}>
        <Text style={styles.title}>Large Header</Text>
      </ScalingView>
    </LargeHeader>
  );
};

const TransparentSurface: React.FC<AbsoluteHeaderBlurSurfaceUsageScreenNavigationProps> = () => {
  const { bottom } = useSafeAreaInsets();

  return (
    <ScrollViewWithHeaders
      absoluteHeader
      HeaderComponent={HeaderComponent}
      LargeHeaderComponent={LargeHeaderComponent}
      style={styles.container}
      contentContainerStyle={{ paddingBottom: bottom + 12 }}
    >
      <View style={styles.boxes}>
        {range({ end: 20 }).map((i) => (
          <View key={`box-${i}`} style={i % 2 === 0 ? styles.redBox : styles.greenBox} />
        ))}
      </View>
    </ScrollViewWithHeaders>
  );
};

export default TransparentSurface;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: -100,
  },
  contentContainer: {
    paddingTop: 44,
  },
  redBox: {
    backgroundColor: 'red',
    height: 200,
    width: 200,
  },
  greenBox: {
    backgroundColor: 'green',
    height: 200,
    width: 200,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  boxes: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  title: { fontSize: 32, fontWeight: 'bold' },
  leftHeader: { gap: 2 },
});
