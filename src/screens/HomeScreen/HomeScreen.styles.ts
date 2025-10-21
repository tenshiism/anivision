import styled from 'styled-components/native';
import { View, Text, TouchableOpacity } from 'react-native';

const colors = {
  primary: '#1976D2',
  secondary: '#009688',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Container = styled(View)`
  flex: 1;
  background-color: ${colors.background};
`;

export const HeaderBar = styled(View)`
  background-color: ${colors.primary};
  padding: ${spacing.md}px;
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

export const HeaderContent = styled(View)`
  flex-direction: row;
  align-items: center;
`;

export const MenuButton = styled(TouchableOpacity)`
  padding: ${spacing.sm}px;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
`;

export const HeaderTitle = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  color: ${colors.surface};
  margin-left: ${spacing.md}px;
`;

export const ButtonIcon = styled(Text)`
  font-size: 24px;
  color: ${colors.surface};
`;

export const ContentSection = styled(View)`
  padding: ${spacing.lg}px;
`;

export const QuickActionsContainer = styled(View)`
  flex-direction: row;
  gap: ${spacing.md}px;
  margin-bottom: ${spacing.xl}px;
`;

export const QuickActionCard = styled(TouchableOpacity)`
  flex: 1;
  background-color: ${colors.surface};
  border-radius: 16px;
  padding: ${spacing.lg}px;
  align-items: center;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  border: 1px solid ${colors.border};
  min-height: 180px;
  justify-content: center;
`;

export const ActionIconLarge = styled(Text)`
  font-size: 48px;
  margin-bottom: ${spacing.md}px;
`;

export const ActionTitle = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.text};
  margin-bottom: ${spacing.sm}px;
`;

export const ActionDescription = styled(Text)`
  font-size: 14px;
  color: ${colors.textSecondary};
  text-align: center;
`;

export const FeaturesSection = styled(View)`
  margin-top: ${spacing.lg}px;
`;

export const FeatureItem = styled(View)`
  flex-direction: row;
  align-items: center;
  padding: ${spacing.md}px;
  background-color: ${colors.surface};
  border-radius: 8px;
  margin-bottom: ${spacing.sm}px;
  border: 1px solid ${colors.border};
`;

export const FeatureIcon = styled(Text)`
  font-size: 24px;
  margin-right: ${spacing.md}px;
`;

export const FeatureText = styled(Text)`
  font-size: 14px;
  color: ${colors.text};
  flex: 1;
`;
