/*
    dom.js — gestion du DOM pour l'application Taskly

    But:
    - Manipuler l'affichage des tâches (création, modification, suppression)
    - Gérer le formulaire d'ajout / édition (ouverture, fermeture, valeurs par défaut)
    - Fournir des helpers pour convertir du JSON et mettre à jour le storage

    NOTE IMPORTANTE (pour toi) :
    Tu souhaites supprimer l'usage de `innerHTML` et créer les éléments DOM
    via `document.createElement()` + `appendChild()`.
    J'ai ajouté des commentaires `// >> CHANGE HERE` aux endroits clefs
    (notamment là où `innerHTML` est utilisé) pour t'indiquer précisément
    où faire ces remplacements et quelles étapes suivre.
*/
/* Variables Utilisées */
const task__container = document.querySelector("#taskContainer"); 
const addTaskContainer = document.querySelector("#addTaskContainer");
const addNewTask = document.querySelector("#addNewTask");
const taskForm = document.querySelector("#taskForm");
const filterState = document.querySelector("#filterState");
const filtersContent = document.querySelector("#filtersContent");

// État de l'application
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editingTaskId = null;

// Fonctions utilisées 
export function displayPop(){
    console.log("Display Pop")
    addTaskContainer.classList.remove("hidden");
    addTaskContainer.classList.add("flex");
    console.log("Pop Up Affichée");
}

export function closePop(){
    addTaskContainer.classList.remove("flex");
    addTaskContainer.classList.add("hidden");
    editingTaskId = null;
    taskForm.reset();
    document.getElementById('taskForm').querySelector('button[type="submit"]').textContent = 'Créer la tâche';
    document.querySelector('.form__header h2').textContent = 'Ajouter une nouvelle tâche';
    console.log("Pop Up Masquée");
}

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

// Sauvegarder les tâches dans le localStorage
// - Met à jour le storage et rafraîchit les statistiques
// - Ne touche pas l'UI directement (affichage via displayTasks)
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateStats();
}

// Mettre à jour les statistiques
// - Met les compteurs total/pending/completed dans le DOM
function updateStats() {
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(task => !task.completed).length;
    const completedTasks = tasks.filter(task => task.completed).length;

    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('pendingTasks').textContent = pendingTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
}

// Afficher toutes les taches 
export function displayTasks(filteredTasks = null){
    const container = task__container;
    const tasksToDisplay = filteredTasks || tasks;

    // Vider le container
    // >> CHANGE HERE: clear container
    // Pour remplacer innerHTML par création d'éléments, on conserve
    // temporairement le reset via innerHTML = '' puis on créera
    // les éléments via createElement() plus bas.
    // Remplacez cette ligne par une boucle qui supprime les noeuds enfants
    // si vous préférez éviter innerHTML totalement.
    container.innerHTML = '';

    if (tasksToDisplay.length === 0) {
        // >> CHANGE HERE: affichage du placeholder quand aucune tâche
        // Actuellement on utilise innerHTML pour ajouter un élément de remplacement.
        // Pour éviter innerHTML, crée un <li> via document.createElement('li'),
        // lui ajouter les classes et enfants (icone, <p>, etc.) puis appendChild.
        container.innerHTML = `
            <li class="task-placeholder text-gray-400 text-center py-8">
                <i class="fas fa-clipboard text-4xl mb-2"></i>
                <p>Aucune tâche trouvée</p>
                <p class="text-sm">Essayez de modifier vos filtres</p>
            </li>
        `;
        return;
    }

    // Ajouter dynamiquement les élements
    tasksToDisplay.forEach(task => {
        const li = createTaskElement(task);
        container.appendChild(li);
    });
}

