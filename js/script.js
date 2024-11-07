// 
const select = document.getElementById('select');
let selectedCity = '';

async function fetchCapitals() {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const countries = await response.json();

    countries.forEach(country => {
        if (country.capital && country.flags && country.capital[0].toLowerCase() !== 'jerusalem') {
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

function selectCity(city) {
    selectedCity = city;
    document.querySelector('.dropdown-btn').textContent = city;
    toggleDropdown();
}
function toggleDropdown() {
    select.classList.toggle('show');
}

// 
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
function displayCurrentWeather(data) {
    const weatherDisplay = document.getElementById('weatherDisplay');
    const weatherInfo = getWeatherIconClass(data.weather[0].icon);

    weatherDisplay.innerHTML = `
        <p class='temp'>${Math.round(data.main.temp)}°</p>
        <i class="wi ${weatherInfo.icon}" style="color: ${weatherInfo.color}; font-size: 50px;"></i>
        <p>${data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)}</p>
        <p>H: ${Math.round(data.main.temp_max)}°   L: ${Math.round(data.main.temp_min)}°</p>

        <div class='humidityWind'>
            <p class='humidity'><span>${data.main.humidity}%</span> <br> Humidity</p>
            <p class='wind'><span>${data.wind.speed} km/h</span> <br> Wind speed</p>
        </div>
    `;
}


// 
async function getFiveDayWeather(data) {
    const { lat, lon } = data.coord;
    const apiKey = '9060bd1d3a6fb963d29e880953d842ed'; 
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const dataFiveDay = await response.json();
        console.log(dataFiveDay);  
        displayFiveDayWeather(dataFiveDay); 
    } catch (error) {
        console.error('Error fetching 5-day weather:', error);
    }
}
// 
function getWeatherIconClass(icon) {
    const iconMapping = {
        "01d": { icon: "wi-day-sunny", color: "#FFD700" }, // Sunny day (gold)
        "01n": { icon: "wi-night-clear", color: "#B0C4DE" }, // Clear night (light steel blue)
        "02d": { icon: "wi-day-cloudy", color: "#FFEB3B" }, // Partly cloudy day (light yellow)
        "02n": { icon: "wi-night-alt-cloudy", color: "#C0C0C0" }, // Partly cloudy night (silver)
        "03d": { icon: "wi-cloud", color: "#808080" }, // Cloudy (gray)
        "03n": { icon: "wi-cloud", color: "#696969" },
        "04d": { icon: "wi-cloudy", color: "#A9A9A9" }, // Overcast (dark gray)
        "04n": { icon: "wi-cloudy", color: "#A9A9A9" },
        "09d": { icon: "wi-showers", color: "#4682B4" }, // Rain showers (steel blue)
        "09n": { icon: "wi-showers", color: "#4682B4" },
        "10d": { icon: "wi-day-rain", color: "#1E90FF" }, // Rainy day (dodger blue)
        "10n": { icon: "wi-night-rain", color: "#1E90FF" },
        "11d": { icon: "wi-thunderstorm", color: "#FFA500" }, // Thunderstorm (orange)
        "11n": { icon: "wi-thunderstorm", color: "#FFA500" },
        "13d": { icon: "wi-snow", color: "#ADD8E6" }, // Snowy (light blue)
        "13n": { icon: "wi-snow", color: "#ADD8E6" },
        "50d": { icon: "wi-fog", color: "#778899" }, // Fog (light slate gray)
        "50n": { icon: "wi-fog", color: "#778899" }
    };
    return iconMapping[icon] || { icon: "wi-na", color: "#FFFFFF" }; // Default icon
}

function displayFiveDayWeather(dataFiveDay) {
    const weekData = document.getElementById('weekData');
    weekData.innerHTML = `<h3>5-day Forecast</h3>`;

    let displayedDates = [];

    dataFiveDay.list.forEach((entry, index) => {
        const date = new Date(entry.dt * 1000);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
        const displayDay = index === 0 ? "Today" : dayOfWeek;
        const weatherInfo = getWeatherIconClass(entry.weather[0].icon);

        if (!displayedDates.includes(dayOfWeek)) {
            const temp_min = Math.round(entry.main.temp_min);
            const temp_max = Math.round(entry.main.temp_max);
            const description = entry.weather[0].description.charAt(0).toUpperCase() + entry.weather[0].description.slice(1);

            weekData.innerHTML += `
                <div class="forecast-entry">
                    <p>${displayDay}</p>
                    <i class="wi ${weatherInfo.icon}" style="color: ${weatherInfo.color}; font-size: 40px;"></i>
                    <p>${temp_min}°  ${temp_max}</p>
                </div>
            `;

            displayedDates.push(dayOfWeek);
        }
    });
}
window.onload = fetchCapitals;
