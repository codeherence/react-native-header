import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { LargeHeaderProps } from './types';

const LH_VERTICAL_PADDING = 6;
const LH_HORIZONTAL_PADDING = 12;

/**
 * A convenience component to wrap your large header content with.
 *
 * @param {LargeHeaderProps} props
 */
const LargeHeader: React.FC<React.PropsWithChildren<LargeHeaderProps>> = ({
  headerStyle,
  children,
}) => <View style={[styles.headerContainer, headerStyle]}>{children}</View>;

export default LargeHeader;

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: LH_VERTICAL_PADDING,
    paddingHorizontal: LH_HORIZONTAL_PADDING,
  },
});
