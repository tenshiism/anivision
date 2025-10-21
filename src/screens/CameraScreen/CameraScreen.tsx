import React, { useCallback, useState, useRef } from 'react';
import { View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Container,
  HeaderBar,
  HeaderContent,
  BackButton,
  HeaderTitle,
  FlashButton,
  ButtonIcon,
  CameraContainer,
  CameraPlaceholder,
  PlaceholderText,
  CameraOverlay,
  GuideFrame,
  GuideText,
  CameraControls,
  CaptureButton,
  CaptureButtonInner,
  PreviewContainer,
  PreviewImage,
  PreviewActions,
  ActionButton,
  ActionButtonText,
} from './CameraScreen.styles';

export interface CameraScreenProps {
  onImageCaptured?: (imageUri: string) => void;
}

type NavigationProp = NativeStackNavigationProp<any>;

const CameraScreen: React.FC<CameraScreenProps> = ({ onImageCaptured }) => {
  const navigation = useNavigation<NavigationProp>();
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const toggleFlash = useCallback(() => {
    setFlashEnabled((prev) => !prev);
  }, []);

  const handleCapture = useCallback(() => {
    // TODO: Integrate with actual camera API (react-native-camera or expo-camera)
    // For now, simulate capture
    setIsProcessing(true);

    setTimeout(() => {
      // Simulated image URI
      const mockImageUri = 'file://path/to/captured/image.jpg';
      setCapturedImage(mockImageUri);
      setIsProcessing(false);
    }, 500);
  }, []);

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
  }, []);

  const handleUseImage = useCallback(() => {
    if (capturedImage) {
      if (onImageCaptured) {
        onImageCaptured(capturedImage);
      }
      // Navigate to processing or detail screen
      navigation.navigate('ImageDetail', { imageUri: capturedImage, isNewCapture: true });
    }
  }, [capturedImage, navigation, onImageCaptured]);

  return (
    <Container>
      <HeaderBar>
        <HeaderContent>
          <BackButton onPress={handleGoBack} accessibilityLabel="Go back">
            <ButtonIcon>←</ButtonIcon>
          </BackButton>
          <HeaderTitle>Camera</HeaderTitle>
          <FlashButton
            onPress={toggleFlash}
            accessibilityLabel={flashEnabled ? 'Disable flash' : 'Enable flash'}
          >
            <ButtonIcon>{flashEnabled ? '⚡' : '○'}</ButtonIcon>
          </FlashButton>
        </HeaderContent>
      </HeaderBar>

      {!capturedImage ? (
        <>
          <CameraContainer>
            {/* TODO: Replace with actual camera component */}
            <CameraPlaceholder>
              <PlaceholderText>
                Camera View
                {'\n'}
                (Requires camera integration)
              </PlaceholderText>
            </CameraPlaceholder>

            <CameraOverlay>
              <GuideFrame>
                <GuideText>Center the subject in frame</GuideText>
              </GuideFrame>
            </CameraOverlay>
          </CameraContainer>

          <CameraControls>
            <CaptureButton
              onPress={handleCapture}
              disabled={isProcessing}
              accessibilityLabel="Capture photo"
              accessibilityHint="Takes a photo for species identification"
            >
              <CaptureButtonInner />
            </CaptureButton>
          </CameraControls>
        </>
      ) : (
        <PreviewContainer>
          <PreviewImage source={{ uri: capturedImage }} resizeMode="contain" />
          <PreviewActions>
            <ActionButton onPress={handleRetake} accessibilityLabel="Retake photo">
              <ButtonIcon>🔄</ButtonIcon>
              <ActionButtonText>Retake</ActionButtonText>
            </ActionButton>
            <ActionButton onPress={handleUseImage} accessibilityLabel="Use this photo">
              <ButtonIcon>✓</ButtonIcon>
              <ActionButtonText>Use Photo</ActionButtonText>
            </ActionButton>
          </PreviewActions>
        </PreviewContainer>
      )}
    </Container>
  );
};

export default CameraScreen;
