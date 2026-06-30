import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AuthShell } from '@/components/auth-shell';
import { FormInput } from '@/components/ui/form-input';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SectionCard } from '@/components/ui/section-card';
import { palette } from '@/constants/palette';
import { useAuth } from '@/hooks/use-auth';

export default function ForgotPasswordScreen() {
  const { forgotPassword, busy } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setMessage(null);
    setError(null);

    try {
      await forgotPassword(email);
      setMessage('Si el correo existe, enviamos una clave temporal para iniciar sesion y cambiarla de inmediato.');
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'No fue posible procesar tu solicitud');
    }
  }

  return (
    <AuthShell
      badge="Recuperacion"
      title="Restablece el acceso sin friccion"
      subtitle="Ingresa tu correo para recibir una clave temporal de acceso."
      footer={
        <Text style={styles.footerText}>
          <Link href="/login" style={styles.footerLink}>Volver al inicio de sesion</Link>
        </Text>
      }
    >
      <SectionCard title="Correo de recuperacion" subtitle="Te enviaremos una clave temporal">
        <FormInput label="Correo" value={email} onChangeText={setEmail} autoCapitalize="none" />
        {message ? <Text style={styles.successText}>{message}</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <PrimaryButton label={busy ? 'Enviando...' : 'Enviar clave temporal'} onPress={handleSubmit} disabled={busy} />
        <View style={styles.inlineCard}>
          <Text style={styles.inlineCardText}>
            Si estas probando localmente, revisa la consola del backend cuando SMTP no este configurado.
          </Text>
        </View>
      </SectionCard>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: palette.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  footerLink: {
    color: palette.accent,
    fontWeight: '700',
  },
  footerText: {
    color: palette.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  inlineCard: {
    backgroundColor: palette.surfaceMuted,
    borderRadius: 16,
    padding: 14,
  },
  inlineCardText: {
    color: palette.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  successText: {
    color: palette.success,
    fontSize: 14,
    fontWeight: '600',
  },
});
