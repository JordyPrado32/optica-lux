# Optica Lux Mobile

Aplicacion movil en Expo para autenticacion, perfil, MFA y recuperacion de contrasena.

## Variables de entorno

1. Crea un archivo `.env` en la raiz de `optica-lux`.
2. Copia el contenido de `.env.example`.
3. Ajusta la IP de tu PC:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.15:3000/api
```

Para Expo Go en un celular fisico no uses `localhost`.

## Ejecutar con Expo Go

1. Inicia el backend.
2. Inicia esta app:

```bash
npm install
npm start
```

3. Escanea el QR desde Expo Go.
4. Si cambias el `.env`, reinicia Expo para que tome la nueva variable.

## Nota de red

- PC y celular deben estar en la misma Wi-Fi.
- Verifica en el celular que `http://TU_IP:3000/health` responda.
