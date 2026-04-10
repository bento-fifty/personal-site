/**
 * Thin fetch wrapper. All app-level API calls should go through here.
 *
 * The indirection exists so the future Vercel → Cloudflare Workers split
 * for high-traffic endpoints (see docs/ARCHITECTURE.md) changes exactly
 * one thing: the NEXT_PUBLIC_API_BASE env var. Call sites stay identical.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '/api';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  method: 'GET' | 'POST',
  path: string,
  body?: unknown,
  init?: RequestInit,
): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;

  const res = await fetch(url, {
    method,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(init?.headers ?? {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...init,
  });

  if (!res.ok) {
    let parsed: unknown;
    try {
      parsed = await res.json();
    } catch {
      parsed = await res.text().catch(() => undefined);
    }
    throw new ApiError(res.status, `${method} ${path} failed (${res.status})`, parsed);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const apiGet  = <T>(path: string, init?: RequestInit) =>
  request<T>('GET', path, undefined, init);

export const apiPost = <T>(path: string, body?: unknown, init?: RequestInit) =>
  request<T>('POST', path, body, init);
