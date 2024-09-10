// VARIABLES ET CONSTANTES~

  const data = {
    works: [],
    categories: []
  };
  const gallery = document.querySelector(".gallery");
  
  
  // LOGIQUE~
  document.addEventListener("DOMContentLoaded", async () => {
    data.works = await getWorks();
    data.categories = await getCategories();
    renderWorks(data.works)
  });


  // FONCTIONS~

  // Recuperation des données via l'API
  async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
  }
  
  async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    return await response.json();
  }
  
  // @TODO : Fonction pour afficher les travaux.
  function renderWorks(works) {
    // @TODO : Vider la galerie.
  gallery.innerHTML="";
    // @TODO : Boucler sur les travaux.
    for ( let i=0; i<works.length; i++){

// @TODO : Générer une "figure" pour chaque travail avec la fonction generateWork en lui passant le travail.
    let fig=generateWork(works[i]);

     // @TODO : Ajouter la "figure" à la galerie
    gallery.appendChild(fig);
    }
   
  }
  
  // @TODO:  Fonction pour générer une "figure" de travail.
  function generateWork(work) {
    // @TODO : Générer la structure HTML d'un travail.
    /*
                <figure>
                  <img src="URL DE L'IMAGE" alt="TITLE">
                  <figcaption>TITLE</figcaption>
              </figure>
     */
    let newfig=document.createElement("figure");
    let newimg=document.createElement("img");
    newimg.src=work.imageUrl;
    newimg.alt=work.title;
    let newfigcaption=document.createElement("figcaption");
    newfigcaption.innerText=work.title;

    newfig.appendChild(newimg);
    newfig.appendChild(newfigcaption);
    return newfig;

  }
  


  // @TODO : Fonction pour afficher les filtres de catégories.
  // @TODO : Fonction pour générer un template de filtre de catégorie.
  // @TODO : Fonction pour filtrer les travaux par catégorie.