// Fonction pour récupérer les données météorologiques d'une commune
function récupérerMétéo(codeCommune, days, latitude, longitude, rain, windSpeed, windDirection) {
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
        .then(données => {
            afficherMétéo(données, days, latitude, longitude, rain, windSpeed, windDirection);
            // Masquer le formulaire d'informations
            document.getElementById('infoForm').style.display = 'none';
            // Afficher la section de la météo
            document.getElementById('weatherDisplay').style.display = 'block';
        })
        .catch(erreur => {
            // Gère les erreurs en les affichant dans la console
            console.error('Erreur lors de la récupération des données météo:', erreur);
            // Affiche un message d'erreur dans l'élément avec l'ID 'weatherInfo'
            document.getElementById('weatherInfo').textContent = 'Erreur lors de la récupération des données météo.';
        });
}

// Fonction pour afficher les données météorologiques
function afficherMétéo(données, days, latitude, longitude, rain, windSpeed, windDirection) {
    // Sélectionne l'élément avec l'ID 'weatherDisplay'
    const weatherDisplay = document.getElementById('weatherDisplay');
    const forecastSelect = document.getElementById('forecastSelect');
    const weatherCards = document.getElementById('weatherCards');

    // Récupère les prévisions météo pour les jours sélectionnés
    const prévisions = données.forecast.slice(0, days);

    // Obtient la date actuelle
    const dateActuelle = new Date();

    // Options pour formater la date en français
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    // Initialise le contenu HTML de l'élément 'weatherDisplay'
    let contenuHTML = `<h2>Prévisions pour ${données.city.name}</h2>`;

    // Remplit le menu déroulant avec les dates des prévisions
    forecastSelect.innerHTML = '<option value="">--Sélectionnez une date--</option>';
    prévisions.forEach((prévision, index) => {
        const datePrévision = new Date(dateActuelle);
        datePrévision.setDate(dateActuelle.getDate() + index);
        const datePrévisionFormatée = datePrévision.toLocaleDateString('fr-FR', options);
        forecastSelect.innerHTML += `<option value="${index}">${datePrévisionFormatée}</option>`;
    });

    // Affiche le menu déroulant
    forecastSelect.style.display = 'block';

    // Ajoute un écouteur d'événement pour détecter les changements dans le menu déroulant
    forecastSelect.addEventListener('change', function() {
        const selectedIndex = this.value;
        if (selectedIndex !== "") {
            const prévision = prévisions[selectedIndex];
            const datePrévision = new Date(dateActuelle);
            datePrévision.setDate(dateActuelle.getDate() + parseInt(selectedIndex));
            const datePrévisionFormatée = datePrévision.toLocaleDateString('fr-FR', options);

            const weatherCard = `
                <div class="weather-card" id="weather-card-${selectedIndex}">
                	<h2>Prévisions pour ${données.city.name}</h2>
                    <h3><p>Température minimale : ${prévision.tmin}°C</p>
                    <p>Température maximale : ${prévision.tmax}°C</p>
                    <p>Probabilité de pluie : ${prévision.probarain}%</p>
                    <p>Heures d'ensoleillement : ${prévision.sun_hours} heures</p></h3>
                    ${latitude ? `<h3><p>Latitude : ${données.city.latitude}</p></h3>` : ''}
                    ${longitude ? `<h3><p>Longitude : ${données.city.longitude}</p></h3>` : ''}
                    ${rain ? `<h3><p>Cumul de pluie : ${prévision.rr10} mm</p></h3>` : ''}
                    ${windSpeed ? `<h3><p>Vent moyen : ${prévision.wind10m} km/h</p></h3>` : ''}
                    ${windDirection ? `<h3><p>Direction du vent : ${prévision.dirwind10m}°</p></h3>` : ''}
                </div>
            `;

            // Met à jour le contenu HTML de l'élément 'weatherCards' avec la carte météo sélectionnée
            weatherCards.innerHTML = weatherCard;

            // Appliquer le fond en fonction de la probabilité de pluie et des heures d'ensoleillement
            applyBackground(prévision.probarain, prévision.sun_hours, selectedIndex);
        }
    });

    // Affiche le bouton de rafraîchissement
    document.getElementById('refreshButton').style.display = 'block';
}