// Créer un élément tâche
function createTaskElement(task) {
    const li = document.createElement("li");
    li.dataset.taskId = task.id;
    li.classList.add("task__style__li", `priority-${task.priority}`);
    
    if (task.completed) {
        li.classList.add("completed");
    }

    // Formatage de la date
    const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString('fr-FR') : 'Non définie';

    // >> CHANGE HERE: Construction via innerHTML
    // Actuellement la tâche est injectée via une template string dans innerHTML.
    // Pour remplacer par création d'éléments DOM (recommandé) :
    // 1) créer un <div class="flex items-center ..."> container (via createElement)
    // 2) créer l'input checkbox, définir ses attributs (type, classes, checked)
    // 3) créer les éléments de texte (<span>, <p>) et les append
    // 4) créer le bloc d'actions (boutons edit/delete) et leur icône
    // 5) appendChild chaque sous-élément à 'li'
    // Exemple (esquisse) :
    // const left = document.createElement('div'); left.className = 'flex items-center flex-1 gap-3';
    // const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.className = 'task__style__input task-checkbox';
    // if (task.completed) checkbox.checked = true;
    // left.appendChild(checkbox);
    // ... ensuite créer title, meta, etc.
    // Pour l'instant on garde innerHTML pour compatibilité, mais tu peux
    // remplacer la suite par la construction DOM décrite ci‑dessus.
    li.innerHTML = `
        <div class="flex items-center gap-3 flex-1 h-full p-1">
            <input type="checkbox" class="task__style__input task-checkbox" ${task.completed ? 'checked' : ''}>
            <div class="task-content flex-1 flex h-full">
                <div class="flex flex-col justify-center items-center flex-1 h-full">
                    <span class="task-title font-medium">${task.title}</span>
                </div>
                <div class="task-meta justify-evenly items-center w-5/12">
                    ${task.category ? `<span class="task-category category-${task.category}">${getCategoryLabel(task.category)}</span>` : ''}
                    ${task.priority ? `<span class="task-priority priority-${task.priority}">${getPriorityLabel(task.priority)}</span>` : ''}
                    <span class="task-date">
                        <i class="fas fa-calendar-alt text-xs"></i>
                        ${dueDate}
                    </span>
                </div>
            </div>
        </div>
        <div class="task__style__actions flex justify-evenly items-center gap-x-4 p-4 w-2/12 h-full">
            <button class="task__style__button edit" title="Modifier">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 task__style__icon">
                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                    <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                </svg>
            </button>
            <button class="task__style__button delete" title="Supprimer">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 task__style__icon">
                    <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>
    `;

    return li;
}

// Obtenir le libellé de la catégorie
function getCategoryLabel(category) {
    const categories = {
        'work': 'Travail',
        'personal': 'Personnel',
        'shopping': 'Courses',
        'health': 'Santé'
    };
    return categories[category] || category;
}

// Obtenir le libellé de la priorité
function getPriorityLabel(priority) {
    const priorities = {
        'high': 'Haute',
        'medium': 'Moyenne',
        'low': 'Basse'
    };
    return priorities[priority] || priority;
}

// Filtrer les tâches
// - Lit les filtres actifs (statut, priorité, catégorie)
// - Applique les filtres sur le tableau `tasks` puis appelle displayTasks
function filterTasks() {
    const statusFilter = getActiveStatusFilter();
    const priorityFilter = getActivePriorityFilter();
    const categoryFilter = document.getElementById('categoryFilter').value;

    let filteredTasks = tasks;

    // Filtre par statut
    if (statusFilter.length > 0 && !statusFilter.includes('all')) {
        filteredTasks = filteredTasks.filter(task => {
            if (statusFilter.includes('completed') && task.completed) return true;
            if (statusFilter.includes('pending') && !task.completed) return true;
            return false;
        });
    }

    // Filtre par priorité
    if (priorityFilter.length > 0 && !priorityFilter.includes('all')) {
        filteredTasks = filteredTasks.filter(task => 
            task.priority && priorityFilter.includes(task.priority)
        );
    }

    // Filtre par catégorie
    if (categoryFilter && categoryFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.category === categoryFilter);
    }

    displayTasks(filteredTasks);
}

// Obtenir les filtres de statut actifs
// Retourne un tableau des valeurs de filtre actuellement cochées
function getActiveStatusFilter() {
    const checkboxes = document.querySelectorAll('.filter-checkbox:checked');
    return Array.from(checkboxes).map(cb => cb.dataset.filter);
}

// Obtenir les filtres de priorité actifs
// Retourne un tableau des priorités sélectionnées (ex: ['high','low'])
function getActivePriorityFilter() {
    const checkboxes = document.querySelectorAll('.priority-checkbox:checked');
    return Array.from(checkboxes).map(cb => cb.dataset.priority);
}

// Gestion des événements
// - Lie tous les écouteurs d'événements du UI (boutons, formulaires, filtres)
// - Modifie uniquement la logique d'attachement; les handlers sont définis
export function setupEventListeners() {
    // Afficher la Pop-Up pour créer une nouvelle tâche
    addNewTask.addEventListener('click', displayPop);

    // Fermer la Pop Up
    addTaskContainer.addEventListener("click", (event) => {
        if (event.target.id === "close-taskForm" || event.target.id === "cancelTaskBtn" || event.target === addTaskContainer) {
            closePop();
        }
    });

    // Gestion du formulaire
    taskForm.addEventListener("submit", handleTaskSubmit);

    // Gestion des tâches (cocher, modifier, supprimer)
    task__container.addEventListener("click", handleTaskActions);

    // Gestion des filtres
    filterState.addEventListener("change", toggleFilters);
    document.querySelectorAll('.filter-checkbox, .priority-checkbox, #categoryFilter').forEach(element => {
        element.addEventListener("change", filterTasks);
    });

    // Ajouter une catégorie
    document.getElementById('addCategoryBtn').addEventListener('click', addNewCategory);
}

