import styled from 'styled-components/native';
import { View, Text, TouchableOpacity, Image } from 'react-native';

// Theme colors based on architecture docs
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
  justify-content: space-between;
`;

export const MenuButton = styled(TouchableOpacity)`
  padding: ${spacing.sm}px;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
`;

export const SettingsButton = styled(TouchableOpacity)`
  padding: ${spacing.sm}px;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
`;

export const AppTitle = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  color: ${colors.surface};
  flex: 1;
  text-align: center;
`;

export const ButtonIcon = styled(Text)`
  font-size: 24px;
  color: ${colors.surface};
`;

export const ContentSection = styled(View)`
  padding: ${spacing.lg}px;
`;

export const LogoContainer = styled(View)`
  align-items: center;
  margin-vertical: ${spacing.xl}px;
`;

export const AppLogo = styled(Text)`
  font-size: 64px;
  margin-bottom: ${spacing.md}px;
`;

export const Tagline = styled(Text)`
  font-size: 18px;
  color: ${colors.textSecondary};
  text-align: center;
  font-style: italic;
`;

export const ActionButtonsContainer = styled(View)`
  margin-vertical: ${spacing.lg}px;
  gap: ${spacing.md}px;
`;

export const ActionButton = styled(TouchableOpacity)`
  background-color: ${colors.surface};
  border-radius: 12px;
  padding: ${spacing.lg}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 2.62px;
  border: 1px solid ${colors.border};
`;

export const ButtonText = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.text};
  margin-left: ${spacing.md}px;
`;

export const RecentSection = styled(View)`
  margin-top: ${spacing.xl}px;
`;

export const SectionTitle = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.text};
  margin-bottom: ${spacing.md}px;
`;

export const RecentImagesContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  gap: ${spacing.md}px;
`;

export const RecentImageCard = styled(TouchableOpacity)`
  flex: 1;
  aspect-ratio: 1;
  background-color: ${colors.surface};
  border-radius: 8px;
  overflow: hidden;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 2.62px;
`;

export const RecentImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

export const EmptyStateText = styled(Text)`
  font-size: 14px;
  color: ${colors.textSecondary};
  text-align: center;
  padding: ${spacing.lg}px;
`;
