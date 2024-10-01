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

// Fonction pour reaficher les travaux dans la modale
function reRerenderWorks(works) {
  renderWorks(works);
  renderWorksModal(works);
}

  // Fonction pour afficher les travaux.
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
  
  // Fonction pour générer une "figure" de travail en ajoutant le bouton de suppression
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
  // Supprimer un travail lors du click sur la poubelle
    deleteBtn.addEventListener("click", async () => {
      await deleteWork(work.id);
      });
  return newFig;
  }

  // Fonction pour envoyer une requête DELETE à l'API et supprimer le travail selon son ID
  async function deleteWork(workId) {
    try {
      const response = await fetch("http://localhost:5678/api/works/" + workId, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`
        },
        body: JSON.stringify({ id: workId })
      });
      if (response.ok) {
        data.works = data.works.filter(work => work.id !== workId);
        reRerenderWorks(data.works);
      } else {
        throw new Error("Une erreur est survenue lors de la suppression du travail");
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  // Fonction pour afficher le bouton "Ajouter une photo"
  function renderPhotoBtn () {
    const modalBody = document.querySelector(".modal-body");
    // Créer le bouton et lui ajouter la classe active pour les styles
    const addBtn = document.createElement("button");
    addBtn.innerText = "Ajouter une photo";
    addBtn.classList.add("active");
    addBtn.style.cursor = "pointer";
    // Ajouter le bouton dans la modal
    modalBody.appendChild(addBtn);

// Création d'un évenement afin qu'au click sur le bouton "Ajouter une photo" la modale se ferme et la inner-modal s'ouvre
    addBtn.addEventListener("click", () => {
      modal.close();
      innerModal.showModal();
      const categorySelect = document.getElementById("category");
      data.categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
          });
      addSubmitForm();
    });
  }
  const inputs = [
    document.querySelector("#title"),
    document.querySelector("#category"),
    document.querySelector("#image-upload")
  ];
  inputs.forEach(input => {
    input.addEventListener("input", validateInputs);
  });
  function validateInputs() {
    if (inputs.every(input => input.value)) {
      document.querySelector("#submit").removeAttribute("disabled");
      document.querySelector("#submit").style.backgroundColor = "#1D6154";
      return true;
    } else {
      document.querySelector("#submit").setAttribute("disabled", true);
      document.querySelector("#submit").style.backgroundColor = "#B0B0B0";
      return false;
    }
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

const uploadFrame = document.querySelector(".inner-modal-add-picture");
const imageFrame = document.querySelector(".inner-modal-image");
const imageUploadInput = document.querySelector("#image-upload");

// Affichage de la photo
uploadFrame.addEventListener("click", function (event) {
  // En cliquant sur l'image, on simule un clic sur le bouton d'ajout de photo.
  imageUploadInput.click();
});
imageFrame.addEventListener("click", function (event) {
  // En cliquant sur l'image, on simule un clic sur le bouton d'ajout de photo.
  imageFrame.click();
});
// Lorsqu'on a simulé le clic sur l'image, on peut choisir une photo.
imageUploadInput.addEventListener("change", function () {
  const file = this.files[0]; // Récuperer le fichier
  const reader = new FileReader(); // Créer un objet FileReader (lire le contenu du fichier en local sans envoie au serveur et le convertit en URL des donnée)
  // Affichage de l'image après chargement
  reader.onload = function (event) {
    const image = document.createElement("img");
    image.src = event.target.result;
    image.style.width = "129px";
    image.style.height = "169px";
    imageFrame.replaceChildren(image);
    uploadFrame.style.display = "none";
  };
  if (file) {
    reader.readAsDataURL(file); // lire le fichier en tant qu'URL de données
  }
});

// Fonction pour uploader une photo
async function uploadPhoto(event) {
  if (!validateInputs()) {
    alert("Veuillez remplir tous les champs");
    return;
  }
  event.preventDefault(); // Empêcher le rechargement de la page après la soumission du formulaire pour gérer les donées en JS
  // Utilisation de FormData pour envoyer l'image et les données associés
  const formData = new FormData(event.target);
  // Envoyer les données à l'API via une requête POST
  try {
    const response =await fetch("http://localhost:5678/api/works", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`
      }
    });
    if (response.ok) {
      const work = await  response.json();
      data.works.push(work);
      reRerenderWorks(data.works);
      // Réinitialiser le formulaire.
      event.target.reset();
      imageFrame.replaceChildren();
      uploadFrame.style.display = "flex";
      validateInputs();
      alert("Votre photo a bien été ajoutée");
    } else {
      throw new Error("Une erreur est survenue lors de l'envoi de la photo");
    }
  } catch(error) {
    alert("Une erreur est survenue lors de l'envoi de la photo");
    console.error(error);
  }
}

// Fonction pour exécuter la fonction uploadPhoto à chaque fois que l'utilisateur clic sur le bouton submit
function addSubmitForm() {
  const addForm = document.getElementById("form-add-picture");
  addForm.addEventListener("submit", uploadPhoto);
}
