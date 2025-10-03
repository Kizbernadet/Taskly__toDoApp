// Modèle
// // front/js/main.js
import { loadData, } from "./api.js";
import {convertToObject, displayTasks} from "./dom.js";

async function init() {
    console.log("Initialisation ....");
    const tasks = await loadData("tasks");

    // Affichage dynamique des élements 
    displayTasks(tasks);
}

document.addEventListener("DOMContentLoaded", init);