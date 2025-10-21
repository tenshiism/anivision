import styled from 'styled-components/native';
import { View, Text, TouchableOpacity, Image } from 'react-native';

const colors = {
  primary: '#1976D2',
  secondary: '#009688',
  background: '#000000',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  overlay: 'rgba(0, 0, 0, 0.3)',
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
  z-index: 10;
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

export const FlashButton = styled(TouchableOpacity)`
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

export const ButtonIcon = styled(Text)`
  font-size: 24px;
  color: ${colors.surface};
`;

export const CameraContainer = styled(View)`
  flex: 1;
  position: relative;
`;

export const CameraPlaceholder = styled(View)`
  flex: 1;
  background-color: #1a1a1a;
  align-items: center;
  justify-content: center;
`;

export const PlaceholderText = styled(Text)`
  color: ${colors.surface};
  font-size: 16px;
  text-align: center;
`;

export const CameraOverlay = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

export const GuideFrame = styled(View)`
  width: 80%;
  aspect-ratio: 1;
  border: 2px solid ${colors.surface};
  border-radius: 16px;
  align-items: center;
  justify-content: flex-end;
  padding: ${spacing.lg}px;
`;

export const GuideText = styled(Text)`
  color: ${colors.surface};
  font-size: 14px;
  background-color: ${colors.overlay};
  padding: ${spacing.sm}px ${spacing.md}px;
  border-radius: 8px;
`;

export const CameraControls = styled(View)`
  padding: ${spacing.xl}px;
  align-items: center;
  background-color: ${colors.background};
`;

export const CaptureButton = styled(TouchableOpacity)`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${colors.surface};
  align-items: center;
  justify-content: center;
  border: 4px solid rgba(255, 255, 255, 0.3);
`;

export const CaptureButtonInner = styled(View)`
  width: 64px;
  height: 64px;
  border-radius: 32px;
  background-color: ${colors.surface};
`;

export const PreviewContainer = styled(View)`
  flex: 1;
  background-color: ${colors.background};
`;

export const PreviewImage = styled(Image)`
  flex: 1;
  background-color: #1a1a1a;
`;

export const PreviewActions = styled(View)`
  flex-direction: row;
  justify-content: space-around;
  padding: ${spacing.xl}px;
  background-color: ${colors.background};
`;

export const ActionButton = styled(TouchableOpacity)`
  align-items: center;
  padding: ${spacing.md}px;
  min-width: 100px;
`;

export const ActionButtonText = styled(Text)`
  color: ${colors.surface};
  font-size: 16px;
  margin-top: ${spacing.sm}px;
  font-weight: 600;
`;