function applyBackground(probarain, sun_hours, cardId) {
    let backgroundImage;
    let textColorClass;

    // Déterminez l'image de fond en fonction de la probabilité de pluie et des heures d'ensoleillement
    if (probarain > 90 && sun_hours <= 2) {
        backgroundImage = 'url("IMAGES/grandepluie.png")';
        textColorClass = 'text-blanc';
    } else if (probarain > 70 && sun_hours <= 4) {
        backgroundImage = 'url("IMAGES/pluie_fort.png")';
        textColorClass = 'text-blanc';
    } else if (probarain > 40 && sun_hours <= 6) {
        backgroundImage = 'url("IMAGES/pluie.png")';
        textColorClass = 'text-noir';
    } else if (sun_hours > 10 && probarain <= 10) {
        backgroundImage = 'url("IMAGES/grandsoleil.png")';
        textColorClass = 'text-noir';
    } else if (sun_hours > 8 && probarain <= 20) {
        backgroundImage = 'url("IMAGES/soleil.png")';
        textColorClass = 'text-blanc';
    } else if (sun_hours > 6 && probarain <= 30) {
        backgroundImage = 'url("IMAGES/partiellement_nuageux.png")';
        textColorClass = 'text-noir';
    } else if (sun_hours > 4 && probarain <= 40) {
        backgroundImage = 'url("IMAGES/nuageux_clair.png")';
        textColorClass = 'text-noir';
    } else if (sun_hours > 2 && probarain <= 50) {
        backgroundImage = 'url("IMAGES/nuageux.png")';
        textColorClass = 'text-blanc';
    } else {
        backgroundImage = 'url("IMAGES/couvert.png")';
        textColorClass = 'text-blanc';
    }
    const weatherCard = document.getElementById(`weather-card-${cardId}`);
    weatherCard.style.backgroundImage = backgroundImage;

    // Retirez toutes les classes de couleur existantes
    weatherCard.classList.remove('text-blanc', 'text-noir');

    // Ajoutez la nouvelle classe de couleur
    weatherCard.classList.add(textColorClass);
}

document.getElementById('days').addEventListener('input', function() {
    const daysValue = document.getElementById('daysValue');
    daysValue.textContent = this.value + ' jour' + (this.value > 1 ? 's' : '');
});

// Ajoute un écouteur d'événement pour détecter les clics sur le bouton "Afficher les prévisions"
document.getElementById('showForecast').addEventListener('click', function() {
    // Récupère le code de la ville sélectionnée
    const codeVilleSélectionnée = document.getElementById('citySelect').value;

    // Récupère les valeurs des nouveaux champs du formulaire
    const days = parseInt(document.getElementById('days').value);
    const latitude = document.getElementById('latitude').checked;
    const longitude = document.getElementById('longitude').checked;
    const rain = document.getElementById('rain').checked;
    const windSpeed = document.getElementById('windSpeed').checked;
    const windDirection = document.getElementById('windDirection').checked;

    // Vérifie si une ville a été sélectionnée
    if (codeVilleSélectionnée) {
        // Appelle la fonction pour récupérer la météo de la ville sélectionnée
        récupérerMétéo(codeVilleSélectionnée, days, latitude, longitude, rain, windSpeed, windDirection);
    } else {
        // Affiche une alerte si aucune ville n'est sélectionnée
        alert('Veuillez sélectionner une ville.');
    }
});

// Ajoute un écouteur d'événement pour le bouton de rafraîchissement
document.getElementById('refreshButton').addEventListener('click', function() {
    // Rafraîchit la page
    location.reload();
});
