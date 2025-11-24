// netlify/functions/webhook.js

import mysql from "mysql2/promise";  // ← ESTO ES LO QUE TE FALTABA
import fetch from "node-fetch";

// Helper para enviar JSON
function json(obj) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  };
}

export const handler = async (event, context) => {
  try {
    const params = event.queryStringParameters || {};
    const action = params.action || "";

    // ============================
    // 1. Conexión MySQL
    // ============================
    const conn = await mysql.createConnection({
      host: "sql107.ezyro.com",
      user: "ezyro_39974526",
      password: "0d398958b",
      database: "ezyro_39974526_usuarios",
    });

    // ------ A) Total usuarios ------
    if (action === "usuarios") {
      const [rows] = await conn.execute(
        "SELECT COUNT(*) AS total FROM usuarios"
      );
      await conn.end();
      return json({ total: rows[0].total });
    }

    // ------ B) Usuarios por área ------
    if (action === "areas") {
      const [rows] = await conn.execute(`
        SELECT area_interes AS area, COUNT(*) AS total
        FROM usuarios
        GROUP BY area_interes
      `);
      await conn.end();
      return json({ areas: rows });
    }

    // ------ C) Total ofertas ------
    if (action === "ofertas") {
      const [rows] = await conn.execute(
        "SELECT COUNT(*) AS total FROM ofertas"
      );
      await conn.end();
      return json({ total: rows[0].total });
    }

    // Acción inválida
    await conn.end();
    return json({ error: "Acción no válida" });

  } catch (err) {
    console.error("ERROR:", err);
    return json({ error: err.message });
  }
};
