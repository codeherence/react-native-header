import React, { Reducer, useReducer } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Image, ImageProps } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type AvatarProps = ImageProps & { size?: AvatarSize };

type AvatarReducerState = { loading: boolean; failed: boolean };
type AvatarReducerActions = { type: 'success' } | { type: 'failed' };
/** Used to represent loading/failed states of the Avatar component. */
type AvatarReducer = Reducer<AvatarReducerState, AvatarReducerActions>;

const SIZE_MAP: Record<AvatarSize, number> = {
  xs: 24,
  sm: 36,
  md: 64,
  lg: 96,
  xl: 128,
};

export const AVATAR_SIZE_MAP = { ...SIZE_MAP };

export const Avatar: React.FC<AvatarProps> = ({ style, size = 'sm', ...imageProps }) => {
  const [{ loading, failed }, dispatch] = useReducer<AvatarReducer>(
    (state, action) => {
      if (action.type === 'success') return { loading: false, failed: false };
      if (action.type === 'failed') return { loading: false, failed: true };
      return state;
    },
    { loading: true, failed: false }
  );

  const wh = SIZE_MAP[size];
  if (failed) return <Ionicons name="person-circle-outline" size={wh} color="black" />;

  return (
    <>
      {loading && (
        <View style={[{ height: wh, width: wh, borderRadius: wh / 2 }, styles.loader]}>
          <ActivityIndicator size="small" />
        </View>
      )}
      <Image
        {...imageProps}
        onError={() => dispatch({ type: 'failed' })}
        onLoad={() => dispatch({ type: 'success' })}
        contentFit="cover"
        style={[{ height: wh, width: wh, borderRadius: wh / 2 }, style]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  loader: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
