// MODAL

// VARIABLES ET CONSTANTES
// Les variables définies dans le fichier script.js sont aussi accessibles dans ce fichier (notamment data)
const modal = document.querySelector("#modal");
const innerModal = document.querySelector("#inner-modal");
const openButton = document.querySelector("#edit-project");
const closeButton = document.querySelector("#closeModalBtn");

//LOGIQUE
// Ouvrir le modal en cliquant sur le bouton
openButton.addEventListener('click', async () => {
    modal.showModal();
    renderWorksModal(data.works);
});

// Fermer le modal en cliquant sur le bouton
closeButton.addEventListener('click', () => {
    modal.close();
});

// Fermer le modal en cliquant en dehors de celui-ci
document.body.addEventListener('click', (event) => {
    // Les marges de la modale sont considérées comme étant la modale, mais l'intérieure de la modale (le contenu) n'est pas considéré comme étant la modale (mais modal-wrapper).
    if (modal.open && event.target === modal) {
        modal.close();
    }
    if (innerModal.open && event.target === innerModal) {
        innerModal.close();
    }
});

// Fonction pour réaficher les travaux dans la modale
function reRerenderWorks(works) {
    renderWorks(works);
    renderWorksModal(works);
}

// Fonction pour afficher les travaux
function renderWorksModal(works) {
    const gallery = document.querySelector(".gallery-modal");
    // Vider la galerie HTML
    gallery.innerHTML = "";
    // Boucler sur les travaux
    for (const work of works) {
        //Générer une "figure" pour chaque travail avec la fonction generateWork en lui passant le travail
        const Fig = generateWork(work, false, true);
        // Ajouter la "figure" à la galerie
        gallery.appendChild(Fig);
    }
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
            // Afficher un nouveau tableau qui exclut le travail dont l'ID est égal à workId
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
function renderPhotoBtn() {
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
        // Créer une liste déroulante avec les éléments qui ont l'id "category"
        const categorySelect = document.getElementById("category");
        // Vider la liste deroulante afin que les catégories ne se multiplient lorsque l'utilisateur charge plusieurs photos
        categorySelect.innerHTML="";
        // Pour chaque élément du tableau créer un nouveau élément "option" avec la valeur "category.id" et le texte "category.name" et l'ajouter à la liste déroulante
        data.categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
        addSubmitForm();
    });
}
// Appeler la fonction pour afficher le bouton
renderPhotoBtn();


//**************************************************************************/
// INNER MODAL

// VARIABLES ET CONSTANTES
const closeInnerModal = document.querySelector("#closeInnerModalBtn");
const closeArrow = document.querySelector("#returnModalBtn");
const uploadFrame = document.querySelector(".inner-modal-add-picture");
const imageFrame = document.querySelector(".inner-modal-image");
const imageUploadInput = document.querySelector("#image-upload");

// LOGIQUE
// Fermer le inner-modal en cliquant sur le bouton
closeInnerModal.addEventListener('click', () => {
    innerModal.close();
});

// Losque l'utilisateur appuie sur la fleche, la première modale s'ouvre
closeArrow.addEventListener('click', async () => {
    modal.showModal();
    innerModal.close();
});

// Affichage de la fenêtre pour ajouter une photo
uploadFrame.addEventListener("click", function (event) {
    // En cliquant sur l'image, on simule un clic sur le bouton d'ajout de photo
    imageUploadInput.click();
});
imageFrame.addEventListener("click", function (event) {
    // En cliquant sur l'image, on simule un clic sur le bouton d'ajout de photo
    imageFrame.click();
});

// Lorsqu'on a simulé le clic sur l'image, on peut choisir une photo.
imageUploadInput.addEventListener("change", function () {
    const file = this.files[0]; // Récuperer le fichier
    const reader = new FileReader(); // Créer un objet FileReader (lire le contenu du fichier en local et le convertir en URL des donnée sans l'envoyer au serveur)
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
        reader.readAsDataURL(file); // Lire le fichier en tant qu'URL de données
    }
});

// Ajouter un écouteur d'événement input, qui est déclenché chaque fois que l'utilisateur modifie la valeur de ce champ
const inputs = [
    document.querySelector("#title"),
    document.querySelector("#category"),
    document.querySelector("#image-upload")
];
inputs.forEach(input => {
    input.addEventListener("input", validateInputs);
});

// Fonction pour vérifier si toutes les conditions de validation sont respectées
function validateInputs() {
    const maxFileSize = 4 * 1024 * 1024; // 4 mo en octets
    // Vérification de la taille de l'image
    if (imageUploadInput.files[0] && imageUploadInput.files[0].size > maxFileSize) {
        document.querySelector("#error-size").textContent = "Erreur: La taille de photo ne doit pas dépasser 4 mo";
        return false // Considérer que le champs n'est pas rempli
    }
    // Vérification s tous les champs du formilaire sont remplis
    if (inputs.every(input => input.value)) {
        document.querySelector("#submit").removeAttribute("disabled");
        document.querySelector("#submit").style.backgroundColor = "#1D6154";
        return true;// Fonction que les conditions de validation sont remplis et rendre le bouton de validation actif
    } else {
        document.querySelector("#submit").setAttribute("disabled", true);
        document.querySelector("#submit").style.backgroundColor = "#B0B0B0";
        return false; // Les conditions de validation ne sont pas remplis et indiquer que le bouton de validation est inactif
    }
}

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
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem("token")}`
            }
        });
        if (response.ok) {
            const work = await response.json();
            data.works.push(work);// Ajouter la nouvelle image dans le tableau data.works
            reRerenderWorks(data.works);// Réactualiser la galerie avec la nouvelle image
            // Réinitialiser le champ d'ajout des photos
            event.target.reset(); 
            imageFrame.replaceChildren();
            uploadFrame.style.display = "flex";// Le rendre visible
            // Après initialisation, rappeller la fonction qui vérifie que tous les champs du formulaire sont remplis et afficher une message de confirmation d'ajout de la photo
            validateInputs();
            alert("Votre photo a bien été ajoutée");
        } else {
            throw new Error("Une erreur est survenue lors de l'envoi de la photo");
        }
    } catch (error) {
        alert("Une erreur est survenue lors de l'envoi de la photo");
        console.error(error);
    }
}

// Fonction pour exécuter la fonction uploadPhoto à chaque fois que l'utilisateur clic sur le bouton submit
function addSubmitForm() {
    const addForm = document.getElementById("form-add-picture");
    addForm.addEventListener("submit", uploadPhoto);
}
