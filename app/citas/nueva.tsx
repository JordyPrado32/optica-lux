import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { router } from 'expo-router';

import { MobileScreen } from '@/components/mobile-screen';
import { SectionCard } from '@/components/ui/section-card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { FormInput } from '@/components/ui/form-input';
import { palette } from '@/constants/palette';
import { useCitas, Medico, Paciente, Slot } from '@/hooks/use-citas';

function generarProximosDias(cantidad: number) {
    const dias = [];
    const nombresDia = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    for (let i = 0; i < cantidad; i++) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + i);
        const valor = fecha.toISOString().slice(0, 10); // YYYY-MM-DD
        const etiqueta = i === 0 ? 'Hoy' : `${nombresDia[fecha.getDay()]} ${fecha.getDate()}`;
        dias.push({ valor, etiqueta });
    }
    return dias;
}

// Tarjeta seleccionable genérica (paciente / médico)
function ChipCard({
    title,
    subtitle,
    selected,
    onPress,
}: {
    title: string;
    subtitle?: string;
    selected: boolean;
    onPress: () => void;
}) {
    return (
        <Pressable
            onPress={onPress}
            style={[styles.chipCard, selected && styles.chipCardSelected]}
        >
            <Text style={[styles.chipTitle, selected && styles.chipTitleSelected]}>{title}</Text>
            {subtitle ? (
                <Text style={[styles.chipSubtitle, selected && styles.chipSubtitleSelected]}>
                    {subtitle}
                </Text>
            ) : null}
        </Pressable>
    );
}

// Píldora seleccionable (fecha / horario)
function PillOption({
    label,
    selected,
    disabled,
    onPress,
}: {
    label: string;
    selected: boolean;
    disabled?: boolean;
    onPress: () => void;
}) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={[
                styles.pillOption,
                selected && styles.pillOptionSelected,
                disabled && styles.pillOptionDisabled,
            ]}
        >
            <Text
                style={[
                    styles.pillOptionLabel,
                    selected && styles.pillOptionLabelSelected,
                    disabled && styles.pillOptionLabelDisabled,
                ]}
            >
                {label}
            </Text>
        </Pressable>
    );
}

