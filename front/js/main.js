// Modèle
// // front/js/main.js
import * as dom from "./dom.js";
import * as api from "./api.js";

async function init() {
    console.log("Initialisation ....");
    const tasks = await api.loadData("tasks");

    // Affichage dynamique des élements 
    dom.displayTasks(tasks);

    // Gestion des évenements
    dom.setupEventListeners();
}

document.addEventListener("DOMContentLoaded", init);