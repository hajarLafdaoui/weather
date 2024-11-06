// 
const select = document.getElementById('select');
let selectedCity = '';

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
    weatherDisplay.innerHTML = `
        <!--<p>${data.name}</p> -->
        <p class='temp'>${Math.round(data.main.temp)}°</p>
        <p>${data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)}</p>
        <p>H: ${Math.round(data.main.temp_max)}°   L:${Math.round(data.main.temp_min)}°</p>

        <div class='humidityWind'>
            <p class='humdity'><span>${data.main.humidity}%</span> <br> Humidity</p>
            <p class='wind'><span>${data.wind.speed}km/h</span> <br> Wind speed</p>
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
function displayFiveDayWeather(dataFiveDay) {
    const weekData = document.getElementById('weekData');
    weekData.innerHTML = `<h3>5-day Forecast</h3>`;

    let displayedDates = []; 

    dataFiveDay.list.forEach((entry, index) => {
        const date = new Date(entry.dt * 1000);
        
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });

        const displayDay = index === 0 ? "Today" : dayOfWeek;

        if (!displayedDates.includes(dayOfWeek)) {
            const temp = Math.round(entry.main.temp);
            const description = entry.weather[0].description.charAt(0).toUpperCase() + entry.weather[0].description.slice(1);

            weekData.innerHTML += `
                <div class="forecast-entry">
                    <p>${displayDay}</p>
                    <p>${temp}°</p>
                   <!-- <p>${description}</p> -->
                </div>
            `;

            displayedDates.push(dayOfWeek);
        }
    });
}

window.onload = fetchCapitals;
