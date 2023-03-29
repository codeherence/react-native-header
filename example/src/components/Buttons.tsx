import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

type BackButtonProps = {
  style?: 'chevron' | 'close' | 'arrow';
  onPress?: () => void;
} & Omit<React.ComponentProps<typeof Feather>, 'name' | 'size' | 'style'>;

export const BackButton: React.FC<BackButtonProps> = ({
  style = 'chevron',
  onPress,
  ...iconProps
}) => {
  const navigation = useNavigation();

  const onBack = () => navigation.canGoBack() && navigation.goBack();

  return (
    <TouchableOpacity onPress={onPress ?? onBack}>
      <Feather
        color="black"
        {...iconProps}
        name={style === 'chevron' ? 'chevron-left' : style === 'close' ? 'x' : 'arrow-left'}
        size={style === 'chevron' ? 32 : 24}
      />
    </TouchableOpacity>
  );
};
