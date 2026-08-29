export const MASTER_ADMIN_PIN =
  process.env.NEXT_PUBLIC_ADMIN_PIN || "7777";

const AUTH_STORAGE_KEY = "artbythread_admin_session_token";

export function checkAdminPin(enteredPin: string): boolean {
  return enteredPin.trim() === MASTER_ADMIN_PIN;
}

export function saveAdminSession(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, "authenticated_" + Date.now());
    document.cookie = `${AUTH_STORAGE_KEY}=true; path=/; max-age=604800; SameSite=Lax`;
  }
}

export function clearAdminSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    document.cookie = `${AUTH_STORAGE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem(AUTH_STORAGE_KEY);
  return Boolean(token && token.startsWith("authenticated_"));
}
