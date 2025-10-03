/**
 * Cette fichier permet filter et de gérer les routes selon les préfixes de leurs adresses URL 
 */


// 1. Importation des routes secondaires
const tasksRoutes = require("./tasksRoutes");
const testsRoutes = require("./testsRoutes");

// 2. Exporter une fonction centrale
module.exports = (req, res) => {
    // Traitement des requêtes 
    const url = req.url;
    const method = req.method;

    // 3. Premier filtrage par préfixe d'URL
    if(url.startsWith("/tasks")){
        console.log("Route de tasks trouvée");
        tasksRoutes(req, res);
    }
    else if(url.startsWith("/tests")){
        console.log("Route de tests trouvée");
        testsRoutes(req, res);
    }

    // 4. Réponse par défaut si aucune route ne correspond 
    else{
        res.writeHead(404, {"Content-Type": "application/json"});
        res.end(JSON.stringify({error: "Route non trouvée"}));
    }
}