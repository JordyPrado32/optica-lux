import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/palette';

export function Pill({ label }: { label: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: palette.accentSoft,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  pill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(199, 165, 106, 0.14)',
    borderColor: 'rgba(199, 165, 106, 0.3)',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
});
