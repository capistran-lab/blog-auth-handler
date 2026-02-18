const { Client } = require("pg");

exports.handler = async (event) => {
  // Log para ver el evento en CloudWatch
  console.log("Cognito Trigger Event:", JSON.stringify(event, null, 2));

  const { sub, email } = event.request.userAttributes;

  if (!email || !sub) {
    console.error("Missing required user attributes: email or sub");
    return event;
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const query = `
        INSERT INTO users (id, email, created_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
    `;

    await client.query(query, [sub, email]);
    console.log(`Sync completed for user: ${email}`);
  } catch (error) {
    console.error("Database Sync failed:", error);
    // No lanzamos error para no bloquear el login del usuario en Cognito
  } finally {
    await client.end();
  }

  return event; // OBLIGATORIO: Cognito necesita el evento de vuelta
};
