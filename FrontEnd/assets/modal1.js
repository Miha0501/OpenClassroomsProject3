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

// Fonction pour uploader une photo
function uploadPhoto (event) {
  console.log("inside photo");
       event.preventDefault();
        const file = document.getElementById("photo").files[0];
        let category = document.getElementById("categories");
        let categoryId = category.options[category.selectedIndex].value;
        const title = document.getElementById("title").value;

  // Utilisation de FormData pour envoyer l'image et les données associés
  const formData=new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", categoryId);
    
  fetch('http://localhost:5678/api/works', {
    method: "POST",
    body:formData,
    headers: {
      'Authorization': `Bearer ${window.localStorage.getItem("token")}`
    }
  })
  .then(response =>  {
        if(response.ok) {
        const newPicture = response.json();
        // add new picture to the dom
        }
      }
      )
      .catch(error => {
        console.error(error);
      });
}

  function addSumitForm() {
      const myform = document.getElementById('form-add-picture');
      if (myform.attachEvent) {
          myform.attachEvent("submit", uploadPhoto);
      } else {
          myform.addEventListener("submit", uploadPhoto);
      }
  }