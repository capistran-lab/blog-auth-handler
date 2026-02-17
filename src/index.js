const { Client } = require("pg");

exports.handler = async (event) => {
  console.log("Event received", JSON.stringify(event.triggerSource));

  const { userAttributes } = event.request;
  const userEmail = userAttributes.email;
  const userSub = event.userName;

  if (!userEmail || !userSub) {
    console.error("Mising required  user attributes");
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

    const values = [userSub, userEmail];

    await client.query(query, values);
    console.log(`Sync completed for user sub: ${userSub.substring(0, 8)}...`);
  } catch (error) {
    console.error("Database Sync failed");
  } finally {
    await client.end();
  }

  return event;
};
