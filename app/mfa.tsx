import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { AuthShell } from '@/components/auth-shell';
import { FormInput } from '@/components/ui/form-input';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SectionCard } from '@/components/ui/section-card';
import { palette } from '@/constants/palette';
import { useAuth } from '@/hooks/use-auth';

export default function MfaScreen() {
  const { verifyMfa, pendingMfaToken, token, busy } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (token) {
    return <Redirect href="/(tabs)" />;
  }

  if (!pendingMfaToken) {
    return <Redirect href="/login" />;
  }

  async function handleVerify() {
    setError(null);
    try {
      const result = await verifyMfa(code);
      router.replace(result === 'must-change-password' ? '/(tabs)/profile' : '/(tabs)');
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'No fue posible validar el código');
    }
  }

  return (
    <AuthShell
      badge="MFA"
      title="Verificación en dos pasos"
      subtitle="Ingresa el código de 6 dígitos generado por tu aplicación autenticadora."
    >
      <SectionCard title="Confirma tu identidad" subtitle="Seguridad adicional para tu cuenta">
        <FormInput
          label="Código TOTP"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <PrimaryButton label={busy ? 'Validando...' : 'Validar código'} onPress={handleVerify} disabled={busy} />
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
});
