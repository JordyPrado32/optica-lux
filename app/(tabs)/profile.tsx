import { Redirect } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AvatarBadge } from '@/components/ui/avatar-badge';
import { FormInput } from '@/components/ui/form-input';
import { MobileScreen } from '@/components/mobile-screen';
import { Pill } from '@/components/ui/pill';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SectionCard } from '@/components/ui/section-card';
import { palette } from '@/constants/palette';
import { useAuth } from '@/hooks/use-auth';

export default function ProfileScreen() {
  const {
    token,
    user,
    busy,
    updateProfile,
    changePassword,
    setupMfa,
    enableMfa,
    disableMfa,
    logout,
  } = useAuth();
  const [profileForm, setProfileForm] = useState({
    nombres: user?.nombres ?? '',
    apellidos: user?.apellidos ?? '',
    telefono: user?.telefono ?? '',
    fecha_nacimiento: user?.fecha_nacimiento ? String(user.fecha_nacimiento).slice(0, 10) : '',
    avatar_url: user?.avatar_url ?? '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [mfaCode, setMfaCode] = useState('');
  const [mfaSecret, setMfaSecret] = useState<string | null>(null);

  if (!token || !user) {
    return <Redirect href="/login" />;
  }

  async function handleSaveProfile() {
    try {
      await updateProfile(profileForm);
      Alert.alert('Perfil actualizado', 'Tus datos fueron guardados correctamente.');
    } catch (error) {
      Alert.alert('No se pudo guardar', error instanceof Error ? error.message : 'Inténtalo de nuevo');
    }
  }

  async function handleChangePassword() {
    try {
      await changePassword(passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      Alert.alert('Contraseña actualizada', 'Tu contraseña se cambió correctamente.');
    } catch (error) {
      Alert.alert('No se pudo actualizar', error instanceof Error ? error.message : 'Inténtalo de nuevo');
    }
  }

  async function handleGenerateMfa() {
    try {
      const result = await setupMfa();
      setMfaSecret(result.secret);
      Alert.alert('Secreto MFA generado', 'Configura tu app autenticadora con el secreto mostrado.');
    } catch (error) {
      Alert.alert('No se pudo generar', error instanceof Error ? error.message : 'Inténtalo de nuevo');
    }
  }

  async function handleEnableMfa() {
    try {
      await enableMfa(mfaCode);
      setMfaCode('');
      Alert.alert('MFA activado', 'La verificación en dos pasos quedó activa.');
    } catch (error) {
      Alert.alert('No se pudo activar', error instanceof Error ? error.message : 'Inténtalo de nuevo');
    }
  }

  async function handleDisableMfa() {
    try {
      await disableMfa(mfaCode);
      setMfaCode('');
      setMfaSecret(null);
      Alert.alert('MFA desactivado', 'La verificación en dos pasos fue removida.');
    } catch (error) {
      Alert.alert('No se pudo desactivar', error instanceof Error ? error.message : 'Inténtalo de nuevo');
    }
  }

  return (
    <MobileScreen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <AvatarBadge name={`${user.nombres} ${user.apellidos}`} avatarUrl={profileForm.avatar_url || user.avatar_url || undefined} />
          <View style={styles.headerCopy}>
            <Pill label={user.security.two_factor_enabled ? 'MFA activo' : 'MFA pendiente'} />
            <Text style={styles.headerTitle}>Mi perfil</Text>
            <Text style={styles.headerSubtitle}>Edita tu identidad, tu seguridad y el acceso de tu cuenta desde un solo lugar.</Text>
          </View>
        </View>

        <SectionCard title="Información personal" subtitle="Datos visibles y avatar">
          <FormInput label="Nombres" value={profileForm.nombres} onChangeText={(value) => setProfileForm((current) => ({ ...current, nombres: value }))} />
          <FormInput label="Apellidos" value={profileForm.apellidos} onChangeText={(value) => setProfileForm((current) => ({ ...current, apellidos: value }))} />
          <FormInput label="Teléfono" value={profileForm.telefono} onChangeText={(value) => setProfileForm((current) => ({ ...current, telefono: value }))} />
          <FormInput label="Fecha de nacimiento" value={profileForm.fecha_nacimiento} onChangeText={(value) => setProfileForm((current) => ({ ...current, fecha_nacimiento: value }))} placeholder="2000-12-31" />
          <FormInput label="Avatar URL" value={profileForm.avatar_url} onChangeText={(value) => setProfileForm((current) => ({ ...current, avatar_url: value }))} autoCapitalize="none" />
          <PrimaryButton label={busy ? 'Guardando...' : 'Guardar perfil'} onPress={handleSaveProfile} disabled={busy} />
        </SectionCard>

        <SectionCard title="Cambio de contraseña" subtitle="Mantén tu acceso protegido">
          <FormInput label="Contraseña actual" value={passwordForm.currentPassword} onChangeText={(value) => setPasswordForm((current) => ({ ...current, currentPassword: value }))} secureTextEntry />
          <FormInput label="Nueva contraseña" value={passwordForm.newPassword} onChangeText={(value) => setPasswordForm((current) => ({ ...current, newPassword: value }))} secureTextEntry />
          <FormInput label="Confirmar nueva contraseña" value={passwordForm.confirmPassword} onChangeText={(value) => setPasswordForm((current) => ({ ...current, confirmPassword: value }))} secureTextEntry />
          <PrimaryButton label={busy ? 'Actualizando...' : 'Actualizar contraseña'} onPress={handleChangePassword} disabled={busy} />
        </SectionCard>

        <SectionCard title="Autenticación multifactor" subtitle="Google Authenticator, Authy o Microsoft Authenticator">
          {mfaSecret ? (
            <View style={styles.secretBox}>
              <Text style={styles.secretLabel}>Secreto actual</Text>
              <Text style={styles.secretValue}>{mfaSecret}</Text>
            </View>
          ) : null}
          <FormInput label="Código de 6 dígitos" value={mfaCode} onChangeText={setMfaCode} keyboardType="number-pad" maxLength={6} />
          <PrimaryButton label="Generar secreto MFA" variant="secondary" onPress={handleGenerateMfa} disabled={busy} />
          <PrimaryButton label="Activar MFA" onPress={handleEnableMfa} disabled={busy} />
          <PrimaryButton label="Desactivar MFA" variant="ghost" onPress={handleDisableMfa} disabled={busy} />
        </SectionCard>

        <SectionCard title="Sesión" subtitle="Salir de la aplicación">
          <PrimaryButton label="Cerrar sesión" variant="ghost" onPress={logout} />
        </SectionCard>
      </ScrollView>
    </MobileScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 28,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 16,
    padding: 20,
  },
  headerCopy: {
    flex: 1,
    gap: 10,
  },
  headerSubtitle: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  headerTitle: {
    color: palette.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  secretBox: {
    backgroundColor: palette.surfaceMuted,
    borderRadius: 18,
    gap: 6,
    padding: 16,
  },
  secretLabel: {
    color: palette.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  secretValue: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '800',
  },
});
