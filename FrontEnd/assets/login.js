
// const response = await fetch(URL, {
//     method: "POST",
//     body: JSON.stringify({
//         email: INPUT.value
//         password: INPUT.value
//         // Pas de headers??
//     })
// });
// if (response.ok) {
//     const data = await response.json();
//     const token = data.token;
    // @TODO : Stocker le token dans le localStorage.

    const form=document.getElementById("loginForm");

    form.addEventListener("submit", async (event) => {
        // Désactivation du comportement par défaut du navigateur
        event.preventDefault();
        // Récupération des deux champs de saisie et l'id error-message
        const email=document.getElementById("email").value;
        const password=document.getElementById("password").value;
        const errorLogin=document.getElementById("error-message");

        // Vérifier si les champs sont vides
        if (!email || !password) {
            errorLogin.textContent="Veuillez renseigner tous les champs";
        }

try {
    // Envoi de la requête au serveur
        const reponse= await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify({
                email: email,
                password: password
                    })
        });

        // Vérification si la requête a réussi
        if (reponse.ok) {
            const data=await reponse.json();
            const token=data.token;
            // Stocker le token dans le localStorage.
            window.localStorage.setItem("token", token);
            //Redirection vers la page d'accueil
            window.location.href="./editionmode.html";
        }else{
            // const errorLogin=document.getElementById("error-message");
            errorLogin.textContent="Erreur dans l’identifiant ou le mot de passe";
        }
    }catch (error){
           // Gestion des erreurs lors de la connexion
        //    const errorLogin=document.getElementById("error-message");
           errorLogin.textContent="Erreur dans de la connexion, veuillez réessayer";
           console.error("Erreur lors de la connexion:", error);
    }
        });