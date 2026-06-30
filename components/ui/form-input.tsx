import { ComponentProps } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { palette } from '@/constants/palette';

type FormInputProps = ComponentProps<typeof TextInput> & {
  label: string;
};

export function FormInput({ label, style, placeholderTextColor, ...props }: FormInputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={placeholderTextColor ?? palette.muted}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    borderWidth: 1,
    color: palette.text,
    fontSize: 15,
    minHeight: 54,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  label: {
    color: palette.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  wrapper: {
    width: '100%',
  },
});
