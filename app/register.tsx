import { Link, Redirect, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';

import { AuthShell } from '@/components/auth-shell';
import { FormInput } from '@/components/ui/form-input';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SectionCard } from '@/components/ui/section-card';
import { palette } from '@/constants/palette';
import { useAuth } from '@/hooks/use-auth';

export default function RegisterScreen() {
  const { register, token, busy } = useAuth();
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    usuario: '',
    password: '',
    telefono: '',
    fecha_nacimiento: '',
    avatar_url: '',
  });
  const [error, setError] = useState<string | null>(null);

  if (token) {
    return <Redirect href="/(tabs)" />;
  }

  function updateField(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleRegister() {
    setError(null);
    try {
      await register(form);
      router.replace('/(tabs)');
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'No fue posible crear la cuenta');
    }
  }

  return (
    <AuthShell
      badge="Registro"
      title="Crea una cuenta elegante y segura"
      subtitle="El sistema asigna automáticamente el rol de cliente y deja listo el perfil con avatar, seguridad y recuperación."
      footer={
        <Text style={styles.footerText}>
          ¿Ya tienes cuenta? <Link href="/login" style={styles.footerLink}>Iniciar sesión</Link>
        </Text>
      }
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <SectionCard title="Datos personales" subtitle="Información base para tu perfil">
            <FormInput label="Nombres" value={form.nombres} onChangeText={(value) => updateField('nombres', value)} />
            <FormInput label="Apellidos" value={form.apellidos} onChangeText={(value) => updateField('apellidos', value)} />
            <FormInput
              label="Fecha de nacimiento"
              placeholder="2000-12-31"
              value={form.fecha_nacimiento}
              onChangeText={(value) => updateField('fecha_nacimiento', value)}
            />
          </SectionCard>

          <SectionCard title="Acceso" subtitle="Credenciales y contacto">
            <FormInput label="Correo" value={form.email} onChangeText={(value) => updateField('email', value)} autoCapitalize="none" />
            <FormInput label="Usuario" value={form.usuario} onChangeText={(value) => updateField('usuario', value)} autoCapitalize="none" />
            <FormInput label="Teléfono" value={form.telefono} onChangeText={(value) => updateField('telefono', value)} keyboardType="phone-pad" />
            <FormInput
              label="Avatar URL"
              placeholder="https://..."
              value={form.avatar_url}
              onChangeText={(value) => updateField('avatar_url', value)}
              autoCapitalize="none"
            />
            <FormInput
              label="Contraseña"
              value={form.password}
              onChangeText={(value) => updateField('password', value)}
              secureTextEntry
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <PrimaryButton label={busy ? 'Creando cuenta...' : 'Crear cuenta'} onPress={handleRegister} disabled={busy} />
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
  footerLink: {
    color: palette.accent,
    fontWeight: '700',
  },
  footerText: {
    color: palette.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
});
