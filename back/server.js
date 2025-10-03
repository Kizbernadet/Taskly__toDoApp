// importation des modules 
const http = require("http");
const handler = require("./routes/handler")
require("./config/connection");


// Variables utilisées 
const port = 3000;

// Créer un serveur 
const server = http.createServer((req, res) => {
    handler(req, res)
});

server.listen(port, () => {
    console.log("Le serveur fonctionne sur le port ", port);
});