import React, { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FadingView } from '../containers';
import { HeaderBottomBorder } from '../line';
import type { HeaderProps } from './types';

const MIN_CENTER_WIDTH_PRC = 0.4;

const Header: React.FC<HeaderProps> = ({
  showNavBar,
  headerStyle,
  headerLeft = null,
  headerLeftStyle,
  headerLeftFadesIn,
  headerCenter = null,
  headerCenterStyle,
  headerCenterFadesIn = true,
  headerRight = null,
  headerRightStyle,
  headerRightFadesIn,
  noBottomBorder = false,
  ignoreTopSafeArea = false,
  borderColor,
  initialBorderColor,
  borderWidth,
  SurfaceComponent,
}) => {
  const { top } = useSafeAreaInsets();
  const dimensions = useWindowDimensions();

  const headerCenterExists = !!headerCenter;
  const { centerWidth, minSideHeaderWidth } = useMemo(() => {
    const _centerWidth = headerCenterExists ? MIN_CENTER_WIDTH_PRC * dimensions.width : 0;
    const _minSideHeaderWidth = (dimensions.width - _centerWidth) / 2;

    return { centerWidth: _centerWidth, minSideHeaderWidth: _minSideHeaderWidth };
  }, [headerCenterExists, dimensions]);

  const noHeaderLeftRight = !headerLeft && !headerRight;

  return (
    <View>
      {SurfaceComponent && SurfaceComponent({ showNavBar })}

      <View style={[styles.container, !ignoreTopSafeArea && { paddingTop: top }, headerStyle]}>
        {headerLeftFadesIn ? (
          <FadingView
            opacity={showNavBar}
            style={[
              styles.leftContainer,
              noHeaderLeftRight && styles.noFlex,
              { width: minSideHeaderWidth },
              headerLeftStyle,
            ]}
          >
            {headerLeft}
          </FadingView>
        ) : (
          <View
            style={[
              styles.leftContainer,
              noHeaderLeftRight && styles.noFlex,
              { width: minSideHeaderWidth },
              headerLeftStyle,
            ]}
          >
            {headerLeft}
          </View>
        )}

        {headerCenter &&
          (headerCenterFadesIn ? (
            <FadingView
              opacity={showNavBar}
              style={[styles.centerContainer, { minWidth: centerWidth }, headerCenterStyle]}
            >
              {headerCenter}
            </FadingView>
          ) : (
            <View style={[styles.centerContainer, { width: centerWidth }, headerCenterStyle]}>
              {headerCenter}
            </View>
          ))}

        {headerRightFadesIn ? (
          <FadingView
            opacity={showNavBar}
            style={[
              styles.rightContainer,
              noHeaderLeftRight && styles.noFlex,
              { width: minSideHeaderWidth },
              headerRightStyle,
            ]}
          >
            {headerRight}
          </FadingView>
        ) : (
          <View
            style={[
              styles.rightContainer,
              noHeaderLeftRight && styles.noFlex,
              { width: minSideHeaderWidth },
              headerRightStyle,
            ]}
          >
            {headerRight}
          </View>
        )}
      </View>

      {!noBottomBorder && (
        <HeaderBottomBorder
          opacity={showNavBar}
          borderColor={borderColor}
          initialBorderColor={initialBorderColor}
          borderWidth={borderWidth}
        />
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  leftContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'hidden',
  },
  centerContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    flexDirection: 'row-reverse',
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  noFlex: { display: 'none' },
});
