// Ajoute un écouteur d'événement pour le formulaire avec l'ID 'weatherForm'
document.getElementById('weatherForm').addEventListener('submit', function(événement) {
    // Empêche le comportement par défaut de soumission du formulaire
    événement.preventDefault();

    // Récupère la valeur du champ avec l'ID 'postalCode' et supprime les espaces en début et fin
    const codePostal = document.getElementById('postalCode').value.trim();

    // Définit un motif pour valider un code postal de 5 chiffres
    const motifCodePostal = /^\d{5}$/;

    // Vérifie si le code postal correspond au motif
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
    // Effectue une requête fetch vers l'API pour obtenir les communes
    fetch(`https://geo.api.gouv.fr/communes?codePostal=${codePostal}`)
        .then(réponse => réponse.json()) // Convertit la réponse en JSON
        .then(données => afficherCommunes(données)) // Appelle la fonction pour afficher les communes
        .catch(erreur => console.error('Erreur lors de la récupération des communes:', erreur)); // Gère les erreurs
}

// Fonction pour afficher les communes dans une liste déroulante
function afficherCommunes(communes) {
    // Sélectionne l'élément avec l'ID 'citySelect'
    const sélecteurVille = document.getElementById('citySelect');

    // Réinitialise le contenu de la liste déroulante avec une option par défaut
    sélecteurVille.innerHTML = '<option value="">--Sélectionnez une ville--</option>';

    // Vérifie si des communes ont été trouvées
    if (communes.length > 0) {
        // Parcourt chaque commune et crée une option pour chacune
        communes.forEach(commune => {
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

// Ajoute un écouteur d'événement pour détecter les changements dans la liste déroulante des villes
document.getElementById('citySelect').addEventListener('change', function() {
    // Récupère le code de la ville sélectionnée
    const codeVilleSélectionnée = this.value;

    // Vérifie si une ville a été sélectionnée
    if (codeVilleSélectionnée) {
        // Appelle la fonction pour récupérer la météo de la ville sélectionnée
        récupérerMétéo(codeVilleSélectionnée);
    }
});