import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../../../theme';
import { ButtonVariant, ButtonSize } from '../../../types';
import Text from '../Text';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  style?: ViewStyle;
}

interface StyledButtonProps {
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
}

const getButtonColors = (variant: ButtonVariant, disabled?: boolean) => {
  if (disabled) {
    return {
      backgroundColor: theme.colors.disabled,
      borderColor: theme.colors.border,
      textColor: theme.colors.textDisabled,
    };
  }

  switch (variant) {
    case 'primary':
      return {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
        textColor: '#FFFFFF',
      };
    case 'secondary':
      return {
        backgroundColor: theme.colors.secondary,
        borderColor: theme.colors.secondary,
        textColor: '#FFFFFF',
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        borderColor: theme.colors.primary,
        textColor: theme.colors.primary,
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        textColor: theme.colors.primary,
      };
    case 'danger':
      return {
        backgroundColor: theme.colors.error,
        borderColor: theme.colors.error,
        textColor: '#FFFFFF',
      };
    default:
      return {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
        textColor: '#FFFFFF',
      };
  }
};

const getButtonSize = (size: ButtonSize) => {
  switch (size) {
    case 'small':
      return {
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.md,
        fontSize: 12,
      };
    case 'medium':
      return {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        fontSize: 14,
      };
    case 'large':
      return {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xl,
        fontSize: 16,
      };
    default:
      return {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        fontSize: 14,
      };
  }
};

const StyledButton = styled(TouchableOpacity)<StyledButtonProps>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.medium}px;
  border-width: 1px;
  ${(props) => {
    const colors = getButtonColors(props.variant, props.disabled);
    const sizes = getButtonSize(props.size);
    return `
      background-color: ${colors.backgroundColor};
      border-color: ${colors.borderColor};
      padding-vertical: ${sizes.paddingVertical}px;
      padding-horizontal: ${sizes.paddingHorizontal}px;
      ${props.fullWidth ? 'width: 100%;' : ''}
      opacity: ${props.disabled ? 0.6 : 1};
    `;
  }}
`;

const ButtonContent = styled.View<{ hasIcon?: boolean; iconPosition?: 'left' | 'right' }>`
  flex-direction: row;
  align-items: center;
  ${(props) => props.hasIcon && props.iconPosition === 'left' ? `gap: ${theme.spacing.xs}px;` : ''}
  ${(props) => props.hasIcon && props.iconPosition === 'right' ? `gap: ${theme.spacing.xs}px; flex-direction: row-reverse;` : ''}
`;

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  children,
  style,
  ...props
}) => {
  const colors = getButtonColors(variant, disabled);
  const sizes = getButtonSize(size);
  const isDisabled = disabled || loading;

  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={style}
      {...props}
    >
      <ButtonContent hasIcon={!!icon} iconPosition={iconPosition}>
        {loading ? (
          <ActivityIndicator color={colors.textColor} size="small" />
        ) : (
          <>
            {icon}
            <Text
              variant="button"
              style={{
                color: colors.textColor,
                fontSize: sizes.fontSize,
              }}
            >
              {children}
            </Text>
          </>
        )}
      </ButtonContent>
    </StyledButton>
  );
};

export default Button;
