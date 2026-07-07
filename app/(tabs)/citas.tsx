import { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { MobileScreen } from '@/components/mobile-screen';
import { SectionCard } from '@/components/ui/section-card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Pill } from '@/components/ui/pill';
import { palette } from '@/constants/palette';
import { useCitas, Cita } from '@/hooks/use-citas';

export default function CitasScreen() {
    const { getCitas } = useCitas();
    const [citas, setCitas] = useState<Cita[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cargarCitas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCitas();
            setCitas(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error al cargar citas');
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            cargarCitas();
        }, [cargarCitas])
    );

    

    console.log('EJEMPLO DE CITA:', JSON.stringify(citas[0]));

    return (
        <MobileScreen>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={cargarCitas} />}
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Citas</Text>
                    <Text style={styles.headerSubtitle}>
                        Revisa las citas agendadas y crea una nueva en segundos.
                    </Text>
                </View>

                <PrimaryButton label="+ Nueva cita" onPress={() => router.push('/citas/nueva')} />

                {error ? (
                    <SectionCard title="Ups" subtitle={error}>
                        <PrimaryButton label="Reintentar" variant="secondary" onPress={cargarCitas} />
                    </SectionCard>
                ) : null}

                {loading && citas.length === 0 ? (
                    <ActivityIndicator color={palette.accent} style={{ marginTop: 24 }} />
                ) : null}

                {!loading && !error && citas.length === 0 ? (
                    <SectionCard title="Sin citas todavía" subtitle="Cuando agendes una, aparecerá aquí.">
                        <View />
                    </SectionCard>
                ) : null}

                {citas.map((item) => (
                    <SectionCard
                        key={item.id_cita}
                        title={item.paciente}
                        subtitle={`Dr(a). ${item.optometra}`}
                    >
                        <View style={styles.row}>
                            <Text style={styles.fecha}>
                                {item.fecha_cita?.slice(0, 10)} · {item.hora_inicio?.slice(11, 16)}
                            </Text>
                            <Pill label={item.estado_cita} />
                        </View>
                        {item.motivo_cita ? <Text style={styles.motivo}>{item.motivo_cita}</Text> : null}
                    </SectionCard>
                ))}
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
        gap: 6,
        paddingTop: 4,
    },
    headerTitle: {
        color: palette.text,
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: -0.6,
    },
    headerSubtitle: {
        color: palette.textMuted,
        fontSize: 14,
        lineHeight: 21,
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    fecha: {
        color: palette.textMuted,
        fontSize: 13,
    },
    motivo: {
        color: palette.text,
        fontSize: 14,
    },
});