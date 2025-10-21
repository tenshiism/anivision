import styled from 'styled-components/native';
import { View, Text, TouchableOpacity, Image } from 'react-native';

const colors = {
  primary: '#1976D2',
  secondary: '#009688',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  overlay: 'rgba(0, 0, 0, 0.5)',
  success: '#4CAF50',
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

export const BackButton = styled(TouchableOpacity)`
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
  flex: 1;
  text-align: center;
`;

export const HeaderActions = styled(View)`
  flex-direction: row;
  gap: ${spacing.xs}px;
`;

export const IconButton = styled(TouchableOpacity)`
  padding: ${spacing.sm}px;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
`;

export const ButtonIcon = styled(Text)`
  font-size: 24px;
  color: ${colors.surface};
`;

export const ContentContainer = styled(View)`
  flex: 1;
`;

export const GridContainer = styled(View)`
  flex: 1;
  padding: ${spacing.xs}px;
`;

export const ImageCard = styled(TouchableOpacity)`
  flex: 1;
  margin: ${spacing.xs}px;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background-color: ${colors.surface};
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 2.62px;
`;

export const ImageThumbnail = styled(Image)`
  width: 100%;
  height: 100%;
`;

export const ImageOverlay = styled(View)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${colors.overlay};
  padding: ${spacing.sm}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const SpeciesName = styled(Text)`
  color: ${colors.surface};
  font-size: 12px;
  font-weight: 600;
  flex: 1;
`;

export const ConfidenceBadge = styled(View)`
  background-color: ${colors.success};
  border-radius: 4px;
  padding: 2px 6px;
`;

export const ConfidenceText = styled(Text)`
  color: ${colors.surface};
  font-size: 10px;
  font-weight: bold;
`;

export const EmptyContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${spacing.xl}px;
`;

export const EmptyIcon = styled(Text)`
  font-size: 64px;
  margin-bottom: ${spacing.lg}px;
`;

export const EmptyTitle = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  color: ${colors.text};
  margin-bottom: ${spacing.md}px;
  text-align: center;
`;

export const EmptyDescription = styled(Text)`
  font-size: 14px;
  color: ${colors.textSecondary};
  text-align: center;
  margin-bottom: ${spacing.xl}px;
  line-height: 20px;
`;

export const EmptyActionButton = styled(TouchableOpacity)`
  background-color: ${colors.primary};
  padding: ${spacing.md}px ${spacing.lg}px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 2.62px;
`;

export const EmptyActionText = styled(Text)`
  color: ${colors.surface};
  font-size: 16px;
  font-weight: 600;
  margin-left: ${spacing.sm}px;
`;