export default function NuevaCitaScreen() {
    const { getPacientes, getMedicos, getSlots, CrearCita } = useCitas();

    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [medicos, setMedicos] = useState<Medico[]>([]);
    const [slots, setSlots] = useState<Slot[]>([]);

    const [loadingBase, setLoadingBase] = useState(true);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [pacienteId, setPacienteId] = useState<number | null>(null);
    const [medicoId, setMedicoId] = useState<number | null>(null);
    const [fecha, setFecha] = useState<string | null>(null);
    const [slotElegido, setSlotElegido] = useState<Slot | null>(null);
    const [motivo, setMotivo] = useState('');

    const dias = useMemo(() => generarProximosDias(14), []);

    // Cargar pacientes y médicos al entrar
    useEffect(() => {
        (async () => {
            setLoadingBase(true);
            setError(null);
            try {
                const [pac, med] = await Promise.all([getPacientes(), getMedicos()]);
                setPacientes(pac);
                setMedicos(med);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'No se pudo cargar la información');
            } finally {
                setLoadingBase(false);
            }
        })();
    }, []);

    // Cargar horarios disponibles cuando hay médico + fecha
    useEffect(() => {
        setSlotElegido(null);
        setSlots([]);
        if (!medicoId || !fecha) return;

        (async () => {
            setLoadingSlots(true);
            try {
                console.log('PIDIENDO SLOTS PARA:', 'medico=', medicoId, 'fecha=', fecha);
                const res = await getSlots(medicoId, fecha);
                console.log('RESPUESTA DE getSlots:', JSON.stringify(res));
                setSlots(res.slots);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'No se pudieron cargar los horarios');
            } finally {
                setLoadingSlots(false);
            }
        })();
    }, [medicoId, fecha]);

    const puedeConfirmar = pacienteId && medicoId && fecha && slotElegido && !enviando;

    async function handleConfirmar() {
        if (!pacienteId || !medicoId || !fecha || !slotElegido) return;

        setEnviando(true);
        setError(null);
        try {
            await CrearCita({
                id_medico: medicoId,
                id_paciente: String(pacienteId),
                fecha_cita: fecha,
                hora_inicio: slotElegido.hora,
                hora_fin: slotElegido.hora_fin,
                motivo_cita: motivo.trim() || undefined,
            });
            Alert.alert('Listo', 'La cita se agendó correctamente.', [
                { text: 'OK', onPress: () => router.back() },
            ]);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'No se pudo agendar la cita');
        } finally {
            setEnviando(false);
        }
    }

    if (loadingBase) {
        return (
            <MobileScreen>
                <View style={styles.centered}>
                    <ActivityIndicator color={palette.accent} />
                </View>
            </MobileScreen>
        );
    }

    return (
        <MobileScreen>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Nueva cita</Text>
                    <Text style={styles.headerSubtitle}>
                        Elige paciente, médico, fecha y horario disponible.
                    </Text>
                </View>

                {error ? (
                    <SectionCard title="Ups" subtitle={error}>
                        <View />
                    </SectionCard>
                ) : null}

                <SectionCard title="Paciente" subtitle="¿Para quién es la cita?">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                        {pacientes.map((p) => (
                            <ChipCard
                                key={p.id_paciente}
                                title={`${p.nombres} ${p.apellidos}`}
                                subtitle={p.cedula}
                                selected={pacienteId === p.id_paciente}
                                onPress={() => setPacienteId(p.id_paciente)}
                            />
                        ))}
                    </ScrollView>
                </SectionCard>

                <SectionCard title="Médico" subtitle="¿Quién atiende la consulta?">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                        {medicos.map((m) => (
                            <ChipCard
                                key={m.id_medico}
                                title={`${m.nombres} ${m.apellidos}`}
                                subtitle={m.especialidad}
                                selected={medicoId === m.id_medico}
                                onPress={() => setMedicoId(m.id_medico)}
                            />
                        ))}
                    </ScrollView>
                </SectionCard>

                <SectionCard title="Fecha" subtitle="Próximos 14 días">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
                        {dias.map((d) => (
                            <PillOption
                                key={d.valor}
                                label={d.etiqueta}
                                selected={fecha === d.valor}
                                onPress={() => setFecha(d.valor)}
                            />
                        ))}
                    </ScrollView>
                </SectionCard>

                {medicoId && fecha ? (
                    <SectionCard title="Horario" subtitle="Solo se muestran horarios disponibles">
                        {loadingSlots ? (
                            <ActivityIndicator color={palette.accent} />
                        ) : slots.length === 0 ? (
                            <Text style={styles.emptyText}>No hay horarios para ese día, elige otra fecha.</Text>
                        ) : (
                            <View style={styles.pillWrap}>
                                {slots.map((s) => (
                                    <PillOption
                                        key={s.hora}
                                        label={s.hora}
                                        selected={slotElegido?.hora === s.hora}
                                        disabled={!s.disponible}
                                        onPress={() => setSlotElegido(s)}
                                    />
                                ))}
                            </View>
                        )}
                    </SectionCard>
                ) : null}

                <SectionCard title="Motivo" subtitle="Opcional">
                    <FormInput
                        label="Motivo de la cita"
                        placeholder="Ej. Revisión anual"
                        value={motivo}
                        onChangeText={setMotivo}
                    />
                </SectionCard>

                <PrimaryButton
                    label={enviando ? 'Agendando...' : 'Confirmar cita'}
                    onPress={handleConfirmar}
                    disabled={!puedeConfirmar}
                />
                <PrimaryButton label="Cancelar" variant="ghost" onPress={() => router.back()} />
            </ScrollView>
        </MobileScreen>
    );
}

const styles = StyleSheet.create({
    centered: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    content: {
        gap: 18,
        paddingBottom: 60,
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
    chipRow: {
        gap: 12,
        paddingVertical: 4,
    },
    chipCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: 18,
        borderWidth: 1,
        minWidth: 140,
        padding: 14,
    },
    chipCardSelected: {
        backgroundColor: 'rgba(199, 165, 106, 0.14)',
        borderColor: palette.accent,
    },
    chipTitle: {
        color: palette.text,
        fontSize: 14,
        fontWeight: '700',
    },
    chipTitleSelected: {
        color: palette.accent,
    },
    chipSubtitle: {
        color: palette.textMuted,
        fontSize: 12,
        marginTop: 4,
    },
    chipSubtitleSelected: {
        color: palette.accentSoft,
    },
    pillRow: {
        gap: 10,
        paddingVertical: 4,
    },
    pillWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    pillOption: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: 999,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    pillOptionSelected: {
        backgroundColor: palette.accent,
        borderColor: palette.accent,
    },
    pillOptionDisabled: {
        opacity: 0.3,
    },
    pillOptionLabel: {
        color: palette.text,
        fontSize: 13,
        fontWeight: '700',
    },
    pillOptionLabelSelected: {
        color: '#14202E',
    },
    pillOptionLabelDisabled: {
        color: palette.textMuted,
    },
    emptyText: {
        color: palette.textMuted,
        fontSize: 13,
    },
});