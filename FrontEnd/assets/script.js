// VARIABLES ET CONSTANTES~
const API_URL = "http://localhost:5678/api";
const data = {
  works: [],
  categories: []
};
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");


// LOGIQUE~
document.addEventListener("DOMContentLoaded", async () => {
  data.works = await getWorks();
  renderWorks(data.works);
  data.categories = await getCategories();
  // @TODO : Récupérer le jeton d'authentification depuis le localStorage.
  // @TODO : Si un jeton est présent, alors on n'affiche pas les filtres...
  // ... mais on affiche les éléments du mode édition.
  // ... sinon, on affiche les filtres.
  renderFilters(data.categories);
});


// FONCTIONS~
// Recuperation des données via l'API
async function getWorks() {
  const response = await fetch(API_URL + "/works");
  return await response.json();
}

async function getCategories() {
  const response = await fetch(API_URL + "/categories");
  return await response.json();
}

// Fonction pour afficher les travaux.
function renderWorks(works) {
  // Vider la galerie HTML
  gallery.innerHTML = "";
  // Boucler sur les travaux.
  for (const work of works) {
    //Générer une "figure" pour chaque travail avec la fonction generateWork en lui passant le travail.
    const fig = generateWork(work);
    // Ajouter la "figure" à la galerie
    gallery.appendChild(fig);
  }
} 


// Fonction pour générer une "figure" de travail.
function generateWork(work) {
  // Générer la structure HTML d'un travail.
  /*
              <figure>
                <img src="URL DE L'IMAGE" alt="TITLE">
                <figcaption>TITLE</figcaption>
            </figure>
   */
  let newFig = document.createElement("figure");
  let newImg = document.createElement("img");
  newImg.src = work.imageUrl;
  newImg.alt = work.title;
  let newFigcaption = document.createElement("figcaption");
  newFigcaption.innerText = work.title;
  newFig.appendChild(newImg);
  newFig.appendChild(newFigcaption);
  return newFig;
}

// Un "<div class="filters"></div>" a été crée dans le fihier index.html

// Fonction pour afficher les filtres de catégories.
function renderFilters(categories) {
// Création de l'icône pour "Tous".
  filters.innerHTML = "";
  
  const all = { id: 0, name: "Tous" };
  const filterAll=generateFilter(all);
  filters.appendChild(filterAll);
  
// Boucler sur les catégories pour créer chaque filtre (avec generateFilter) et l'ajouter au DOM.
  for (const category of categories){
    const button=generateFilter(category);
    filters.appendChild(button);
  }
}

// Fonction pour générer un template de filtre de catégorie
function generateFilter(category) {
// Créer un bouton avec le nom de la catégogie
  const button=document.createElement("button");
  button.innerText=category.name;
  button.setAttribute("id", category.name);
  button.setAttribute("name", "category");
  // Ajouter un évènement au clic du bouton qui déclenche le filtrage avec l'id de la catégorie (en utilisant filterWorks)
  button.addEventListener("click", () => {
    const filteredWorks=filterWorks(data.works, category.id);
    renderWorks(filteredWorks);
    // Changement des styles CSS au clic sur le filtre
    // button.classList.add("active"); // Création d'une classe pour le bouton
    if(button.classList.contains('active')===true) {
      button.classList.remove("active");
    }else{
      button.classList.add("active");
      // remove all active class of other button
      const categories = document.querySelectorAll(`[name*="category"]`);
      categories.forEach(elt => {
        if(elt.id !== category.name && elt.classList.contains('active')) {
          elt.classList.remove("active");
        }
      })
    }
  
    console.log(button.classList);
    // return(filteredWorks);
  })
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
  const filteredCategories =  works.filter(work => work.categoryId === categoryId);
  return filteredCategories;
}

// @TODO : Créer une fonction dédiée à l'affichage du mode édition.