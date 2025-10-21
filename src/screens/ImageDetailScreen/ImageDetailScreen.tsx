import React, { useCallback, useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Container,
  HeaderBar,
  HeaderContent,
  BackButton,
  HeaderTitle,
  HeaderActions,
  IconButton,
  ButtonIcon,
  ImageContainer,
  FullImage,
  ContentSection,
  SummaryCard,
  SummaryIcon,
  SummaryText,
  SpeciesSection,
  SpeciesHeader,
  SpeciesTitle,
  ConfidenceBadge,
  ConfidenceText,
  SpeciesNames,
  CommonName,
  ScientificName,
  NameLabel,
  NameValue,
  ActionSection,
  RescanButton,
  RescanButtonIcon,
  RescanButtonText,
  DetailsSection,
  DetailsSectionTitle,
  DetailCard,
  DetailLabel,
  DetailValue,
  DetailRow,
  LoadingOverlay,
  LoadingText,
} from './ImageDetailScreen.styles';

export interface SpeciesIdentification {
  commonName: string;
  scientificName: string;
  summary: string;
  confidence: number;
  habitat?: string;
  behavior?: string;
  conservation?: string;
  diet?: string;
  distribution?: string;
  funFact?: string;
}

export interface ImageDetailScreenProps {
  imageId?: string;
  imageUri?: string;
  isNewCapture?: boolean;
}

type NavigationProp = NativeStackNavigationProp<any>;

const ImageDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const params = (route.params || {}) as ImageDetailScreenProps;

  const [isScanning, setIsScanning] = useState(false);
  const [identification, setIdentification] = useState<SpeciesIdentification | null>(null);

  // Mock data for demonstration
  // TODO: Load actual identification data from storage or API
  React.useEffect(() => {
    if (params.isNewCapture) {
      handleRescan();
    } else {
      // Load saved identification
      setIdentification({
        commonName: 'African Lion',
        scientificName: 'Panthera leo',
        summary: 'A magnificent adult African lion displaying characteristic tawny coat and powerful build in natural savanna habitat.',
        confidence: 0.95,
        habitat: 'Grasslands, savannas, and open woodlands',
        behavior: 'Social animals living in prides, primarily nocturnal hunters',
        conservation: 'Vulnerable - Population declining due to habitat loss',
        diet: 'Carnivorous - Large herbivores such as zebras and wildebeest',
        distribution: 'Sub-Saharan Africa',
        funFact: 'Lions are the only cats that live in groups called prides',
      });
    }
  }, [params.isNewCapture]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleShare = useCallback(() => {
    // TODO: Implement share functionality
    Alert.alert('Share', 'Share functionality will be implemented');
  }, []);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Delete image from storage
            navigation.goBack();
          },
        },
      ]
    );
  }, [navigation]);

  const handleRescan = useCallback(async () => {
    setIsScanning(true);
    try {
      // TODO: Call OpenAI Vision API to identify species
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock response
      setIdentification({
        commonName: 'African Lion',
        scientificName: 'Panthera leo',
        summary: 'A magnificent adult African lion displaying characteristic tawny coat and powerful build in natural savanna habitat.',
        confidence: 0.95,
        habitat: 'Grasslands, savannas, and open woodlands',
        behavior: 'Social animals living in prides, primarily nocturnal hunters',
        conservation: 'Vulnerable - Population declining due to habitat loss',
        diet: 'Carnivorous - Large herbivores such as zebras and wildebeest',
        distribution: 'Sub-Saharan Africa',
        funFact: 'Lions are the only cats that live in groups called prides',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to identify species. Please try again.');
    } finally {
      setIsScanning(false);
    }
  }, []);

  const imageUri = params.imageUri || 'https://via.placeholder.com/800';

  return (
    <Container>
      <HeaderBar>
        <HeaderContent>
          <BackButton onPress={handleGoBack} accessibilityLabel="Go back">
            <ButtonIcon>←</ButtonIcon>
          </BackButton>
          <HeaderTitle>Image Detail</HeaderTitle>
          <HeaderActions>
            <IconButton onPress={handleShare} accessibilityLabel="Share image">
              <ButtonIcon>📤</ButtonIcon>
            </IconButton>
            <IconButton onPress={handleDelete} accessibilityLabel="Delete image">
              <ButtonIcon>🗑️</ButtonIcon>
            </IconButton>
          </HeaderActions>
        </HeaderContent>
      </HeaderBar>

      <ScrollView>
        <ImageContainer>
          <FullImage
            source={{ uri: imageUri }}
            resizeMode="contain"
            accessibilityLabel="Species image"
          />
        </ImageContainer>

        {identification && (
          <ContentSection>
            {/* One sentence AI summary (as per requirements.md) */}
            <SummaryCard>
              <SummaryIcon>💡</SummaryIcon>
              <SummaryText>{identification.summary}</SummaryText>
            </SummaryCard>

            {/* Scientific and common names (as per requirements.md) */}
            <SpeciesSection>
              <SpeciesHeader>
                <SpeciesTitle>Species Identification</SpeciesTitle>
                <ConfidenceBadge>
                  <ConfidenceText>
                    {Math.round(identification.confidence * 100)}% Confident
                  </ConfidenceText>
                </ConfidenceBadge>
              </SpeciesHeader>

              <SpeciesNames>
                <CommonName>
                  <NameLabel>Common Name</NameLabel>
                  <NameValue>{identification.commonName}</NameValue>
                </CommonName>

                <ScientificName>
                  <NameLabel>Scientific Name</NameLabel>
                  <NameValue style={{ fontStyle: 'italic' }}>
                    {identification.scientificName}
                  </NameValue>
                </ScientificName>
              </SpeciesNames>
            </SpeciesSection>

            {/* Re-scan button (as per requirements.md) */}
            <ActionSection>
              <RescanButton
                onPress={handleRescan}
                disabled={isScanning}
                accessibilityLabel="Re-scan image"
                accessibilityHint="Analyzes the image again for species identification"
              >
                <RescanButtonIcon>🔄</RescanButtonIcon>
                <RescanButtonText>
                  {isScanning ? 'Scanning...' : 'Re-scan Image'}
                </RescanButtonText>
              </RescanButton>
            </ActionSection>

            {/* Additional species details (as per requirements.md) */}
            <DetailsSection>
              <DetailsSectionTitle>Additional Species Details</DetailsSectionTitle>

              {identification.habitat && (
                <DetailCard>
                  <DetailRow>
                    <DetailLabel>🌍 Habitat</DetailLabel>
                    <DetailValue>{identification.habitat}</DetailValue>
                  </DetailRow>
                </DetailCard>
              )}

              {identification.behavior && (
                <DetailCard>
                  <DetailRow>
                    <DetailLabel>🦁 Behavior</DetailLabel>
                    <DetailValue>{identification.behavior}</DetailValue>
                  </DetailRow>
                </DetailCard>
              )}

              {identification.diet && (
                <DetailCard>
                  <DetailRow>
                    <DetailLabel>🍖 Diet</DetailLabel>
                    <DetailValue>{identification.diet}</DetailValue>
                  </DetailRow>
                </DetailCard>
              )}

              {identification.distribution && (
                <DetailCard>
                  <DetailRow>
                    <DetailLabel>📍 Distribution</DetailLabel>
                    <DetailValue>{identification.distribution}</DetailValue>
                  </DetailRow>
                </DetailCard>
              )}

              {identification.conservation && (
                <DetailCard>
                  <DetailRow>
                    <DetailLabel>⚠️ Conservation Status</DetailLabel>
                    <DetailValue>{identification.conservation}</DetailValue>
                  </DetailRow>
                </DetailCard>
              )}

              {identification.funFact && (
                <DetailCard>
                  <DetailRow>
                    <DetailLabel>✨ Fun Fact</DetailLabel>
                    <DetailValue>{identification.funFact}</DetailValue>
                  </DetailRow>
                </DetailCard>
              )}
            </DetailsSection>
          </ContentSection>
        )}

        {!identification && !isScanning && (
          <ContentSection>
            <SummaryCard>
              <SummaryText>No identification data available. Tap Re-scan to analyze this image.</SummaryText>
            </SummaryCard>
            <ActionSection>
              <RescanButton onPress={handleRescan}>
                <RescanButtonIcon>🔄</RescanButtonIcon>
                <RescanButtonText>Scan Image</RescanButtonText>
              </RescanButton>
            </ActionSection>
          </ContentSection>
        )}
      </ScrollView>

      {isScanning && (
        <LoadingOverlay>
          <SummaryIcon style={{ fontSize: 48 }}>🔍</SummaryIcon>
          <LoadingText>Analyzing image...</LoadingText>
        </LoadingOverlay>
      )}
    </Container>
  );
};

export default ImageDetailScreen;
