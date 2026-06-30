import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AmbientBackground } from '@/components/ui/ambient-background';
import { palette } from '@/constants/palette';

export function FullScreenLoader({ label }: { label: string }) {
  return (
    <AmbientBackground>
      <View style={styles.container}>
        <ActivityIndicator size="large" color={palette.accent} />
        <Text style={styles.label}>{label}</Text>
      </View>
    </AmbientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 14,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  label: {
    color: palette.textMuted,
    fontSize: 14,
  },
});
