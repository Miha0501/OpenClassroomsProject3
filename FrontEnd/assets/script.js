
// Recuperation des données via l'API
async function getWorks() {
    const response = await fetch(API_URL + "/works");
    return await response.json();
}
// Récupération des donée (categories) via l'API
async function getCategories() {
    const response = await fetch(API_URL + "/categories");
    return await response.json();
}


// VARIABLES ET CONSTANTES~
const API_URL = "http://localhost:5678/api";
const data = {
    works: [],
    categories: []
};
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");
const authLink = document.getElementById("login-logout");


// LOGIQUE~
document.addEventListener("DOMContentLoaded", async () => {
    // Récupérer le jeton d'authentification depuis le localStorage.
    const token = localStorage.getItem("token");
    // Si un jeton est présent, alors on affiche le mode édition.
    token && renderEditionMode();
    // Changer le texte du bouton de connexion/déconnexion en fonction de la présence du jeton.
    authLink.textContent = token ? "logout" : "login";
    // Récupérer les travaux et les catégories via l'API et les afficher...
    data.works = await getWorks();
    console.log(data.works);
    renderWorks(data.works);
    data.categories = await getCategories();
    // Si le token n'est pas défini ou à une valeur false, appeler la fonction renderFilters, seulement si l'utilisateur n'est pas connecté (pour les filtres de catégories).
    !token && renderFilters(data.categories);
});


// Fonction pour afficher les travaux.
function renderWorks(works) {
    // Vider la galerie HTML
    gallery.innerHTML = "";
    // Boucler sur les travaux.
    for (const work of works) {
        //Générer une "figure" pour chaque travail avec la fonction generateWork en lui passant le travail.
        const fig = generateWork(work, true, false);
        // const fig = generateWork(work);
        // Ajouter la "figure" à la galerie
        gallery.appendChild(fig);
    }
}
// Fonction pour générer une "figure" de travail.
function generateWork(work, withCaption, withDeleteBtn) {
    // Générer la structure HTML d'un travail.
    let newFig = document.createElement("figure");
    let newImg = document.createElement("img");
    newImg.src = work.imageUrl;
    newImg.alt = work.title;
    newFig.appendChild(newImg);
    if (withCaption) {
        let newFigcaption = document.createElement("figcaption");
        newFigcaption.innerText = work.title;
        newFig.appendChild(newFigcaption);
    }
    if (withDeleteBtn) {
        const deleteBtn = document.createElement("button");
     deleteBtn.classList.add("delete-btn");
     deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
     newFig.appendChild(deleteBtn);
    // Supprimer un travail lors du click sur la poubelle
     deleteBtn.addEventListener("click", async () => {
         await deleteWork(work.id);
     });
    }
    return newFig;
}

// Un "<div class="filters"></div>" a été crée dans le fihier index.html
// Fonction pour afficher les filtres de catégories.
function renderFilters(categories) {
    // Création de l'icône pour "Tous".
    filters.innerHTML = ""; // S'assurer que la partie filtres est vide
    const all = { id: 0, name: "Tous", class: "active" }; // Attribuer un id différent des autres categories et un name
    const filterAll = generateFilter(all); // Generer la "category"
    filters.appendChild(filterAll); // L'ajouter à la div filters

    // Boucler sur les catégories pour créer chaque filtre (avec generateFilter) et l'ajouter au DOM.
    for (const category of categories) {
        const button = generateFilter(category);
        filters.appendChild(button);
    }
}

// Fonction pour générer un template de filtre de catégorie
function generateFilter(category) {
    // Créer un bouton avec le nom de la catégogie
    const button = document.createElement("button");
    button.innerText = category.name;
    button.style.cursor = "pointer";
    button.setAttribute("id", category.name); // Attribuer un identifiant unique à chaque bouton en fonction de la catégorie correspondante
    button.setAttribute("name", "category"); // Définir l'attribut "name" avec la valeur "category"
    category.class && button.classList.add(category.class); // Définir une condition si category.class est définie, lui ajouter une classe spécifique
    // Ajouter un évènement au clic du bouton qui déclenche le filtrage avec l'id de la catégorie (en utilisant filterWorks)
    button.addEventListener("click", () => {
        const filteredWorks = filterWorks(data.works, category.id);
        renderWorks(filteredWorks);
        // Changement des styles CSS au clic sur le filtre
        // Création d'une classe pour le bouton
        document.querySelector(".active").classList.remove("active");
        button.classList.add("active");
    });
    // Retourner le bouton
    return button;
}

// Fonction pour filtrer les travaux par catégorie.
function filterWorks(works, categoryId) {
    // Si l'ID de la catégorie n'est pas fourni ou égale à 0, alors on retourne la liste complète des travaux.
    if (!categoryId) {
        return works;
    }
    // Retourner les travaux filtrer par catégorie (en utilisant la méthode 'filter' en comparant le categoryId du travail avec le categoryID fourni en paramètre)
    return works.filter(work => work.categoryId === categoryId); // Tester si la propriété de chaque élement work du tableau works est égale à la categoryId
}

// Créer une fonction dédiée à l'affichage du mode édition.
function renderEditionMode() {
    // Enlever la classe .hidden aux éléments cachès qui doivent être visible en mode édition
    document.querySelectorAll(".hidden").forEach(elt => {
        elt.classList.remove("hidden");
    });

    // Cacher les filtres.
    document.querySelector(".filters").classList.add("hidden");
    // Transformer l'URL de navigation en logout
    authLink.addEventListener("click", event => {
        // Empêcher le comportement de navigation par défaut.
        event.preventDefault();
        // Supprimer le token du localStorage.
        localStorage.removeItem("token");
        // Recharger la page.
        window.location.reload();
    });
}