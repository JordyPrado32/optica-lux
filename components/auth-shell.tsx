import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { AmbientBackground } from '@/components/ui/ambient-background';
import { palette } from '@/constants/palette';

type AuthShellProps = {
  badge: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({ badge, title, subtitle, children, footer }: AuthShellProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 780;

  return (
    <AmbientBackground>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={[styles.frame, isWide && styles.frameWide]}>
          <View style={[styles.brandPanel, isWide && styles.brandPanelWide]}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Seguridad integrada</Text>
              <Text style={styles.infoText}>Login, bloqueo por intentos, MFA, recuperación y perfil en un flujo móvil limpio.</Text>
            </View>
          </View>

          <View style={[styles.formPanel, isWide && styles.formPanelWide]}>
            {children}
            {footer}
          </View>
        </View>
      </ScrollView>
    </AmbientBackground>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(199, 165, 106, 0.16)',
    borderColor: 'rgba(199, 165, 106, 0.4)',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  badgeText: {
    color: palette.accentSoft,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  brandPanel: {
    gap: 18,
  },
  brandPanelWide: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 420,
    paddingRight: 20,
  },
  formPanel: {
    gap: 16,
  },
  formPanelWide: {
    flex: 1,
    maxWidth: 540,
  },
  frame: {
    alignSelf: 'center',
    gap: 26,
    maxWidth: 1120,
    paddingHorizontal: 22,
    paddingVertical: 34,
    width: '100%',
  },
  frameWide: {
    alignItems: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  infoBlock: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 28,
    borderWidth: 1,
    gap: 8,
    padding: 20,
  },
  infoLabel: {
    color: palette.accentSoft,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  infoText: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  subtitle: {
    color: palette.textMuted,
    fontSize: 16,
    lineHeight: 26,
    maxWidth: 540,
  },
  title: {
    color: palette.text,
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1.1,
    lineHeight: 46,
  },
});
