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
  // Créer le bouton de suppression sur chaque travail
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
  newFig.appendChild(newImg);
  newFig.appendChild(deleteBtn);
  // Supprimer un travail lors du click sur la poubelle
  deleteBtn.addEventListener("click", () => {
    const modalGallery=document.querySelector(".gallery-modal");
    modalGallery.appendChild(newFig);
    modalGallery.removeChild(newFig);
    });
  return newFig;
  }

  // Fonction pour afficher le bouton "Ajouter une photo"
  function renderPhotoBtn () {
    const addBtn=generatePhotoBtn();
  }

  // Foction pour générer le bouton "Ajouter une photo"
  function generatePhotoBtn () {
    const modalBody=document.querySelector(".modal-body");
    // Créer le bouton
    const addBtn=document.createElement("button");
    addBtn.innerText="Ajouter une photo";
    addBtn.classList.add("active");
    addBtn.style.cursor="pointer";
    // Ajouter le bouton dans la modal
    modalBody.appendChild(addBtn);

    addBtn.addEventListener("click", () => {
      // Ajouter la classe "active" au bouton quand au click
      addBtn.classList.add("active");
      modal.close();
      innerModal.showModal();
    });
    return addBtn;
  }
  
  // Appeler la fonction pour afficher le bouton
  renderPhotoBtn();


// FONTIONS INNER MODAL
  const btnAjouterPhoto = document.getElementById("add-photo");
  const inputPhoto = document.getElementById("photo");
  
  btnAjouterPhoto.addEventListener("click", () => {
    inputPhoto.click(); // Simuler le clic sur l'élément input file
  });