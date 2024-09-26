// MODAL

const modal = document.querySelector("#modal");
const innerModal = document.querySelector("#inner-modal");
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

// 1 Recuperation des données via l'API
async function getWorks() {
  const response = await fetch(API_URL + "/works");
  return await response.json();
}

  // 3 Fonction pour afficher les travaux.
function renderWorksModal(works) {
    const gallery = document.querySelector(".gallery-modal");
    // Vider la galerie HTML
    gallery.innerHTML = "";
    // Boucler sur les travaux.
    for (const work of works) {
    //Générer une "figure" pour chaque travail avec la fonction generateWork en lui passant le travail.
    const Fig = generateWorkModal(work);
    // Ajouter la "figure" à la galerie
    gallery.appendChild(Fig);
    }
  } 
  
  // 2 Fonction pour générer une "figure" de travail en ajoutant le bouton de suppression
  function generateWorkModal(work) {
    // Générer la structure HTML d'un travail.
  let newFig = document.createElement("figure");
  let newImg = document.createElement("img");
  newImg.src = work.imageUrl;
  newImg.alt = work.title;
  // Créer le bouton de suppression sur chaque travail et ajout d'une class pour les styles
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
  newFig.appendChild(newImg);
  newFig.appendChild(deleteBtn);
    // 5 Supprimer un travail lors du click sur la poubelle
    deleteBtn.addEventListener("click", () => {
      deleteWork();
      });
  return newFig;
  }

  // 4 Fonction pour envoyer une requête DELETE à l'API et supprimer le travail selon son ID
  function deleteWork(workId, newFig) {
    fetch("http://localhost:5678/api/works/1", {
      method: "DELETE",
      headers: { 
        'Authorization': `Bearer ${window.localStorage.getItem("token")}`
       },
      body: JSON.stringify({ id: workId }),
    })
      .then(response =>  {
        // Si la suppression en base de données est réussie, supprimer l'élément du DOM
        if (response.ok) {
          newFig.remove();
        }
        return response.json()
      })
      .catch(error => {
        console.error(error);
      });
  }

// 9 Fonction pour recuperer les categories, les categories seront recupérés lors du clic sur "Ajouter photo" et l'ouverture de inner-modal
  // Récupération des donée (categories) via l'API
  async function getCategories() {
    const response = await fetch(API_URL + "/categories");
    return await response.json();
  }

  // 7 Fonction pour afficher le bouton "Ajouter une photo"
  function renderPhotoBtn () {
    const addBtn=generatePhotoBtn();
  }

  // 6 Foction pour générer le bouton "Ajouter une photo"
  function generatePhotoBtn () {
    const modalBody=document.querySelector(".modal-body");
    // Créer le bouton et lui ajouter la classe active pour les styles
    const addBtn=document.createElement("button");
    addBtn.innerText="Ajouter une photo";
    addBtn.classList.add("active");
    addBtn.style.cursor="pointer";
    // Ajouter le bouton dans la modal
    modalBody.appendChild(addBtn);


// 8 Création d'un évenement afin qu'au click sur le bouton "Ajouter une photo" la modale se ferme et la inner-modal s'ouvre
    addBtn.addEventListener("click", () => {
      modal.close();
      innerModal.showModal();
        getCategories().then(data => {
          const categorySelect = document.getElementById('categories');
          data.forEach(category => {
          const option = document.createElement('option');
          option.value = category.id;
          option.textContent = category.name;
          categorySelect.appendChild(option);
      });
      addSumitForm();
  })
  .catch(error => console.error('Erreur :', error));
    });
    //Retourner le bouton
    return addBtn;
  }
  // Appeler la fonction pour afficher le bouton
  renderPhotoBtn();


//************************************************************************* */
// INNER MODAL
// Fermer le inner-modal en cliquant sur le bouton
const closeInnerModal = document.querySelector("#closeInnerModalBtn");
closeInnerModal.addEventListener('click', () => {
  innerModal.close();
});
// Losque l'utilisateur appuie sur la fleche, la première modale s'ouvre
const closeArrow=document.querySelector("#returnModalBtn");
closeArrow.addEventListener('click', async () => {
  modal.showModal();
});

// Affichage de la photo
document.getElementById("photo").addEventListener("change", function (event) {
  const file=event.target.files[0]; // Récuperer le fichier
  const viewPhoto=document.getElementById("view-photo"); //Cibler l'image

  const reader=new FileReader(); // Créer un objet FileReader (lire le contenu du fichier en local sans envoie au serveur et le convertit en URL des donnée)
  // Affichage de l'image après chargement
  reader.onload= function (e) {
    viewPhoto.src=e.target.result; // la source de l'image
    viewPhoto.style.display="block"; // afficher l'image
    if (file) {
    reader.readAsDataURL(file); // lire le fichier en tant qu'URL de données
    }
  }
})

// Fonction pour uploader une photo
function uploadPhoto (event) {
  console.log("inside photo");
       event.preventDefault(); // Empêcher le rechargement de la page après la soumission du formulaire pour gérer les donées en JS
       // Cibler les éléments pour la récuperation des valeurs
        const file = document.getElementById("photo").files[0];
        let category = document.getElementById("categories");
        let categoryId = category.options[category.selectedIndex].value;
        const title = document.getElementById("title").value;

  // Utilisation de FormData pour envoyer l'image et les données associés
  const formData=new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", categoryId);
  // Envoyer les données à l'API via une requête POST  
  fetch('http://localhost:5678/api/works', {
    method: "POST",
    body:formData,
    headers: {
      'Authorization': `Bearer ${window.localStorage.getItem("token")}`
    }
  })
  .then(response =>  {
        if(response.ok) {
          console.log ("Photo chargée avec succès");
          return response.json();
        }else{
          throw new Error("Une erreur est survenue lors de l'envoi de la photo");
        }
      })
  .then(data => {
      addNewPicture(imageURL);
  })
    .catch(error => {
      console.error(error);
      });
}

// Fonction pour exécuter la fonction uploadPhoto à chaque fois que l'utilisateur clic sur le bouton submit
  function addSumitForm() {
      const myform = document.getElementById('form-add-picture');
          myform.addEventListener("submit", uploadPhoto);
  }

  // Fontion pour ajouter la nouvelle photo dans la galerie de la page d'édition et de la modale
  function addNewPicture (imageURL) {
    // Récuperation des deux galeries
    const gallery = document.querySelector(".gallery");
    const galleryModal=document.querySelector(".gallery-modal");
// Création du nouveau élément image
  let newFig = document.createElement("figure");
  let newImg = document.createElement("img");
  newImg.src = work.imageUrl;
  newImg.alt = work.title;
  let newFigcaption = document.createElement("figcaption");
  newFigcaption.innerText = work.title;
  newFig.appendChild(newImg);
  newFig.appendChild(newFigcaption);
 // Attacher la nouvelle figure à la galérie de la page édition et de la modale
  gallery.appendChild(newFig);
  galleryModal.appendChild(newFig);
  return newFig;
  }