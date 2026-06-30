export type SecuritySummary = {
  two_factor_enabled: boolean;
  must_change_password: boolean;
  last_login_at: string | null;
  password_changed_at: string | null;
  password_expires_at: string | null;
};

export type UserProfile = {
  id_usuario: number;
  id_rol: number;
  nombres: string;
  apellidos: string;
  email: string | null;
  usuario: string;
  telefono: string | null;
  activo: boolean | null;
  intentos_fallidos: number | null;
  bloqueado: boolean | null;
  ultimo_cambio_password: string | null;
  fecha_creacion: string | null;
  fecha_nacimiento: string | null;
  avatar_url: string | null;
  security: SecuritySummary;
};

export type LoginResponse =
  | {
      requiresMfa: true;
      mfaToken: string;
    }
  | {
      requiresMfa: false;
      token: string;
      user: UserProfile;
    };
