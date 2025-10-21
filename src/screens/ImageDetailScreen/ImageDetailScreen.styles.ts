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
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  overlay: 'rgba(0, 0, 0, 0.7)',
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

export const ImageContainer = styled(View)`
  background-color: #000000;
  aspect-ratio: 1;
  width: 100%;
`;

export const FullImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

export const ContentSection = styled(View)`
  padding: ${spacing.lg}px;
`;

export const SummaryCard = styled(View)`
  background-color: ${colors.surface};
  border-radius: 12px;
  padding: ${spacing.lg}px;
  margin-bottom: ${spacing.lg}px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 2.62px;
  border-left-width: 4px;
  border-left-color: ${colors.secondary};
`;

export const SummaryIcon = styled(Text)`
  font-size: 24px;
  margin-bottom: ${spacing.sm}px;
`;

export const SummaryText = styled(Text)`
  font-size: 16px;
  color: ${colors.text};
  line-height: 24px;
`;

export const SpeciesSection = styled(View)`
  background-color: ${colors.surface};
  border-radius: 12px;
  padding: ${spacing.lg}px;
  margin-bottom: ${spacing.lg}px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 2.62px;
`;

export const SpeciesHeader = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.lg}px;
`;

export const SpeciesTitle = styled(Text)`
  font-size: 18px;
  font-weight: bold;
  color: ${colors.text};
`;

export const ConfidenceBadge = styled(View)`
  background-color: ${colors.success};
  border-radius: 16px;
  padding: ${spacing.xs}px ${spacing.md}px;
`;

export const ConfidenceText = styled(Text)`
  color: ${colors.surface};
  font-size: 12px;
  font-weight: bold;
`;

export const SpeciesNames = styled(View)`
  gap: ${spacing.md}px;
`;

export const CommonName = styled(View)``;

export const ScientificName = styled(View)``;

export const NameLabel = styled(Text)`
  font-size: 12px;
  color: ${colors.textSecondary};
  margin-bottom: ${spacing.xs}px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const NameValue = styled(Text)`
  font-size: 18px;
  color: ${colors.text};
  font-weight: 600;
`;

export const ActionSection = styled(View)`
  margin-bottom: ${spacing.lg}px;
`;

export const RescanButton = styled(TouchableOpacity)`
  background-color: ${colors.primary};
  border-radius: 8px;
  padding: ${spacing.md}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 2.62px;
`;

export const RescanButtonIcon = styled(Text)`
  font-size: 24px;
  margin-right: ${spacing.sm}px;
`;

export const RescanButtonText = styled(Text)`
  color: ${colors.surface};
  font-size: 16px;
  font-weight: 600;
`;

export const DetailsSection = styled(View)`
  margin-bottom: ${spacing.lg}px;
`;

export const DetailsSectionTitle = styled(Text)`
  font-size: 18px;
  font-weight: bold;
  color: ${colors.text};
  margin-bottom: ${spacing.md}px;
`;

export const DetailCard = styled(View)`
  background-color: ${colors.surface};
  border-radius: 8px;
  padding: ${spacing.md}px;
  margin-bottom: ${spacing.sm}px;
  border: 1px solid ${colors.border};
`;

export const DetailRow = styled(View)``;

export const DetailLabel = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.text};
  margin-bottom: ${spacing.xs}px;
`;

export const DetailValue = styled(Text)`
  font-size: 14px;
  color: ${colors.textSecondary};
  line-height: 20px;
`;

export const LoadingOverlay = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${colors.overlay};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const LoadingText = styled(Text)`
  color: ${colors.surface};
  font-size: 18px;
  margin-top: ${spacing.md}px;
  font-weight: 600;
`;
