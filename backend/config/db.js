const { Pool } = require("pg");

const databaseUrl = process.env.DATABASE_URL;
const pool = databaseUrl ? new Pool({ connectionString: databaseUrl }) : null;

if (pool) {
    pool.on("error", () => {
        console.error("Unexpected PostgreSQL pool error.");
    });
}

module.exports = { pool };
