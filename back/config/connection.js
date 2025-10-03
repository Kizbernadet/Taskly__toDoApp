// Fichier de connexion 
const { Client } = require('pg');

// 1.Configuration de la connexion
const client = new Client({
    host: "localhost", 
    port: 5432, 
    user: "postgres", 
    password: "", 
    database: "todo_db"
});

// 2. Connexion
client.connect()
    .then(() => console.log("Connecté à PostgreSQL"))
    .catch(error => console.error("Erreur de connexion", error));

// Exportation d'un fichier de la connexion
module.exports = client;
