const select = document.getElementById('select');
let selectedCity = '';


async function fetchCapitals() {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const countries = await response.json();

    countries.forEach(country => {
        if (country.capital && country.flags) {
            let option = document.createElement('div');
            option.classList.add('dropdown-item');
            // store the selected capital city’s name within each dropdown item
            option.setAttribute('data-capital', country.capital[0]);
            option.innerHTML = `${country.name.common} - ${country.capital[0]} <img src='${country.flags.png}' width='20px' height='15px'>`;
            select.append(option);

            option.onclick = () => selectCity(country.capital[0]);
        }
    });
}

function selectCity(city) {
    selectedCity = city;
    document.querySelector('.dropdown-btn').textContent = city;
    toggleDropdown()
}

function toggleDropdown() {
    select.classList.toggle('show');
}


async function getWeather() {
    if (!selectedCity) return alert('Please select a city first');
    
    const apiKey = '9060bd1d3a6fb963d29e880953d842ed';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("City not found");
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        document.getElementById('weatherDisplay').innerHTML = `<p>${error.message}</p>`;
    }
}

function displayWeather(data) {
    const weatherDisplay = document.getElementById('weatherDisplay');
    const { name, main } = data;
    weatherDisplay.innerHTML = `
        <h2>${name}</h2>
        <p>Temperature: ${main.temp}°C</p>
    `;
}

// Load capitals on page load
window.onload = fetchCapitals;