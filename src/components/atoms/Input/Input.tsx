import React, { useState } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../../../theme';
import { InputState } from '../../../types';
import Text from '../Text';
import Icon from '../Icon';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputState?: InputState;
  required?: boolean;
  secureTextEntry?: boolean;
}

const Container = styled(View)`
  width: 100%;
  margin-bottom: ${theme.spacing.md}px;
`;

const LabelContainer = styled(View)`
  flex-direction: row;
  margin-bottom: ${theme.spacing.xs}px;
`;

const InputContainer = styled(View)<{ state: InputState }>`
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-radius: ${theme.borderRadius.medium}px;
  padding-horizontal: ${theme.spacing.md}px;
  background-color: ${(props) => props.state === 'disabled' ? theme.colors.disabled : theme.colors.background};
  border-color: ${(props) => {
    switch (props.state) {
      case 'error':
        return theme.colors.error;
      case 'success':
        return theme.colors.success;
      case 'focus':
        return theme.colors.primary;
      default:
        return theme.colors.border;
    }
  }};
`;

const StyledInput = styled(TextInput)`
  flex: 1;
  padding-vertical: ${theme.spacing.sm}px;
  font-size: 16px;
  color: ${theme.colors.text};
`;

const IconContainer = styled(View)`
  margin-horizontal: ${theme.spacing.xs}px;
`;

const MessageText = styled(Text)<{ type: 'error' | 'success' | 'hint' }>`
  margin-top: ${theme.spacing.xs}px;
  color: ${(props) => {
    switch (props.type) {
      case 'error':
        return theme.colors.error;
      case 'success':
        return theme.colors.success;
      default:
        return theme.colors.textSecondary;
    }
  }};
`;

const RequiredAsterisk = styled(Text)`
  color: ${theme.colors.error};
  margin-left: 2px;
`;

const Input: React.FC<InputProps> = ({
  label,
  error,
  success,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputState = 'default',
  required = false,
  secureTextEntry = false,
  editable = true,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const getCurrentState = (): InputState => {
    if (!editable) return 'disabled';
    if (error) return 'error';
    if (success) return 'success';
    if (isFocused) return 'focus';
    return inputState;
  };

  const state = getCurrentState();
  const isPassword = secureTextEntry;
  const showPassword = isPasswordVisible && isPassword;

  return (
    <Container style={containerStyle}>
      {label && (
        <LabelContainer>
          <Text variant="subtitle2" color={theme.colors.textSecondary}>
            {label}
          </Text>
          {required && <RequiredAsterisk variant="subtitle2">*</RequiredAsterisk>}
        </LabelContainer>
      )}

      <InputContainer state={state}>
        {leftIcon && (
          <IconContainer>
            <Icon
              name={leftIcon}
              size={20}
              color={state === 'error' ? theme.colors.error : theme.colors.textSecondary}
            />
          </IconContainer>
        )}

        <StyledInput
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={theme.colors.placeholder}
          editable={editable}
          secureTextEntry={isPassword && !isPasswordVisible}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            activeOpacity={0.7}
          >
            <IconContainer>
              <Icon
                name={isPasswordVisible ? 'visibility' : 'visibility-off'}
                size={20}
                color={theme.colors.textSecondary}
              />
            </IconContainer>
          </TouchableOpacity>
        )}

        {rightIcon && !isPassword && (
          <TouchableOpacity
            onPress={onRightIconPress}
            activeOpacity={0.7}
            disabled={!onRightIconPress}
          >
            <IconContainer>
              <Icon
                name={rightIcon}
                size={20}
                color={theme.colors.textSecondary}
              />
            </IconContainer>
          </TouchableOpacity>
        )}
      </InputContainer>

      {error && (
        <MessageText variant="caption" type="error">
          {error}
        </MessageText>
      )}

      {success && !error && (
        <MessageText variant="caption" type="success">
          {success}
        </MessageText>
      )}

      {hint && !error && !success && (
        <MessageText variant="caption" type="hint">
          {hint}
        </MessageText>
      )}
    </Container>
  );
};

export default Input;
