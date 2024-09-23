// FONCTIONS~
// Recuperation des données via l'API
async function getWorks() {
  const response = await fetch(API_URL + "/works");
  return await response.json();
}

const modal = document.querySelector('#modal');
const innerModal = document.querySelector('#inner-modal');
const openButton = document.querySelector("#edit-project");
const closeButton = document.querySelector("#closeModalBtn");

// Ouvrir le modal en cliquant sur le bouton
openButton.addEventListener('click', async () => {
  modal.showModal();
  data.works = await getWorks();
  renderWorksModal(data.works);
});

// Fermer le modal en cliquant sur le bouton
closeButton.addEventListener('click', () => {
  modal.close();
});

// Fermer le modal en cliquant en dehors de celui-ci
document.body.addEventListener('click', (event) => {
 // Les marges de la modale sont considérés comme étant la modale, mais l'intérieure de la modale (le contenu) n'est pas considéré comme étant la modale (mais modal-wrapper).
 if (modal.open && event.target === modal) {
      modal.close();
 }
 if (innerModal.open && event.target === innerModal) {
  innerModal.close();
 }
});


  // Fonction pour afficher les travaux.
function renderWorksModal(works) {
    const gallery = document.querySelector(".gallery-modal");
    // Vider la galerie HTML
    gallery.innerHTML = "";
    // Boucler sur les travaux.
    for (const work of works) {
    //Générer une "figure" pour chaque travail avec la fonction generateWork en lui passant le travail.
    const fig = generateWorkModal(work);
    // Ajouter la "figure" à la galerie
    gallery.appendChild(fig);
    }
  } 
  
  // Fonction pour générer une "figure" de travail.
  function generateWorkModal(work) {
    // Générer la structure HTML d'un travail.
    let newFig = document.createElement("figure");
    let newImg = document.createElement("img");
    newImg.src = work.imageUrl;
    newImg.alt = work.title;
    // let newFigcaption = document.createElement("figcaption");
    // newFigcaption.innerText = work.title;
    newFig.appendChild(newImg);
    // newFig.appendChild(newFigcaption);
    return newFig;
  }