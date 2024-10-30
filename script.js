document.addEventListener('DOMContentLoaded', () => {
    const apiURL = 'https://restcountries.com/v3.1/all';
    const searchBar = document.getElementById('searchBar');
    const countryList = document.getElementById('countryList');
    const favoritesList = document.getElementById('favoritesList');
    const favoritesCount = document.getElementById('favoritesCount');
    const regionFilter = document.getElementById('regionFilter');
    const languageFilter = document.getElementById('languageFilter');
    let countries = [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            countries = data;
            displayCountries(countries);
        })
        .catch(error => console.error('Error fetching countries:', error));
    function displayCountries(countries) {
        countryList.innerHTML = '';
        countries.forEach(country => {
            const card = document.createElement('div');
            card.classList.add('country-card');
            card.innerHTML = `
                <h2>${country.name.common}</h2>
                <img src="${country.flags.svg}" alt="Flag of ${country.name.common}">
                <p>Capital: ${country.capital ? country.capital[0] : 'N/A'}</p>
                <p>Region: ${country.region}</p>
                <button onclick="addToFavorites('${country.name.common}')">❤️   Add to Favorites</button>
                <button onclick="showDetails('${country.name.common}')">View Details</button>
            `;
            countryList.appendChild(card);
        });
    }
    function filterCountries() {
        const selectedRegion = regionFilter.value;
        const selectedLanguage = languageFilter.value;
        let filteredCountries = countries;
        if (selectedRegion) {
            filteredCountries = filteredCountries.filter(country => country.region === selectedRegion);
        }
        if (selectedLanguage) {
            filteredCountries = filteredCountries.filter(country => {
                const languages = Object.values(country.languages || {});
                return languages.includes(selectedLanguage);
            });
        }
        displayCountries(filteredCountries);
    }
    regionFilter.addEventListener('change', filterCountries);
    languageFilter.addEventListener('change', filterCountries);
    window.showDetails = function(countryName) {
        fetch(`https://restcountries.com/v3.1/name/${countryName}`)
            .then(response => response.json())
            .then(data => {
                const country = data[0];
                const details = `
                    <h2>${country.name.common}</h2>
                    <img src="${country.flags.svg}" alt="Flag of ${country.name.common}">
                    <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
                    <p><strong>Region:</strong> ${country.region}</p>
                    <p><strong>Population:</strong> ${country.population}</p>
                    <p><strong>Languages:</strong> ${country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</p>
                `;
                document.getElementById('countryDetails').innerHTML = details;
                countryList.style.display = 'none';
                document.getElementById('countryDetails').style.display = 'block';
                document.querySelector('.back-btn').style.display = 'block';
            })
            .catch(error => console.error('Error fetching country details:', error));
    };
    window.addToFavorites = function(countryName) {
        if (!favorites.includes(countryName)) {
            favorites.push(countryName);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            favoritesCount.innerText = favorites.length;
            showFavorites();
        }
    };
    window.removeFromFavorites = function(countryName) {
        favorites = favorites.filter(name => name !== countryName);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        favoritesCount.innerText = favorites.length;
        showFavorites();
    };
    window.showFavorites = function() {
        favoritesList.innerHTML = '';
        favorites.forEach((countryName, index) => {
            const country = countries.find(c => c.name.common === countryName);
            if (country) {
                const card = document.createElement('div');
                card.classList.add('country-card');
                card.innerHTML = `
                    <h2>${index + 1}. ${country.name.common}</h2>
                    <img src="${country.flags.svg}" alt="Flag of ${country.name.common}">
                    <p>Capital: ${country.capital ? country.capital[0] : 'N/A'}</p>
                    <p>Region: ${country.region}</p>
                    <button onclick="removeFromFavorites('${country.name.common}')">:rubbish_bin: Remove from Favorites</button>
                `;
                favoritesList.appendChild(card);
            }
        });
        document.getElementById('mainContent').style.display = 'none';
        document.getElementById('favoritesPage').style.display = 'block';
    };
    window.goBack = function() {
        document.getElementById('countryDetails').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        document.querySelector('.back-btn').style.display = 'none';
    };
    window.goBackToMain = function() {
        document.getElementById('favoritesPage').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
    };
    searchBar.addEventListener('input', () => {
        const searchTerm = searchBar.value.toLowerCase();
        const filteredCountries = countries.filter(country =>
            country.name.common.toLowerCase().includes(searchTerm)
        );
        displayCountries(filteredCountries);
    });
});
