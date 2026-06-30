import { Link, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { AuthShell } from '@/components/auth-shell';
import { FormInput } from '@/components/ui/form-input';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SectionCard } from '@/components/ui/section-card';
import { palette } from '@/constants/palette';
import { useAuth } from '@/hooks/use-auth';

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ token?: string }>();
  const { resetPassword, busy } = useAuth();
  const [token, setToken] = useState(params.token ?? '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setMessage(null);
    setError(null);

    try {
      await resetPassword(token, password);
      setMessage('Tu contraseña fue actualizada. Ya puedes iniciar sesión.');
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'No fue posible cambiar la contraseña');
    }
  }

  return (
    <AuthShell
      badge="Nueva contraseña"
      title="Define una contraseña fuerte y vuelve a entrar"
      subtitle="Puedes abrir esta pantalla desde el enlace recibido por correo o pegar aquí el token manualmente."
      footer={
        <Text style={styles.footerText}>
          <Link href="/login" style={styles.footerLink}>Ir a iniciar sesión</Link>
        </Text>
      }
    >
      <SectionCard title="Cambio de contraseña" subtitle="Finaliza la recuperación">
        <FormInput label="Token" value={token} onChangeText={setToken} autoCapitalize="none" />
        <FormInput
          label="Nueva contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {message ? <Text style={styles.successText}>{message}</Text> : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <PrimaryButton label={busy ? 'Actualizando...' : 'Actualizar contraseña'} onPress={handleSubmit} disabled={busy} />
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
  successText: {
    color: palette.success,
    fontSize: 14,
    fontWeight: '600',
  },
});
