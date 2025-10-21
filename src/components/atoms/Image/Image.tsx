import React, { useState } from 'react';
import { View, ActivityIndicator, ViewStyle } from 'react-native';
import FastImage, { FastImageProps, ResizeMode } from 'react-native-fast-image';
import styled from 'styled-components/native';
import { theme } from '../../../theme';
import Icon from '../Icon';

export interface ImageProps extends Omit<FastImageProps, 'source'> {
  uri: string;
  width?: number | string;
  height?: number | string;
  resizeMode?: ResizeMode;
  borderRadius?: number;
  showLoader?: boolean;
  placeholder?: React.ReactNode;
  fallbackIcon?: string;
  style?: ViewStyle;
}

const Container = styled(View)<{ width?: number | string; height?: number | string; borderRadius?: number }>`
  ${(props) => props.width ? `width: ${typeof props.width === 'number' ? `${props.width}px` : props.width};` : ''}
  ${(props) => props.height ? `height: ${typeof props.height === 'number' ? `${props.height}px` : props.height};` : ''}
  ${(props) => props.borderRadius ? `border-radius: ${props.borderRadius}px;` : ''}
  overflow: hidden;
  background-color: ${theme.colors.surface};
  justify-content: center;
  align-items: center;
`;

const StyledImage = styled(FastImage)<{ borderRadius?: number }>`
  width: 100%;
  height: 100%;
  ${(props) => props.borderRadius ? `border-radius: ${props.borderRadius}px;` : ''}
`;

const LoaderContainer = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.surface};
`;

const ErrorContainer = styled(View)`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.surface};
`;

const Image: React.FC<ImageProps> = ({
  uri,
  width,
  height,
  resizeMode = 'cover',
  borderRadius = theme.borderRadius.medium,
  showLoader = true,
  placeholder,
  fallbackIcon = 'broken-image',
  style,
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <Container width={width} height={height} borderRadius={borderRadius} style={style}>
      {!error ? (
        <>
          <StyledImage
            source={{ uri, priority: FastImage.priority.normal }}
            resizeMode={resizeMode}
            borderRadius={borderRadius}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            onError={handleError}
            {...props}
          />
          {loading && showLoader && (
            <LoaderContainer>
              {placeholder || <ActivityIndicator color={theme.colors.primary} />}
            </LoaderContainer>
          )}
        </>
      ) : (
        <ErrorContainer>
          <Icon name={fallbackIcon} size={48} color={theme.colors.textDisabled} />
        </ErrorContainer>
      )}
    </Container>
  );
};

export default Image;
