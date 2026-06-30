import Constants from 'expo-constants';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH';
  body?: unknown;
  token?: string | null;
};

const API_PORT = '3000';
const API_PATH = '/api';
const REQUEST_TIMEOUT_MS = 12000;

export function normalizeApiUrl(value: string) {
  return value.trim().replace(/\/+$/, '');
}

function isLocalOnlyHost(value: string) {
  return /:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(?::|\/|$)/i.test(value);
}

function extractExpoHost() {
  const candidates = [
    Constants.expoConfig?.hostUri,
    Constants.linkingUri,
    Constants.experienceUrl,
  ].filter((value): value is string => Boolean(value));

  for (const candidate of candidates) {
    const match = candidate.match(/^(?:\w+:\/\/)?([^/:]+)/i);
    const host = match?.[1];

    if (host && !['localhost', '127.0.0.1', '0.0.0.0'].includes(host)) {
      return host;
    }
  }

  return null;
}

export function resolveApiUrl(configuredUrl?: string) {
  const normalizedConfiguredUrl = normalizeApiUrl(configuredUrl ?? '');
  const expoHost = extractExpoHost();

  if (normalizedConfiguredUrl && !isLocalOnlyHost(normalizedConfiguredUrl)) {
    return normalizedConfiguredUrl;
  }

  if (expoHost) {
    return `http://${expoHost}:${API_PORT}${API_PATH}`;
  }

  if (normalizedConfiguredUrl) {
    return normalizedConfiguredUrl;
  }

  return `http://localhost:${API_PORT}${API_PATH}`;
}

export async function apiRequest<T>(baseUrl: string, path: string, options: RequestOptions = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${normalizeApiUrl(baseUrl)}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message ?? 'No fue posible completar la solicitud');
    }

    return data as T;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(
        'La solicitud tardó demasiado. Revisa que la URL API sea correcta y que el backend esté accesible desde este dispositivo.'
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
