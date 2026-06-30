import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/palette';

type SectionCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function SectionCard({ title, subtitle, children }: SectionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: 14,
  },
  card: {
    backgroundColor: palette.surface,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 28,
    borderWidth: 1,
    gap: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 28,
  },
  header: {
    gap: 6,
  },
  subtitle: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  title: {
    color: palette.text,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
});
