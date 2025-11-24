export const handler = async (event, context) => {
  const params = event.queryStringParameters;
  const action = params?.action || "";

  const conn = await mysql.createConnection({
    host: "sql107.ezyro.com",
    user: "ezyro_39974526",
    password: "0d398958b",
    database: "ezyro_39974526_usuarios"
  });

  if (action === "usuarios") {
    const [rows] = await conn.execute("SELECT COUNT(*) AS total FROM usuarios");
    await conn.end();
    return json({ total: rows[0].total });
  }

  if (action === "areas") {
    const [rows] = await conn.execute(`
      SELECT area_interes AS area, COUNT(*) AS total 
      FROM usuarios GROUP BY area_interes
    `);
    await conn.end();
    return json({ areas: rows });
  }

  if (action === "ofertas") {
    const [rows] = await conn.execute("SELECT COUNT(*) AS total FROM ofertas");
    await conn.end();
    return json({ total: rows[0].total });
  }

  return json({ error: "Acción no válida" });
};

function json(obj) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj)
  };
}
