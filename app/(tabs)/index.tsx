import { Redirect, router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { MobileScreen } from '@/components/mobile-screen';
import { Pill } from '@/components/ui/pill';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SectionCard } from '@/components/ui/section-card';
import { palette } from '@/constants/palette';
import { useAuth } from '@/hooks/use-auth';

export default function HomeScreen() {
  const { token, user } = useAuth();

  if (!token || !user) {
    return <Redirect href="/login" />;
  }

  return (
    <MobileScreen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Pill label="Panel principal" />
            <Text style={styles.heroTitle}>Experiencia clínica móvil, clara y segura</Text>
            <Text style={styles.heroSubtitle}>
              Gestiona tu acceso, seguridad y perfil desde una interfaz optimizada para pantallas pequeñas y uso continuo.
            </Text>
          </View>
          <View style={styles.heroBadge}>
            <Ionicons name="shield-checkmark" size={28} color={palette.accent} />
          </View>
        </View>

        <SectionCard title="Tu cuenta" subtitle="Estado actual de seguridad">
          <View style={styles.metricRow}>
            <Metric label="Rol" value={`#${user.id_rol}`} />
            <Metric label="MFA" value={user.security.two_factor_enabled ? 'Activo' : 'Pendiente'} />
          </View>
          <View style={styles.metricRow}>
            <Metric label="Estado" value={user.activo ? 'Activa' : 'Inactiva'} />
            <Metric label="Clave" value={user.security.must_change_password ? 'Cambiar' : 'Vigente'} />
          </View>
          <PrimaryButton label="Abrir mi perfil" onPress={() => router.push('/profile')} />
        </SectionCard>

        <SectionCard title="Resumen rápido" subtitle="Información útil para el usuario final">
          <View style={styles.summaryItem}>
            <Ionicons name="mail-open-outline" size={18} color={palette.accentSoft} />
            <Text style={styles.summaryText}>{user.email ?? 'Sin correo registrado'}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="person-outline" size={18} color={palette.accentSoft} />
            <Text style={styles.summaryText}>{user.usuario}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="calendar-outline" size={18} color={palette.accentSoft} />
            <Text style={styles.summaryText}>
              Último cambio de contraseña: {user.ultimo_cambio_password ? new Date(user.ultimo_cambio_password).toLocaleDateString() : 'Sin dato'}
            </Text>
          </View>
        </SectionCard>
      </ScrollView>
    </MobileScreen>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
    paddingBottom: 120,
  },
  hero: {
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 28,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 18,
    justifyContent: 'space-between',
    overflow: 'hidden',
    padding: 22,
  },
  heroBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(196, 175, 140, 0.12)',
    borderRadius: 22,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  heroCopy: {
    flex: 1,
    gap: 12,
  },
  heroSubtitle: {
    color: palette.textMuted,
    fontSize: 15,
    lineHeight: 23,
  },
  heroTitle: {
    color: palette.text,
    fontSize: 31,
    fontWeight: '800',
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  metricCard: {
    backgroundColor: palette.surfaceMuted,
    borderRadius: 20,
    flex: 1,
    gap: 4,
    padding: 16,
  },
  metricLabel: {
    color: palette.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricValue: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '800',
  },
  summaryItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  summaryText: {
    color: palette.text,
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
  },
});
