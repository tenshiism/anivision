import React, { useCallback, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Container,
  HeaderBar,
  HeaderContent,
  MenuButton,
  SettingsButton,
  AppTitle,
  ContentSection,
  LogoContainer,
  AppLogo,
  Tagline,
  ActionButtonsContainer,
  ActionButton,
  ButtonIcon,
  ButtonText,
  RecentSection,
  SectionTitle,
  RecentImagesContainer,
  RecentImageCard,
  RecentImage,
  EmptyStateText,
} from './WelcomeScreen.styles';

export interface WelcomeScreenProps {
  isFirstLaunch?: boolean;
  onOpenDrawer?: () => void;
}

type NavigationProp = NativeStackNavigationProp<any>;

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  isFirstLaunch = false,
  onOpenDrawer,
}) => {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    // Show onboarding for first-time users
    if (isFirstLaunch) {
      // TODO: Show onboarding overlay
      console.log('First launch - show onboarding');
    }
  }, [isFirstLaunch]);

  const handleOpenDrawer = useCallback(() => {
    if (onOpenDrawer) {
      onOpenDrawer();
    } else {
      // Fallback to navigation drawer if available
      (navigation as any).openDrawer?.();
    }
  }, [navigation, onOpenDrawer]);

  const handleOpenSettings = useCallback(() => {
    navigation.navigate('Settings');
  }, [navigation]);

  const handleTakePhoto = useCallback(() => {
    navigation.navigate('Camera');
  }, [navigation]);

  const handleChooseFromGallery = useCallback(() => {
    navigation.navigate('Gallery');
  }, [navigation]);

  const handleRecentImagePress = useCallback((imageId: string) => {
    navigation.navigate('ImageDetail', { imageId });
  }, [navigation]);

  // TODO: Load recent images from storage
  const recentImages: Array<{ id: string; uri: string; species: string }> = [];

  return (
    <Container>
      <HeaderBar>
        <HeaderContent>
          <MenuButton onPress={handleOpenDrawer} accessibilityLabel="Open navigation menu">
            <ButtonIcon>☰</ButtonIcon>
          </MenuButton>
          <AppTitle>AniVision</AppTitle>
          <SettingsButton onPress={handleOpenSettings} accessibilityLabel="Open settings">
            <ButtonIcon>⚙️</ButtonIcon>
          </SettingsButton>
        </HeaderContent>
      </HeaderBar>

      <ScrollView>
        <ContentSection>
          <LogoContainer>
            <AppLogo accessibilityLabel="AniVision logo">
              🔍🦁
            </AppLogo>
            <Tagline>Discover Nature's Diversity</Tagline>
          </LogoContainer>

          <ActionButtonsContainer>
            <ActionButton
              onPress={handleTakePhoto}
              accessibilityLabel="Take a photo to identify species"
              accessibilityHint="Opens the camera to capture an image"
            >
              <ButtonIcon>📷</ButtonIcon>
              <ButtonText>Take Photo</ButtonText>
            </ActionButton>

            <ActionButton
              onPress={handleChooseFromGallery}
              accessibilityLabel="Choose from gallery"
              accessibilityHint="Opens gallery to select an existing image"
            >
              <ButtonIcon>🖼️</ButtonIcon>
              <ButtonText>Choose from Gallery</ButtonText>
            </ActionButton>
          </ActionButtonsContainer>

          <RecentSection>
            <SectionTitle>Recent Identifications</SectionTitle>
            {recentImages.length > 0 ? (
              <RecentImagesContainer>
                {recentImages.slice(0, 3).map((image) => (
                  <RecentImageCard
                    key={image.id}
                    onPress={() => handleRecentImagePress(image.id)}
                    accessibilityLabel={`View ${image.species} identification`}
                  >
                    <RecentImage source={{ uri: image.uri }} />
                  </RecentImageCard>
                ))}
              </RecentImagesContainer>
            ) : (
              <EmptyStateText>
                No identifications yet. Take a photo to get started!
              </EmptyStateText>
            )}
          </RecentSection>
        </ContentSection>
      </ScrollView>
    </Container>
  );
};

export default WelcomeScreen;
