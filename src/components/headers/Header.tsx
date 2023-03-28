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
  borderWidth,
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
      <View style={[styles.container, headerStyle, !ignoreTopSafeArea && { paddingTop: top }]}>
        {headerLeftFadesIn ? (
          <FadingView
            opacity={showNavBar}
            style={[
              styles.leftContainer,
              headerLeftStyle,
              noHeaderLeftRight && styles.noFlex,
              { width: minSideHeaderWidth },
            ]}
          >
            {headerLeft}
          </FadingView>
        ) : (
          <View
            style={[
              styles.leftContainer,
              headerLeftStyle,
              noHeaderLeftRight && styles.noFlex,
              { width: minSideHeaderWidth },
            ]}
          >
            {headerLeft}
          </View>
        )}

        {headerCenter &&
          (headerCenterFadesIn ? (
            <FadingView
              opacity={showNavBar}
              style={[styles.centerContainer, headerCenterStyle, { minWidth: centerWidth }]}
            >
              {headerCenter}
            </FadingView>
          ) : (
            <View style={[styles.centerContainer, headerCenterStyle, { width: centerWidth }]}>
              {headerCenter}
            </View>
          ))}

        {headerRightFadesIn ? (
          <FadingView
            opacity={showNavBar}
            style={[
              styles.rightContainer,
              headerRightStyle,
              noHeaderLeftRight && styles.noFlex,
              { width: minSideHeaderWidth },
            ]}
          >
            {headerRight}
          </FadingView>
        ) : (
          <View
            style={[
              styles.rightContainer,
              headerRightStyle,
              noHeaderLeftRight && styles.noFlex,
              { width: minSideHeaderWidth },
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'flex-start',
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
