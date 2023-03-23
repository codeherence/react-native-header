import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

interface BackButtonProps {
  style?: 'chevron' | 'close';
  onPress?: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ style = 'chevron', onPress }) => {
  const navigation = useNavigation();

  const onBack = () => navigation.canGoBack() && navigation.goBack();

  return (
    <TouchableOpacity onPress={onPress ?? onBack}>
      <Feather
        name={style === 'chevron' ? 'chevron-left' : 'x'}
        size={style === 'chevron' ? 32 : 24}
        color="black"
      />
    </TouchableOpacity>
  );
};
