import { Pressable, StyleSheet, Text } from 'react-native';

import { palette } from '@/constants/palette';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
};

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  variant = 'primary',
}: PrimaryButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        (disabled || pressed) && styles.buttonPressed,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.label,
          variant === 'ghost' && styles.ghostLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 18,
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: 18,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
  },
  ghostLabel: {
    color: palette.text,
  },
  label: {
    color: '#14202E',
    fontSize: 15,
    fontWeight: '800',
  },
  primary: {
    backgroundColor: palette.accent,
  },
  secondary: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
  },
});
