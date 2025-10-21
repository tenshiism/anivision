import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import VectorIcon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../../theme';

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = theme.colors.text,
  style,
  onPress,
}) => {
  return (
    <VectorIcon
      name={name}
      size={size}
      color={color}
      style={style}
      onPress={onPress}
    />
  );
};

export default Icon;
