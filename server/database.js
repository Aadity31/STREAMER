const { Pool } = require("pg");

const dbPool = new Pool({
  user: "postgres",
  password: "2208",
  host: "localhost",
  port: 5432,
  database: "tournamentor",
});

module.exports = dbPool;
