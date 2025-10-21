import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
  ContentContainer,
  GridContainer,
  ImageCard,
  ImageThumbnail,
  ImageOverlay,
  SpeciesName,
  ConfidenceBadge,
  ConfidenceText,
  EmptyContainer,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
  EmptyActionButton,
  EmptyActionText,
} from './GalleryScreen.styles';

export interface IdentifiedImage {
  id: string;
  uri: string;
  thumbnailUri?: string;
  species: string;
  scientificName?: string;
  confidence?: number;
  timestamp: Date;
}

export interface GalleryScreenProps {
  images?: IdentifiedImage[];
  onRefresh?: () => Promise<void>;
}

type NavigationProp = NativeStackNavigationProp<any>;

const GalleryScreen: React.FC<GalleryScreenProps> = ({
  images = [],
  onRefresh,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSearch = useCallback(() => {
    // TODO: Implement search functionality
    console.log('Search pressed');
  }, []);

  const handleSort = useCallback(() => {
    // TODO: Implement sort options
    console.log('Sort pressed');
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
      // TODO: Load images from storage
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  const handleImagePress = useCallback((image: IdentifiedImage) => {
    if (selectedImages.size > 0) {
      // Selection mode - toggle selection
      setSelectedImages((prev) => {
        const next = new Set(prev);
        if (next.has(image.id)) {
          next.delete(image.id);
        } else {
          next.add(image.id);
        }
        return next;
      });
    } else {
      // Normal mode - navigate to detail
      navigation.navigate('ImageDetail', { imageId: image.id });
    }
  }, [navigation, selectedImages]);

  const handleImageLongPress = useCallback((image: IdentifiedImage) => {
    setSelectedImages(new Set([image.id]));
  }, []);

  const handleTakePhoto = useCallback(() => {
    navigation.navigate('Camera');
  }, [navigation]);

  const renderImageCard = useCallback(({ item }: { item: IdentifiedImage }) => {
    const isSelected = selectedImages.has(item.id);
    const displayUri = item.thumbnailUri || item.uri;

    return (
      <ImageCard
        onPress={() => handleImagePress(item)}
        onLongPress={() => handleImageLongPress(item)}
        accessibilityLabel={`${item.species} image`}
        accessibilityHint="Tap to view details, long press to select"
      >
        <ImageThumbnail source={{ uri: displayUri }} />
        <ImageOverlay>
          <SpeciesName numberOfLines={1}>{item.species}</SpeciesName>
          {item.confidence !== undefined && (
            <ConfidenceBadge>
              <ConfidenceText>{Math.round(item.confidence * 100)}%</ConfidenceText>
            </ConfidenceBadge>
          )}
        </ImageOverlay>
        {isSelected && (
          <ImageOverlay style={{ backgroundColor: 'rgba(25, 118, 210, 0.3)' }}>
            <ButtonIcon style={{ fontSize: 32 }}>✓</ButtonIcon>
          </ImageOverlay>
        )}
      </ImageCard>
    );
  }, [selectedImages, handleImagePress, handleImageLongPress]);

  const renderEmptyState = useCallback(() => (
    <EmptyContainer>
      <EmptyIcon>🖼️</EmptyIcon>
      <EmptyTitle>No Images Yet</EmptyTitle>
      <EmptyDescription>
        Start identifying species by taking photos or selecting from your device gallery.
      </EmptyDescription>
      <EmptyActionButton onPress={handleTakePhoto}>
        <ButtonIcon>📷</ButtonIcon>
        <EmptyActionText>Take Your First Photo</EmptyActionText>
      </EmptyActionButton>
    </EmptyContainer>
  ), [handleTakePhoto]);

  return (
    <Container>
      <HeaderBar>
        <HeaderContent>
          <BackButton onPress={handleGoBack} accessibilityLabel="Go back">
            <ButtonIcon>←</ButtonIcon>
          </BackButton>
          <HeaderTitle>Gallery</HeaderTitle>
          <HeaderActions>
            <IconButton onPress={handleSearch} accessibilityLabel="Search images">
              <ButtonIcon>🔍</ButtonIcon>
            </IconButton>
            <IconButton onPress={handleSort} accessibilityLabel="Sort images">
              <ButtonIcon>⋯</ButtonIcon>
            </IconButton>
          </HeaderActions>
        </HeaderContent>
      </HeaderBar>

      <ContentContainer>
        {images.length > 0 ? (
          <FlatList
            data={images}
            renderItem={renderImageCard}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={{ padding: 4 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={['#1976D2']}
              />
            }
          />
        ) : (
          renderEmptyState()
        )}
      </ContentContainer>
    </Container>
  );
};

export default GalleryScreen;
