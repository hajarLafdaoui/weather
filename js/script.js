const select = document.getElementById('select');
let selectedCity = '';

// Fetch capital cities and their data
async function fetchCapitals() {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const countries = await response.json();

    countries.forEach(country => {
        if (country.capital && country.flags && country.capital !== 'Jerusalem') {
            let option = document.createElement('div');
            option.classList.add('dropdown-item');
            option.setAttribute('data-capital', country.capital[0]);
            option.innerHTML = `
                <p>${country.name.common} - ${country.capital[0]}</p>
                <img src='${country.flags.png}' width='20px' height='15px'>
            `;
            select.append(option);

            option.onclick = () => selectCity(country.capital[0]);
        }
    });
}

// Set the selected city and toggle dropdown visibility
function selectCity(city) {
    selectedCity = city;
    document.querySelector('.dropdown-btn').textContent = city;
    toggleDropdown();
}

// Toggle the visibility of the dropdown
function toggleDropdown() {
    select.classList.toggle('show');
}

// Fetch current weather based on the selected city
async function getWeather() {
    if (!selectedCity) return alert('Please select a city first');

    const apiKey = '9060bd1d3a6fb963d29e880953d842ed';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("City not found");
        const data = await response.json();
        console.log(data);

        displayCurrentWeather(data);
        getFiveDayWeather(data);
    } catch (error) {
        document.getElementById('weatherDisplay').innerHTML = `<p>${error.message}</p>`;
    }
}

// Display the current weather
function displayCurrentWeather(data) {
    const weatherDisplay = document.getElementById('weatherDisplay');
    weatherDisplay.innerHTML = `
        <h3>Current Weather</h3>
        <p>${data.name}: ${Math.round(data.main.temp)}°C</p>
        <p>${data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)}</p>
    `;
}

// Fetch 5-day weather data (every 3 hours)
// Fetch 5-day weather data (every 3 hours)
async function getFiveDayWeather(data) {
    const { lat, lon } = data.coord;
    const apiKey = '9060bd1d3a6fb963d29e880953d842ed'; // Your API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const dataFiveDay = await response.json();
        console.log(dataFiveDay);  // Ensure the 5-day forecast data is logged here

        displayFiveDayWeather(dataFiveDay); // Pass the data directly to displayFiveDayWeather
    } catch (error) {
        console.error('Error fetching 5-day weather:', error);
    }
}

// Display the 5-day weather forecast (every 3 hours), but only once per day
function displayFiveDayWeather(dataFiveDay) {
    const weekData = document.getElementById('weekData');
    weekData.innerHTML = `<h3>5-day Forecast</h3>`;

    let displayedDates = []; // To keep track of the displayed dates

    dataFiveDay.list.forEach(entry => {
        const date = new Date(entry.dt * 1000);  // Convert timestamp to date
        const dateString = date.toLocaleDateString();

        // Only display one entry per date
        if (!displayedDates.includes(dateString)) {
            const time = date.toLocaleTimeString();
            const temp = Math.round(entry.main.temp);
            const description = entry.weather[0].description.charAt(0).toUpperCase() + entry.weather[0].description.slice(1);

            weekData.innerHTML += `
                <div class="forecast-entry">
                    <h4>${dateString}</h4>
                    <p>Temperature: ${temp}°C</p>
                    <p>Weather: ${description}</p>
                </div>
            `;

            // Mark this date as displayed
            displayedDates.push(dateString);
        }
    });
}


// Load capital cities on page load
window.onload = fetchCapitals;
