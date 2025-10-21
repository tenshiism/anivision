import { useState, useCallback } from 'react';
import { launchCamera, launchImageLibrary, ImagePickerResponse, Asset } from 'react-native-image-picker';
import { PermissionsAndroid, Platform } from 'react-native';

/**
 * Image source types
 */
export type ImageSource = 'camera' | 'gallery';

/**
 * Image information returned by the picker
 */
export interface ImageInfo {
  uri: string;
  fileName: string;
  fileSize: number;
  width: number;
  height: number;
  type: string;
  timestamp: number;
}

/**
 * Return type for useImagePicker hook
 */
export interface UseImagePickerReturn {
  pickImage: (source: ImageSource) => Promise<void>;
  image: ImageInfo | null;
  isLoading: boolean;
  error: string | null;
  clearImage: () => void;
  clearError: () => void;
}

/**
 * Custom hook for handling image selection from camera or gallery
 *
 * Features:
 * - Camera and gallery image selection
 * - Automatic permission handling
 * - Image information extraction
 * - Loading and error state management
 *
 * @returns {UseImagePickerReturn} Image picker functionality and state
 *
 * @example
 * ```typescript
 * const { pickImage, image, isLoading, error, clearImage } = useImagePicker();
 *
 * // Pick from camera
 * await pickImage('camera');
 *
 * // Pick from gallery
 * await pickImage('gallery');
 *
 * // Clear selected image
 * clearImage();
 * ```
 */
export const useImagePicker = (): UseImagePickerReturn => {
  const [image, setImage] = useState<ImageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Request camera permission for Android
   */
  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'AniVision needs access to your camera to take photos of animals',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Error requesting camera permission:', err);
      return false;
    }
  };

  /**
   * Request gallery permission for Android
   */
  const requestGalleryPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Gallery Permission',
          message: 'AniVision needs access to your photo gallery',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Error requesting gallery permission:', err);
      return false;
    }
  };

  /**
   * Extract image information from picker response
   */
  const extractImageInfo = (asset: Asset): ImageInfo | null => {
    if (!asset.uri) {
      return null;
    }

    return {
      uri: asset.uri,
      fileName: asset.fileName || `image_${Date.now()}.jpg`,
      fileSize: asset.fileSize || 0,
      width: asset.width || 0,
      height: asset.height || 0,
      type: asset.type || 'image/jpeg',
      timestamp: Date.now(),
    };
  };

  /**
   * Handle image picker response
   */
  const handlePickerResponse = useCallback((response: ImagePickerResponse): ImageInfo | null => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
      return null;
    }

    if (response.errorCode) {
      throw new Error(response.errorMessage || 'Image picker error');
    }

    if (response.assets && response.assets.length > 0) {
      return extractImageInfo(response.assets[0]);
    }

    return null;
  }, []);

  /**
   * Pick image from camera
   */
  const pickFromCamera = async (): Promise<ImageInfo | null> => {
    const hasPermission = await requestCameraPermission();

    if (!hasPermission) {
      throw new Error('Camera permission denied');
    }

    return new Promise((resolve, reject) => {
      launchCamera(
        {
          mediaType: 'photo',
          quality: 0.8,
          maxWidth: 2048,
          maxHeight: 2048,
          includeBase64: false,
          saveToPhotos: false,
        },
        (response) => {
          try {
            const imageInfo = handlePickerResponse(response);
            resolve(imageInfo);
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  };

  /**
   * Pick image from gallery
   */
  const pickFromGallery = async (): Promise<ImageInfo | null> => {
    const hasPermission = await requestGalleryPermission();

    if (!hasPermission) {
      throw new Error('Gallery permission denied');
    }

    return new Promise((resolve, reject) => {
      launchImageLibrary(
        {
          mediaType: 'photo',
          quality: 0.8,
          maxWidth: 2048,
          maxHeight: 2048,
          includeBase64: false,
          selectionLimit: 1,
        },
        (response) => {
          try {
            const imageInfo = handlePickerResponse(response);
            resolve(imageInfo);
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  };

  /**
   * Pick image from specified source
   */
  const pickImage = useCallback(async (source: ImageSource): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      let imageInfo: ImageInfo | null = null;

      if (source === 'camera') {
        imageInfo = await pickFromCamera();
      } else if (source === 'gallery') {
        imageInfo = await pickFromGallery();
      } else {
        throw new Error(`Invalid image source: ${source}`);
      }

      if (imageInfo) {
        setImage(imageInfo);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to pick image';
      setError(errorMessage);
      console.error('Image picker error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [handlePickerResponse]);

  /**
   * Clear selected image
   */
  const clearImage = useCallback(() => {
    setImage(null);
    setError(null);
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    pickImage,
    image,
    isLoading,
    error,
    clearImage,
    clearError,
  };
};

export default useImagePicker;
