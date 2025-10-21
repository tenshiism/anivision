import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../../../theme';
import { TextVariant } from '../../../types';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  children: React.ReactNode;
}

interface StyledTextProps {
  variant: TextVariant;
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

const StyledText = styled(RNText)<StyledTextProps>`
  ${(props) => {
    const typography = theme.typography[props.variant];
    return `
      font-size: ${typography.fontSize}px;
      font-weight: ${props.bold ? '700' : typography.fontWeight};
      line-height: ${typography.lineHeight}px;
      letter-spacing: ${typography.letterSpacing}px;
      color: ${props.color || theme.colors.text};
      text-align: ${props.align || 'left'};
      ${props.italic ? 'font-style: italic;' : ''}
      ${props.underline ? 'text-decoration-line: underline;' : ''}
      ${(typography as any).textTransform ? `text-transform: ${(typography as any).textTransform};` : ''}
    `;
  }}
`;

const Text: React.FC<TextProps> = ({
  variant = 'body1',
  color,
  align,
  bold,
  italic,
  underline,
  children,
  style,
  ...props
}) => {
  return (
    <StyledText
      variant={variant}
      color={color}
      align={align}
      bold={bold}
      italic={italic}
      underline={underline}
      style={style}
      {...props}
    >
      {children}
    </StyledText>
  );
};

export default Text;
