// Fonction pour convertir les températures de Celsius en Fahrenheit
function convertToFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
}

// Fonction pour changer la langue de l'application
function switchLanguage() {
    // Récupère la langue actuelle de la page
    const currentLang = document.documentElement.lang;
    // Définit la nouvelle langue en fonction de la langue actuelle
    const newLang = currentLang === 'fr' ? 'en' : 'fr';
    document.documentElement.lang = newLang;

    // Met à jour les éléments de texte en fonction de la nouvelle langue
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[newLang][key]) {
            element.textContent = translations[newLang][key];
        }
    });

    // Met à jour les options de sélection pour la ville et la date
    const citySelect = document.getElementById('citySelect');
    if (citySelect) {
        citySelect.options[0].textContent = translations[newLang].selectCityOption;
    }

    const forecastSelect = document.getElementById('forecastSelect');
    if (forecastSelect) {
        forecastSelect.options[0].textContent = translations[newLang].selectDateOption;
    }

    // Convertit les températures en Fahrenheit si la nouvelle langue est l'anglais
    if (newLang === 'en') {
        convertTemperaturesToFahrenheit();
    }
}

// Fonction pour convertir les températures affichées en Fahrenheit
function convertTemperaturesToFahrenheit() {
    // Sélectionne tous les éléments contenant des températures et les convertit en Fahrenheit
    const tempElements = document.querySelectorAll('.temperature');
    tempElements.forEach(element => {
        const tempInCelsius = parseFloat(element.textContent);
        const tempInFahrenheit = convertToFahrenheit(tempInCelsius);
        element.textContent = tempInFahrenheit.toFixed(1) + translations.en.fahrenheit;
    });
}

// Ajoute un écouteur d'événement pour le bouton de changement de langue
document.getElementById('switch-language').addEventListener('click', switchLanguage);

// Fonction pour récupérer les données météorologiques d'une commune à partir d'une API
function récupérerMétéo(codeCommune, days, latitude, longitude, rain, windSpeed, windDirection) {
    // Token API pour accéder aux données météorologiques
    const cléAPI = 'fcb5f51c5214d3f6eb00a99b82c438fbd7cfefc58a44586c7e1e3af1db18ce79';

    // Effectue une requête pour obtenir les données météorologiques
    fetch(`https://api.meteo-concept.com/api/forecast/daily?insee=${codeCommune}&token=${cléAPI}`)
        .then(réponse => {
            if (!réponse.ok) {
                throw new Error(translations[document.documentElement.lang].networkError);
            }
            return réponse.json();
        })
        .then(données => {
            // Affiche les données météorologiques et masques le formulaire d'informations
            afficherMétéo(données, days, latitude, longitude, rain, windSpeed, windDirection);
            document.getElementById('infoForm').style.display = 'none';
            document.getElementById('weatherDisplay').style.display = 'block';
        })
        .catch(erreur => {
            console.error('Erreur:', erreur);
            // Affiche un message d'erreur si la récupération des données échoue
            document.getElementById('weatherInfo').textContent = translations[document.documentElement.lang].weatherDataError;
        });
}

