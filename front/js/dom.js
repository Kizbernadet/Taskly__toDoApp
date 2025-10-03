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


// --- Gestion du formulaire d'ajout de tâche (extraction du script HTML) ---

// Met la date d'aujourd'hui par défaut dans le champ date
export function setDefaultTaskDate() {
    const dateInput = document.getElementById('taskDate');
    if (dateInput) dateInput.valueAsDate = new Date();
}

// Ferme la modale du formulaire
export function setupCloseTaskForm() {
    const closeBtn = document.getElementById('close-taskForm');
    const container = document.getElementById('addTaskContainer');
    if (closeBtn && container) {
        closeBtn.addEventListener('click', () => {
            container.style.display = 'none';
        });
    }
}

// Bouton d'annulation
export function setupCancelTaskBtn() {
    const cancelBtn = document.getElementById('cancelTaskBtn');
    const container = document.getElementById('addTaskContainer');
    if (cancelBtn && container) {
        cancelBtn.addEventListener('click', () => {
            container.style.display = 'none';
        });
    }
}

// Ajout dynamique de catégorie
export function setupAddCategoryBtn() {
    const addBtn = document.getElementById('addCategoryBtn');
    const select = document.getElementById('taskCategory');
    if (addBtn && select) {
        addBtn.addEventListener('click', () => {
            const newCategory = prompt("Entrez le nom de la nouvelle catégorie:");
            if (newCategory) {
                const option = document.createElement('option');
                option.value = newCategory.toLowerCase().replace(/\s+/g, '-');
                option.textContent = newCategory;
                select.appendChild(option);
                select.value = option.value;
                updateCategoryDisplay();
            }
        });
    }
}

// Indicateur de priorité
export function setupPriorityIndicator() {
    const select = document.getElementById('taskPriority');
    const indicator = document.getElementById('priority-indicator');
    const text = document.getElementById('priority-text');
    const dot = document.getElementById('priority-dot');
    if (select && indicator && text && dot) {
        select.addEventListener('change', function() {
            if (this.value) {
                indicator.classList.remove('hidden');
                switch(this.value) {
                    case 'low':
                        text.textContent = 'Priorité faible';
                        dot.style.backgroundColor = '#10b981';
                        break;
                    case 'medium':
                        text.textContent = 'Priorité moyenne';
                        dot.style.backgroundColor = '#f59e0b';
                        break;
                    case 'high':
                        text.textContent = 'Priorité haute';
                        dot.style.backgroundColor = '#ef4444';
                        break;
                }
            } else {
                indicator.classList.add('hidden');
            }
        });
    }
}

// Affichage de la catégorie sélectionnée
export function updateCategoryDisplay() {
    const categorySelect = document.getElementById('taskCategory');
    const displayArea = document.getElementById('selected-category-display');
    if (categorySelect && displayArea) {
        if (categorySelect.value) {
            const categoryName = categorySelect.options[categorySelect.selectedIndex].text;
            displayArea.innerHTML = `<div class="selected-category category-${categorySelect.value}">
                <i class="fas fa-tag"></i>
                Catégorie: ${categoryName}
            </div>`;
        } else {
            displayArea.innerHTML = '';
        }
    }
}

export function setupCategoryDisplayListener() {
    const categorySelect = document.getElementById('taskCategory');
    if (categorySelect) {
        categorySelect.addEventListener('change', updateCategoryDisplay);
    }
}

// Initialisation globale du formulaire d'ajout de tâche
export function initTaskFormFeatures() {
    setDefaultTaskDate();
    setupCloseTaskForm();
    setupCancelTaskBtn();
    setupAddCategoryBtn();
    setupPriorityIndicator();
    setupCategoryDisplayListener();
    updateCategoryDisplay();
}