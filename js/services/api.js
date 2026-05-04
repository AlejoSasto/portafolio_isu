/**
 * Capa de acceso a datos estáticos (JSON). Fácil de mockear o cambiar por API REST.
 * @param {string} url
 * @returns {Promise<unknown>}
 */
export async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(String(res.status));
  }
  return res.json();
}
