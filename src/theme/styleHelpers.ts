import type { CSSProperties } from 'react';
import { designTokens } from './tokens';

export const createSpacingStyle = (spacing: keyof typeof designTokens.spacing): CSSProperties => ({
  padding: designTokens.spacing[spacing],
});

export const createMarginStyle = (spacing: keyof typeof designTokens.spacing): CSSProperties => ({
  margin: designTokens.spacing[spacing],
});

export const createButtonStyle = (variant: 'primary' | 'secondary' | 'ghost' = 'secondary'): CSSProperties => {
  const baseStyle: CSSProperties = {
    fontWeight: designTokens.fontWeight.medium,
    borderRadius: designTokens.borderRadius.base,
  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyle,
        backgroundColor: designTokens.colors.primary,
        borderColor: designTokens.colors.primary,
        color: '#ffffff',
      };
    case 'secondary':
      return {
        ...baseStyle,
        backgroundColor: designTokens.colors.background.secondary,
        borderColor: designTokens.colors.border.secondary,
        color: designTokens.colors.text.primary,
      };
    case 'ghost':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderColor: designTokens.colors.border.primary,
        color: designTokens.colors.text.primary,
      };
    default:
      return baseStyle;
  }
};

export const createIconStyle = (size: keyof typeof designTokens.fontSize = 'lg'): CSSProperties => ({
  fontSize: designTokens.fontSize[size],
  width: designTokens.fontSize[size],
  height: designTokens.fontSize[size],
});

export const createLayoutStyle = (): CSSProperties => ({
  width: '100%',
  marginTop: designTokens.spacing.md, // Reduced from xl (24px) to md (12px) for more compact layout
});

export const createTableContainerStyle = (): CSSProperties => ({
  marginBottom: designTokens.spacing.md,
});

export const createFormItemStyle = (): CSSProperties => ({
  margin: 0,
});

export const createSearchDropdownStyle = (): CSSProperties => ({
  padding: designTokens.spacing.sm,
});

export const createSearchInputStyle = (): CSSProperties => ({
  marginBottom: designTokens.spacing.sm,
  display: 'block',
});

export const createButtonGroupStyle = (): CSSProperties => ({
  width: 90,
});

export const createConfirmButtonStyle = (): CSSProperties => ({
  fontWeight: designTokens.fontWeight.medium,
});

export const createCancelButtonStyle = (): CSSProperties => ({
  marginLeft: designTokens.spacing.xs,
});