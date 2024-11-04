async function getWeather() {
    let cityInput = document.getElementById('cityInput').value;
    let apiKey = '9060bd1d3a6fb963d29e880953d842ed';
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (! response.ok) throw new Error("city not found");
        const data = await response.json();
        // console.log(data);
        displayWeather(data); 
    } catch (error) {
        document.getElementById('weatherDisplay').innerHTML = `<p>${error.message}</p>`;
    }
}

function displayWeather(data) {
    weatherDisplay = document.getElementById('weatherDisplay');
    const {name, main} = data;
    weatherDisplay.innerHTML = `
        <h2>${name}</h2>
        <p>${main.temp}°C</p>
    `;
    
}