// src/services/api.jsx
const API_URL = "http://localhost:4000/api";

/**
 * Fetch tutte le categorie
 */
export const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_URL}/categorie`);
    if (!res.ok) throw new Error("Errore nel caricamento delle categorie");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * Fetch prodotti, opzionalmente filtrati per categoria
 * @param {number} [categoriaId] - ID della categoria
 */
export const fetchProducts = async (categoriaId) => {
  try {
    const url = categoriaId
      ? `${API_URL}/prodotti?categoriaId=${categoriaId}`
      : `${API_URL}/prodotti`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Errore nel caricamento dei prodotti");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * Crea un nuovo ordine
 * @param {Object} ordine - Dati ordine coerenti col backend
 */
export const createOrder = async (ordine) => {
  try {
    const res = await fetch(`${API_URL}/ordini`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ordine),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Errore nella creazione dell'ordine: ${errorText}`);
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};
