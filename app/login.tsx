import { Link, Redirect, router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AuthShell } from '@/components/auth-shell';
import { FormInput } from '@/components/ui/form-input';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SectionCard } from '@/components/ui/section-card';
import { palette } from '@/constants/palette';
import { useAuth } from '@/hooks/use-auth';

export default function LoginScreen() {
  const { login, token, apiBaseUrl, setApiBaseUrl, busy } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [serverUrl, setServerUrl] = useState(apiBaseUrl);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setServerUrl(apiBaseUrl);
  }, [apiBaseUrl]);

  if (token) {
    return <Redirect href="/(tabs)" />;
  }

  async function handleLogin() {
    setError(null);
    try {
      const result = await login(identifier, password);
      if (result === 'mfa') {
        router.push('/mfa');
      } else if (result === 'must-change-password') {
        router.replace('/(tabs)/profile');
      } else {
        router.replace('/(tabs)');
      }
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'No fue posible iniciar sesión');
    }
  }

  return (
    <AuthShell
      badge="Optica Lux"
      title="Acceso seguro para una atención más ágil"
      subtitle="Inicia sesión, conecta tu servidor y gestiona pacientes con una experiencia clara en cualquier pantalla."
      footer={
        <Text style={styles.footerText}>
          ¿No tienes cuenta? <Link href="/register" style={styles.footerLink}>Crear cuenta</Link>
        </Text>
      }
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <SectionCard title="Bienvenido" subtitle="Ingresa con correo o usuario">
            <FormInput
              label="Correo o usuario"
              placeholder="correo@dominio.com"
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
            />
            <FormInput
              label="Contraseña"
              placeholder="Tu contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <PrimaryButton label={busy ? 'Ingresando...' : 'Ingresar'} onPress={handleLogin} disabled={busy} />
            <View style={styles.linksRow}>
              <Link href="/forgot-password" style={styles.inlineLink}>
                Recuperar contraseña
              </Link>
              <Pressable onPress={() => router.push('/register')}>
                <Text style={styles.inlineLink}>Registrarme</Text>
              </Pressable>
            </View>
          </SectionCard>

          <SectionCard
            title="Conexión del backend"
            subtitle="Usa tu IP local si abres la app en un celular físico"
          >
            <FormInput
              label="URL API"
              placeholder="http://192.168.1.10:3000/api"
              value={serverUrl}
              onChangeText={setServerUrl}
              autoCapitalize="none"
            />
            <PrimaryButton
              label="Aplicar servidor"
              variant="secondary"
              onPress={() => {
                setApiBaseUrl(serverUrl);
                setError(null);
              }}
            />
            <Text style={styles.activeUrlText}>Servidor activo: {apiBaseUrl}</Text>
            <Text style={styles.helperText}>
              En emulador puede servir `http://localhost:3000/api`. En un teléfono real necesitas la IP de tu PC.
            </Text>
          </SectionCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
    paddingBottom: 28,
  },
  errorText: {
    color: palette.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  footerText: {
    color: palette.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  footerLink: {
    color: palette.accent,
    fontWeight: '700',
  },
  helperText: {
    color: palette.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  activeUrlText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: '600',
  },
  inlineLink: {
    color: palette.accent,
    fontSize: 14,
    fontWeight: '700',
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
});
