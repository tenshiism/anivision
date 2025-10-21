import React, { useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Container,
  HeaderBar,
  HeaderContent,
  MenuButton,
  HeaderTitle,
  ButtonIcon,
  ContentSection,
  QuickActionsContainer,
  QuickActionCard,
  ActionIconLarge,
  ActionTitle,
  ActionDescription,
  FeaturesSection,
  FeatureItem,
  FeatureIcon,
  FeatureText,
} from './HomeScreen.styles';

export interface HomeScreenProps {
  onOpenDrawer?: () => void;
}

type NavigationProp = NativeStackNavigationProp<any>;

const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenDrawer }) => {
  const navigation = useNavigation<NavigationProp>();

  const handleOpenDrawer = useCallback(() => {
    if (onOpenDrawer) {
      onOpenDrawer();
    } else {
      (navigation as any).openDrawer?.();
    }
  }, [navigation, onOpenDrawer]);

  const handleOpenCamera = useCallback(() => {
    navigation.navigate('Camera');
  }, [navigation]);

  const handleOpenGallery = useCallback(() => {
    navigation.navigate('Gallery');
  }, [navigation]);

  return (
    <Container>
      <HeaderBar>
        <HeaderContent>
          <MenuButton onPress={handleOpenDrawer} accessibilityLabel="Open navigation menu">
            <ButtonIcon>☰</ButtonIcon>
          </MenuButton>
          <HeaderTitle>AniVision</HeaderTitle>
        </HeaderContent>
      </HeaderBar>

      <ScrollView>
        <ContentSection>
          <QuickActionsContainer>
            <QuickActionCard
              onPress={handleOpenCamera}
              accessibilityLabel="Open camera to identify species"
              accessibilityHint="Opens camera interface to capture photos"
            >
              <ActionIconLarge>📷</ActionIconLarge>
              <ActionTitle>Camera</ActionTitle>
              <ActionDescription>
                Capture photos to identify species
              </ActionDescription>
            </QuickActionCard>

            <QuickActionCard
              onPress={handleOpenGallery}
              accessibilityLabel="Open gallery"
              accessibilityHint="View all identified species images"
            >
              <ActionIconLarge>🖼️</ActionIconLarge>
              <ActionTitle>Gallery</ActionTitle>
              <ActionDescription>
                Browse identified species
              </ActionDescription>
            </QuickActionCard>
          </QuickActionsContainer>

          <FeaturesSection>
            <FeatureItem>
              <FeatureIcon>🔍</FeatureIcon>
              <FeatureText>AI-powered species identification</FeatureText>
            </FeatureItem>

            <FeatureItem>
              <FeatureIcon>📚</FeatureIcon>
              <FeatureText>Detailed species information</FeatureText>
            </FeatureItem>

            <FeatureItem>
              <FeatureIcon>💾</FeatureIcon>
              <FeatureText>Save and organize your discoveries</FeatureText>
            </FeatureItem>

            <FeatureItem>
              <FeatureIcon>🌍</FeatureIcon>
              <FeatureText>Explore nature's diversity</FeatureText>
            </FeatureItem>
          </FeaturesSection>
        </ContentSection>
      </ScrollView>
    </Container>
  );
};

export default HomeScreen;
