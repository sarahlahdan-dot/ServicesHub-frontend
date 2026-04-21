const TOKEN_KEY = 'token';

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4;
  const padded = padding ? normalized.padEnd(normalized.length + (4 - padding), '=') : normalized;

  return atob(padded);
}

export function decodeToken(token) {
  try {
    const [, payloadSegment] = token.split('.');
    if (!payloadSegment) {
      return null;
    }

    const parsedPayload = JSON.parse(decodeBase64Url(payloadSegment));
    return parsedPayload?.payload ?? null;
  } catch {
    return null;
  }
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  const token = getStoredToken();
  return token ? decodeToken(token) : null;
}

export function storeAuthToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
  return decodeToken(token);
}

export function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY);
}