const IP_ADDR = process.env.EXPO_PUBLIC_IP_ADDR;
export const API_BASE = `http://${IP_ADDR}:3000`;

// Helper para manejar respuestas y no repetir try/catch
export async function handleResponse(res: Response, errorMsg: string) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorMsg);
  }
  return res.json();
}