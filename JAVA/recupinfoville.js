// Ajoute un écouteur d'événement pour le formulaire avec l'ID 'postalCodeForm'
document.getElementById('postalCodeForm').addEventListener('submit', function(event) {
    // Empêche le comportement par défaut de soumission du formulaire, c'est-à-dire le rechargement de la page
    event.preventDefault();

    // Récupère la valeur du champ avec l'ID 'postalCode' et supprime les espaces en début et fin de chaîne
    const codePostal = document.getElementById('postalCode').value.trim();

    // Définit un motif (expression régulière) pour valider un code postal de 5 chiffres
    const motifCodePostal = /^\d{5}$/;

    // Vérifie si le code postal saisi correspond au motif
    if (!motifCodePostal.test(codePostal)) {
        // Affiche une alerte si le code postal n'est pas valide
        alert('Veuillez entrer un code postal valide de 5 chiffres.');
        return; // Arrête l'exécution de la fonction
    }

    // Appelle la fonction pour récupérer les communes associées au code postal
    récupérerCommunes(codePostal);
});

// Fonction pour récupérer les communes à partir d'un code postal
function récupérerCommunes(codePostal) {
    // Effectue une requête fetch vers l'API gouvernementale pour obtenir les communes associées au code postal
    fetch(`https://geo.api.gouv.fr/communes?codePostal=${codePostal}`)
        .then(réponse => {
            // Vérifie si la réponse est OK (statut HTTP 200)
            if (!réponse.ok) {
                throw new Error('Aucune commune trouvée pour ce code postal.');
            }
            return réponse.json(); // Convertit la réponse en JSON
        })
        .then(données => {
            // Vérifie si des données ont été retournées et si elles ne sont pas vides
            if (!données || données.length === 0) {
                throw new Error('Aucune commune trouvée pour ce code postal.');
            }
            // Affiche les communes dans une liste déroulante
            afficherCommunes(données);
            // Affiche le formulaire de prévisions après avoir entré le code postal
            document.getElementById('weatherFormContainer').style.display = 'block';
        })
        .catch(erreur => {
            // Gère les erreurs éventuelles lors de la récupération des communes
            console.error('Erreur lors de la récupération des communes:', erreur);
            alert(erreur.message);
            // Empêche l'affichage des options suivantes en cas d'erreur
            document.getElementById('weatherFormContainer').style.display = 'none';
        });
}

// Fonction pour afficher les communes dans une liste déroulante
function afficherCommunes(communes) {
    // Sélectionne l'élément avec l'ID 'citySelect' qui est la liste déroulante pour les villes
    const sélecteurVille = document.getElementById('citySelect');

    // Réinitialise le contenu de la liste déroulante avec une option par défaut
    sélecteurVille.innerHTML = '<option value="">--Sélectionnez une ville--</option>';

    // Vérifie si des communes ont été trouvées
    if (communes.length > 0) {
        // Parcourt chaque commune dans la liste des communes
        communes.forEach(commune => {
            // Crée un nouvel élément option pour chaque commune
            const option = document.createElement('option');
            option.value = commune.code; // Définit la valeur de l'option comme le code de la commune
            option.textContent = commune.nom; // Définit le texte de l'option comme le nom de la commune
            sélecteurVille.appendChild(option); // Ajoute l'option à la liste déroulante
        });

        // Affiche la liste déroulante
        sélecteurVille.style.display = 'block';
    } else {
        // Affiche une alerte si aucune commune n'est trouvée
        alert('Aucune commune trouvée pour ce code postal.');
    }
}