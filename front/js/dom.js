/* Variables Utilisées */
const task__container = document.querySelector("#taskContainer"); 
const addTaskContainer = document.querySelector("#addTaskContainer");
const addNewTask = document.querySelector("#addNewTask");


// Fonctions utilisées 
export function displayPop(){
    addTaskContainer.classList.remove("hidden");
    addTaskContainer.classList.add("flex-centered");
    console.log("Pop Up Affichée");
}

export function closePop(){
    addTaskContainer.classList.remove("flex-centered");
    addTaskContainer.classList.add("hidden");
    console.log("Pop Up Masquée");
}


// Fonctions Utilisées et Exportées 
// Convertir le résultat Json en Objet 
export function convertToObject(param){
    try{
        const data = JSON.parse(param);

        // On vérifie que le résultat est bien un objet 
        if (typeof data === "object" && data !== null){
            console.log("Conversion Réussie");
            return data;
            }
        else {
        throw new Error("Le JSON n'est pas un objet ou un tableau.");
        }
    }
    catch(error){
        console.error("Erreur de parsing JSON : ", error.message);
        return null; 
    }

}

// Afficher toutes les taches 
export function displayTasks(params){
    // Séléectionner le container 
    const container = task__container;

    // Ajouter dynamiquement les élements
    const datas = params;

    for (let data of datas){

        // Les informations necessaires 
        const title = data["title"]
        const task_id = data["id"]

        // Créer un li 
        const li = document.createElement("li");

        // Ajout un identifiant à cette tâche via les attributs 
        // data-*
        li.dataset.taskId = task_id;

        // Ajouter les classes
        li.classList.add("task__style__li");

        // Ajouter les sous-élements
        // Ajout la balise input
        const input = document.createElement("input");
        input.type = "checkbox"
        input.id = `task-${task_id}`;
        input.classList.add("task__style__input")
        li.appendChild(input);
        
        const label = document.createElement("label");
        label.setAttribute("for", `task-${task_id}`);
        label.textContent = title;
        label.classList.add("task__style__p");
        li.appendChild(label);

        // Ajout de la balise div - actions 
        const div = document.createElement("div");
        div.classList.add("task__style__actions");

        // Ajout des éléments de la div - actions
        const editButton = document.createElement("button");
        editButton.classList.add("task__style__button", "edit__task_btn");

        const editIcon = document.createElement("i");
        editIcon.classList.add("fa-solid", "fa-pen-to-square", "task__style__icon");
        editButton.appendChild(editIcon);
        
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("task__style__button", "delete__task__btn");

        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid",  "fa-trash", "task__style__icon")
        deleteButton.appendChild(deleteIcon);

        div.append(editButton, deleteButton);
        li.appendChild(div);

        container.appendChild(li);
    }

}

/* ==== GESTION DES EVENEMENTS ==== */

// Afficher la Pop-Up pour créer une nouvelle tâche
// Evenement déclencheur
addNewTask.addEventListener('click', (event) => {
    console.log(event.target);

    // Afficher la Pop Up 
    displayPop();
});


// Gestion des actions et évenements dans la Pop Up de création d'une nouvelle tâche
// Fermer la Pop Up de création d'une nouvelle page
addTaskContainer.addEventListener("click", (event) => {
    const targetClosest = event.target.closest("button");
    console.log(targetClosest.id);

    if(targetClosest.id === "close-taskForm"){
        console.log("Condition respectée");
        closePop();
    }
})


// Gestion des évenements en lien avec le taskContainer 
task__container.addEventListener("click", (event) => {
    console.log(event.target);

    const targetClosest = event.target.closest("button");
    console.log(targetClosest)
})


/* ==== GESTION DES EVENEMENTS ==== */