
const formUser=document.getElementById("loginForm");

document.addEventListener("DOMContentLoaded", async () => {
    
    formUser.addEventListener("submit", async (event) => {
        // Désactivation du comportement par défaut du navigateur
        event.preventDefault();
        // Récupération des deux champs de saisie et l'id error-message
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const errorLogin = document.getElementById("error-message");
        // Variable pour stocker les erreurs.
        let error;

        // Vérifier si les champs sont vides
        if (!email || !password) {
            error = "Veuillez renseigner tous les champs";
          }
        // Si il n'y a pas d'erreur
        if (!error) {
            try {
        // Envoi de la requête au serveur
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: email,
              password: password
            })
    });
        // Vérification si la requête a réussi
            if (response.ok) {
                const data=await response.json();
                const token=data.token;
            // Stocker le token dans le localStorage.
                localStorage.removeItem("token");
                window.localStorage.setItem("token", token);
            //Redirection vers la page d'accueil
                window.location.href="./index.html";
            }else{
                error="Erreur dans l’identifiant ou le mot de passe";
                    }
        }catch (error){
           // Gestion des erreurs lors de la connexion
           error="Erreur dans de la connexion, veuillez réessayer";
           console.error("Erreur lors de la connexion:", error);
            }
        }
     // Affichage des erreurs
     if (error) {
        errorLogin.textContent = error;
      }
    });
});
