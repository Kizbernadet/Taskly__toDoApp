// Importation 
const client = require('../config/connection');
const url = require('url');

// Fonction utilitaire pour envoyer des réponses JSON
function sendJson(res, code, data){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.writeHead(code, {"Content-Type": "application/json"});
    res.end(JSON.stringify(data));
}

module.exports = async (req, res) => {
    // Variables utilisées 
    const reqUrl = req.url;
    const method = req.method;

    // Cette variable est utilisée dans le requête POST
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0];


    //  Parsing sécurisée de l'URL 
    const parsedUrl = new URL(reqUrl, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;
    const searchParams = parsedUrl.searchParams;

    // Découpage le pathname pour gérer les routes
    // parts {Partie du pathname} et length {Longueur du chemin }
    const parts = pathname.split("/").filter(Boolean);
    const length = parts.length;

    // Gestion des méthodes HTTP 
    if(method === "GET"){
        if(length === 1 && parts[0] === "tasks"){
            console.log("Route 1 - Afficher toutes les tâches");
            try{
                // Construction dynamique de la requête pour gérer les filtres

                // Requête SQL utilisée 
                let query = "SELECT * FROM tasks WHERE 1=1";
                const params = [];
                let index = 1;

                // Extraction des filtres
                const status = searchParams.get("status");
                const priority = searchParams.get("priority");

                // Traitement des filtres 
                const allowedFilters = ["status", "priority"];
                
                for(const filter of allowedFilters){
                    const value = searchParams.get(filter);
                    if(value){
                        query += `AND ${filter} = $${index}`;
                        params.push(value);
                        index ++;
                    }
                }

                const result = await client.query(query, params);
                const datas = result.rows;

                // Si aucune donnée n'est trouvée 
                if(datas.length === 0){
                    return sendJson(res, 404, {message : "Aucune tâche trouvée"})
                }

                // Retour des données 
                return sendJson(res, 200, datas);
            } 
            catch(error){
                console.error("Erreur serveur GET /tasks:", error);
                return sendJson(res, 500, { message: "Erreur serveur" });
            }
        }

        else if(length === 2 && parts[0] === 'tasks'){
            console.log("Route 2 - Récupérer une les informations d'une tâche via son id")
            const id = parts[1];

            // Vérifier que l'id est un nombre
            if(isNaN(Number(id))){
                return sendJson(res, 404, {message : "ID Invalide"});
            }

            try{
                // Requête sécurisée avec paramètre préparé
                const result = await client.query(`SELECT * FROM tasks WHERE id = $1`, [id]);
                const datas = result.rows;

                console.log(datas)
                return sendJson(res, 200, datas)
            }
            catch(error){
                console.error("Erreur serveur GET / tasks : ", error);
                return sendJson(res, 500, {message : "Erreur Serveur"});
            }
        }
    }
    else if (method == "POST"){
        console.log("Route POST - Créer une nouvelle tâche");

        // 1. Lire le body
        let body = ""
        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", async () => {
            try{

                // 2. Parser les données 
                const data = JSON.parse(body);
                console.log("Données : ", data);

                // Phase de validation des données récupérées dans le body
                
                // Vérification du titre et de l'id
                if(!data.title || !data.user_id){
                    return sendJson(res, 400, { message: "Title et user_id obligatoires" });
                }

                if (typeof data.title !== 'string' || !data.title.trim()) {
                    return sendJson(res, 400, { message: "Title doit être une chaîne non vide" });
                }
                if (isNaN(Number(data.user_id))) {
                    return sendJson(res, 400, { message: "user_id doit être un nombre" });
                }
                // 3. Appliquer la logique : Insérer en BDD
                const query = `
                    INSERT INTO tasks (title, description, status, priority, due_date, user_id)
                    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
                const values = [
                    data.title, 
                    data.description, 
                    data.status || "in_progress", 
                    data.priority || "low", 
                    data.due_date || currentDate, 
                    data.user_id
                ];
                const result = await client.query(query, values);
                const message = {
                    message: "Tâche créée avec succès",
                    task: result.rows[0]
                }

                // 4. Réponse au client
                return sendJson(res, 201, message) ;

            }
            catch(error){
                console.error("Erreur serveur POST / tasks : ", error);
                return sendJson(res, 500, {message : "Erreur Serveur"});
            }
        });
    }
    else if(method === "PATCH"){

        // Pour ce que je pense qu'il faut voir comment est récupéré le ou les paramètres qui sont modifiés ?
        // Pour ensuite utiliser une requête UPDATE sur ces élements 
        console.log("Route - Modifier les informations d'une tâche");
        const id = parts[1];

        if(isNaN(Number(id))){
            return sendJson(res, 404, {message : "ID Invalide"});
        }

        // Lecture du body
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        })

        req.on("end", async () => {
            try{
                // Parsing des données 
                const data = JSON.parse(body);
                console.log("Nouvelles données", data)

                // variables utilisées 
                const allowedFields = ["title", "description", "status", "priority", "due_date"];
                const updates = [];
                const values = [];
                let index = 1;

                for (const field of allowedFields) {
                    if (data[field] !== undefined) {
                        updates.push(`${field} = $${index}`);
                        values.push(data[field]);
                        index++;
                    }
                }

                // Si aucun champ à mettre à jour
                if(updates.length === 0){
                    return sendJson(res, 400, { message: "Aucun champ valide à mettre à jour" });
                }

                // Ajouter l'id pour le WHERE
                values.push(id);

                // Mise en place de la requête 
                const query = `
                    UPDATE tasks SET ${updates.join(", ")}
                    WHERE id = $${index} RETURNING *
                    `
                const result = await client.query(query, values);

                // Vérifier si la tache existe 
                let message = "";

                if(result.rows.length === 0){
                    message = {
                        message : "Tache non trouvée"
                    }
                    return sendJson(res, 404,  message);
                }

                // Réponse au client avec la tâche mise à jour 
                message = {
                    message : "Tache mise à jour avec succès",
                    task: result.rows[0]
                }

                return sendJson(res, 200, message)
                
            }
            catch(error){
                console.error("Erreur serveur PATCH / tasks : ", error);
                return sendJson(res, 500, {message : "Erreur Serveur"});
            }
        })
    }
    else if(method === "DELETE"){
        console.log("Route - Supprimer une tâche");
        const id = parts[1];

        if(isNaN(Number(id))){
            return sendJson(res, 404, {message : "ID Invalide"});
        }

        try{
            const result = await client.query(`DELETE FROM tasks WHERE id = $1`, [id]);

            if(result.rowCount === 0){
                // Cette requête est un succès mais n'a aucun effet sur la BDD
                return sendJson(res, 204, {message : "Requête invalide"})
            }

            const message = {
                message: "Tâche supprimée avec succès", 
                task: result.rows[0]
            }

            return sendJson(res, 200, message);

            
        }
        catch(error){
            console.error("Erreur serveur PATCH / tasks : ", error);
            return sendJson(res, 500, {message : "Erreur Serveur"});
        }
    }
    else{
        return sendJson(res, 405, { message: `Méthode ${method} non autorisée sur /tasks` });
    }
}
