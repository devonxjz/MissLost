/**
 * API helper — wraps fetch() with JWT auth and base URL.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/**
 * Generic JSON fetch with automatic Bearer token injection.
 * Redirects to login on 401.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (res.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    window.location.href = "/auth/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `HTTP ${res.status}`);
  }

  return res.json();
}

/**
 * Upload file via FormData (không set Content-Type — browser tự thêm boundary).
 */
export async function uploadFile(
  path: string,
  file: File,
): Promise<{ url: string }> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });

  if (res.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    window.location.href = "/auth/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Upload failed: HTTP ${res.status}`);
  }

  const data = await res.json();
  const url = data?.data?.url ?? data?.url;
  if (!url) throw new Error('Upload response không có URL');
  return { url };
}
