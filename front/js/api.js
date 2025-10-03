// Variables Globales 
const apiUrl = "http://localhost:3000"

// Fonctions Utilisées 
export async function loadData(params){
    const completedUrl = `${apiUrl}/${params}`;
    
    // Envoi de la requête vers le back
    const response = await fetch(completedUrl);

    // Transformation de la réponse en format exploitable 
    const datas = await response.json();

    // Récupérer la reponse
    return datas
}