// Fonction pour afficher les données météorologiques
function afficherMétéo(données, days, latitude, longitude, rain, windSpeed, windDirection) {
    // Récupère les éléments du DOM pour afficher les prévisions
    const forecastSelect = document.getElementById('forecastSelect');
    const weatherCards = document.getElementById('weatherCards');
    // Récupère les prévisions pour le nombre de jours spécifié
    const prévisions = données.forecast.slice(0, days);
    const dateActuelle = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    // Remplit la liste déroulante avec les dates des prévisions
    forecastSelect.innerHTML = `<option value="" data-key="selectDateOption">${translations[document.documentElement.lang].selectDateOption}</option>`;
    prévisions.forEach((prévision, index) => {
        const datePrévision = new Date(dateActuelle);
        datePrévision.setDate(dateActuelle.getDate() + index);
        const datePrévisionFormatée = datePrévision.toLocaleDateString(document.documentElement.lang === 'fr' ? 'fr-FR' : 'en-US', options);
        forecastSelect.innerHTML += `<option value="${index}">${datePrévisionFormatée}</option>`;
    });

    forecastSelect.style.display = 'block';

    // Ajoute un écouteur d'événement pour afficher les détails de la météo sélectionnée
    forecastSelect.addEventListener('change', function() {
        const selectedIndex = this.value;
        if (selectedIndex !== "") {
            const prévision = prévisions[selectedIndex];
            const datePrévision = new Date(dateActuelle);
            datePrévision.setDate(dateActuelle.getDate() + parseInt(selectedIndex));
            const datePrévisionFormatée = datePrévision.toLocaleDateString(document.documentElement.lang === 'fr' ? 'fr-FR' : 'en-US', options);

            // Définit l'unité de température en fonction de la langue
            const tempUnit = document.documentElement.lang === 'en' ? translations.en.fahrenheit : translations.fr.celsius;
            const tmin = document.documentElement.lang === 'en' ? convertToFahrenheit(prévision.tmin).toFixed(1) : prévision.tmin;
            const tmax = document.documentElement.lang === 'en' ? convertToFahrenheit(prévision.tmax).toFixed(1) : prévision.tmax;

            // Crée une carte météo avec les informations pertinentes
            const weatherCard = `
                <div class="weather-card" id="weather-card-${selectedIndex}">
                    <h2>${translations[document.documentElement.lang].forecastFor} ${données.city.name}</h2>
                    <h3>
                        <p>${translations[document.documentElement.lang].minTemp} : ${tmin}${tempUnit}</p>
                        <p>${translations[document.documentElement.lang].maxTemp} : ${tmax}${tempUnit}</p>
                        <p>${translations[document.documentElement.lang].rainProb} : ${prévision.probarain}%</p>
                        <p>${translations[document.documentElement.lang].sunHours} : ${prévision.sun_hours}</p>
                    </h3>
                    ${latitude ? `<h3><p>Latitude : ${données.city.latitude}</p></h3>` : ''}
                    ${longitude ? `<h3><p>Longitude : ${données.city.longitude}</p></h3>` : ''}
                    ${rain ? `<h3><p>${translations[document.documentElement.lang].rain} : ${prévision.rr10} mm</p></h3>` : ''}
                    ${windSpeed ? `<h3><p>${translations[document.documentElement.lang].avgWind} : ${prévision.wind10m} km/h</p></h3>` : ''}
                    ${windDirection ? `<h3><p>${translations[document.documentElement.lang].windDirection} : ${prévision.dirwind10m}°</p></h3>` : ''}
                </div>
            `;

            weatherCards.innerHTML = weatherCard;
            // Applique un arrière-plan en fonction des conditions météo
            applyBackground(prévision.probarain, prévision.sun_hours, selectedIndex);
        }
    });

    document.getElementById('refreshButton').style.display = 'block';
}

// Fonction pour appliquer un arrière-plan en fonction des conditions météo
function applyBackground(probarain, sun_hours, cardId) {
    let backgroundImage;
    let textColorClass;

    // Définit l'image de fond et la couleur du texte en fonction des conditions météo
    if (probarain > 90 && sun_hours <= 2) {
        backgroundImage = 'url("IMAGES/grandepluie.png")';
        textColorClass = 'text-blanc';
    } else if (probarain > 70 && sun_hours <= 4) {
        backgroundImage = 'url("IMAGES/pluie_fort.png")';
        textColorClass = 'text-blanc';
    } else if (probarain > 40 && sun_hours <= 6) {
        backgroundImage = 'url("IMAGES/pluie.png")';
        textColorClass = 'text-blanc';
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

    // Applique l'image de fond et la couleur du texte à la carte météo
    const weatherCard = document.getElementById(`weather-card-${cardId}`);
    weatherCard.style.backgroundImage = backgroundImage;
    weatherCard.classList.remove('text-blanc', 'text-noir');
    weatherCard.classList.add(textColorClass);
}

// Ajoute un écouteur d'événement pour mettre à jour la valeur affichée du nombre de jours
document.getElementById('days').addEventListener('input', function() {
    const daysValueElement = document.getElementById('daysValue');
    const days = parseInt(this.value);
    const currentLang = document.documentElement.lang;

    // Met à jour le texte en fonction du nombre de jours
    if (days === 1) {
        daysValueElement.textContent = `${days} ${translations[currentLang].days}`;
    } else {
        daysValueElement.textContent = `${days} ${translations[currentLang].daysPlural}`;
    }
});

// Ajoute un écouteur d'événement pour afficher les prévisions météo
document.getElementById('showForecast').addEventListener('click', function() {
    // Récupère les valeurs des champs du formulaire
    const codeVilleSélectionnée = document.getElementById('citySelect').value;
    const days = parseInt(document.getElementById('days').value);
    const latitude = document.getElementById('latitude').checked;
    const longitude = document.getElementById('longitude').checked;
    const rain = document.getElementById('rain').checked;
    const windSpeed = document.getElementById('windSpeed').checked;
    const windDirection = document.getElementById('windDirection').checked;

    if (codeVilleSélectionnée) {
        // Masque le bouton de changement de langue et récupère les données météo
        document.getElementById('switch-language').style.display = 'none';
        récupérerMétéo(codeVilleSélectionnée, days, latitude, longitude, rain, windSpeed, windDirection);
    } else {
        // Affiche une alerte si aucune ville n'est sélectionnée
        alert(translations[document.documentElement.lang].selectCity);
    }
});

// Ajoute un écouteur d'événement pour rafraîchir la page
document.getElementById('refreshButton').addEventListener('click', function() {
    location.reload();
});