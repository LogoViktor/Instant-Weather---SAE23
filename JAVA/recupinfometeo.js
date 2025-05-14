
// Fonction pour récupérer les données météorologiques d'une commune
function récupérerMétéo(codeCommune) {
    // Clé API pour accéder au service météorologique
    const cléAPI = 'fcb5f51c5214d3f6eb00a99b82c438fbd7cfefc58a44586c7e1e3af1db18ce79';

    // Effectue une requête fetch vers l'API météo avec le code de la commune et la clé API
    fetch(`https://api.meteo-concept.com/api/forecast/daily?insee=${codeCommune}&token=${cléAPI}`)
        .then(réponse => {
            // Vérifie si la réponse est OK
            if (!réponse.ok) {
                throw new Error('Erreur réseau ou serveur');
            }
            // Convertit la réponse en JSON
            return réponse.json();
        })
        .then(données => afficherMétéo(données)) // Appelle la fonction pour afficher les données météo
        .catch(erreur => {
            // Gère les erreurs en les affichant dans la console
            console.error('Erreur lors de la récupération des données météo:', erreur);
            // Affiche un message d'erreur dans l'élément avec l'ID 'weatherInfo'
            document.getElementById('weatherInfo').textContent = 'Erreur lors de la récupération des données météo.';
        });
}

// Fonction pour afficher les données météorologiques
function afficherMétéo(données) {
    // Sélectionne l'élément avec l'ID 'weatherInfo'
    const infoMétéo = document.getElementById('weatherInfo');

    // Récupère la prévision météo du jour actuel
    const prévision = données.forecast[0];

    // Obtient la date actuelle
    const dateActuelle = new Date();

    // Options pour formater la date en français
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    // Formate la date actuelle en une chaîne lisible
    const dateFormatée = dateActuelle.toLocaleDateString('fr-FR', options);

    // Met à jour le contenu HTML de l'élément 'weatherInfo' avec les données météo
    infoMétéo.innerHTML = `
        <h2>Météo pour ${données.city.name} le ${dateFormatée}</h2>
        <p>Température minimale : ${prévision.tmin}°C</p>
        <p>Température maximale : ${prévision.tmax}°C</p>
        <p>Probabilité de pluie : ${prévision.probarain}%</p>
        <p>Heures d'ensoleillement : ${prévision.sun_hours} heures</p>
    `;
}
