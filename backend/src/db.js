// backend/src/db.js
import mysql from "mysql2/promise";

// Configurazione del database reale
export const pool = mysql.createPool({
  host: "localhost",       // il tuo host, di solito localhost
  user: "uid_acquaserena",            // il tuo utente MySQL
  password: "acquaserena2025",            // la tua password MySQL
  database: "acqua_serena",// il nome del database
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
