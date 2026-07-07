import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/services/api';

export type Medico = {
    id_medico: number;
    nombres: string;
    apellidos: string;
    especialidad: string;
    duracion_consulta_minutos: number;
    precio_consulta_base: number;

};


export type Paciente = {
    id_paciente: number;
    nombres: string;
    apellidos: string;
    cedula: string;
    telefono: number;
    email: number;

};

export type Slot = {
    
    hora: string;
    hora_fin: string;
    disponible: boolean;
 

};

export type SlotsResponse = {
    
    disponible: boolean;
    slots: Slot[];

};


export type Cita = {
    id_cita: number;
    fecha_cita: string;
    hora_inicio: string;
    hora_fin: string;
    tipo_cita: string;
    motivo_cita: string;
    estado_cita: string;
    paciente: string;
    optometra: string;

};

export type NuevaCitaPayload = {
    id_medico: number;
    id_paciente: string;
    fecha_cita: string; // formato 'YYYY-MM-DD'
    hora_inicio: string; // formato 'HH:mm'
    hora_fin: string;
    tipo_cita?: string;
    motivo_cita?: string;
    

};


export function useCitas() {
    const { apiBaseUrl, token } = useAuth();
    function getMedicos() {
        return apiRequest<Medico[]>(apiBaseUrl, '/medicos', { token }); 
    }
    function getPacientes() {
        return apiRequest<Paciente[]>(apiBaseUrl, '/pacientes', { token }); 
    }
    function getSlots(idMedico: number, fecha: string) {
        return apiRequest<SlotsResponse>(apiBaseUrl, `/medicos/${idMedico}/slots/${fecha}`, { token }); 
    }
    function getCitas() {
        return apiRequest<Cita[]>(apiBaseUrl, '/citas', { token }); 
    }
    function CrearCita(payload: NuevaCitaPayload) {
        return apiRequest<{ message: string }>(apiBaseUrl, '/citas', {
            method: 'POST',
            token,
            body:payload
        }); 
    }

    return {
        getMedicos,
        getPacientes,
        getSlots,
        getCitas,
        CrearCita
    };

}