// Gérer la soumission du formulaire
// - Récupère les données du formulaire (FormData)
// - Si editingTaskId est défini on met à jour, sinon on crée une nouvelle tâche
// - Sauvegarde et rafraîchit l'affichage
function handleTaskSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(taskForm);
    const taskData = {
        id: editingTaskId || Date.now().toString(),
        title: formData.get('taskTitle'),
        description: formData.get('taskDescription'),
        dueDate: formData.get('taskDate'),
        priority: formData.get('taskPriority'),
        category: formData.get('taskCategory'),
        completed: false,
        createdAt: new Date().toISOString()
    };

    if (editingTaskId) {
        // Modification
        const index = tasks.findIndex(task => task.id === editingTaskId);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...taskData };
        }
    } else {
        // Nouvelle tâche
        tasks.push(taskData);
    }

    saveTasks();
    displayTasks();
    closePop();
}

// Gérer les actions sur les tâches
// - Délégation d'événements sur le container des tâches
// - Détecte clics sur checkbox, edit et delete et appelle les helpers
function handleTaskActions(event) {
    const taskElement = event.target.closest('.task__style__li');
    if (!taskElement) return;

    const taskId = taskElement.dataset.taskId;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Coche/décoche
    if (event.target.classList.contains('task-checkbox')) {
        task.completed = event.target.checked;
        taskElement.classList.toggle('completed', task.completed);
        saveTasks();
        filterTasks();
    }
    // Modification
    else if (event.target.closest('.edit')) {
        editTask(task);
    }
    // Suppression
    else if (event.target.closest('.delete')) {
        deleteTask(taskId);
    }
}

// Modifier une tâche
// - Pré-remplit le formulaire avec les valeurs de la tâche
// - Définit editingTaskId pour indiquer qu'on est en mode édition
function editTask(task) {
    editingTaskId = task.id;
    
    // Remplir le formulaire
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('taskDate').value = task.dueDate || '';
    document.getElementById('taskPriority').value = task.priority || '';
    document.getElementById('taskCategory').value = task.category || '';
    
    // Changer le texte du bouton
    document.getElementById('taskForm').querySelector('button[type="submit"]').textContent = 'Modifier la tâche';
    document.querySelector('.form__header h2').textContent = 'Modifier la tâche';
    
    displayPop();
}

// Supprimer une tâche
// - Confirme l'action puis supprime la tâche, sauvegarde et rafraîchit
function deleteTask(taskId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        displayTasks();
        filterTasks();
    }
}

// Activer/désactiver les filtres
// - Ajoute/retire la classe `filters-active` sur le container principal
// - Force la ré-application des filtres via filterTasks()
function toggleFilters() {
    const mainContainer = document.getElementById('mainContainer');
    if (filterState.checked) {
        mainContainer.classList.add('filters-active');
    } else {
        mainContainer.classList.remove('filters-active');
    }
    filterTasks();
}

// Ajouter une nouvelle catégorie
// - Demande via prompt le nom de la catégorie, crée et sélectionne l'option
function addNewCategory() {
    const newCategory = prompt("Entrez le nom de la nouvelle catégorie:");
    if (newCategory && newCategory.trim()) {
        const categorySelect = document.getElementById('taskCategory');
        const categoryValue = newCategory.toLowerCase().replace(/\s+/g, '-');
        
        // Vérifier si la catégorie existe déjà
        if (!Array.from(categorySelect.options).some(option => option.value === categoryValue)) {
            const option = document.createElement('option');
            option.value = categoryValue;
            option.textContent = newCategory;
            categorySelect.appendChild(option);
        }
        
        categorySelect.value = categoryValue;
    }
}

// Initialiser l'application
// - Branche les listeners et initialise l'UI à partir du storage
export function initApp() {
    setupEventListeners();
    updateStats();
    displayTasks();
    setDefaultTaskDate();
    console.log("Application Taskly initialisée");
}

// Met la date d'aujourd'hui par défaut dans le champ date
// - utile pour pré-remplir le champ date lors de création
export function setDefaultTaskDate() {
    const dateInput = document.getElementById('taskDate');
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }
}