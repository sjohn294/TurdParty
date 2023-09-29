const apiKey = "35c7c95717df17280f8f02d4aaa61f79";
let cityArray = JSON.parse(localStorage.getItem("city-array")) || [];

window.onload = function() {
    localStorage.clear();
};


window.onload = function() {
    localStorage.clear();
};


document.getElementById("search-form").addEventListener("submit", handleSearchSubmit);

function handleSearchSubmit(evt) {
    evt.preventDefault();
    const cityName = document.querySelector("[name='city-input']").value.trim();

    if (isValidCity(cityName)) {
        updateCityArray(cityName);
        createCityButton(cityName);
        getlatlon(cityName);
    }
}

function isValidCity(cityName) {
    return cityName && !cityArray.includes(cityName);
}

function updateCityArray(cityName) {
    cityArray.push(cityName);

    if (cityArray.length >= 4) {
        cityArray = [];
    }

    localStorage.setItem("city-array", JSON.stringify(cityArray));
}

function createCityButton(cityName) {
    const button = document.createElement("button");
    button.textContent = cityName;
    button.classList.add("btn", "btn-secondary", "mb-2", "d-block");
    button.addEventListener("click", () => getlatlon(cityName));
    document.getElementById("search-form").after(button);
}

function getlatlon(cityName) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const { lat, lon, name } = data[0];
            getweather(lat, lon, name);
            getfiveDay(lat, lon);
        })
        .catch(error => console.error("Error fetching location data:", error));
}

function getweather(lat, lon, city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => displayWeatherData(data, city))
        .catch(error => console.error("Error fetching weather data:", error));
}

function displayWeatherData(data, city) {
    $(".city-main").empty();
    const elements = [
        $("<h2>").text(city).append($("<img>").attr("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)),
        $("<p>").text(new Date(data.dt * 1000).toLocaleDateString()),
        $("<p>").text(`Temp: ${Math.round(data.main.temp)} F`),
        $("<p>").text(`Humidity: ${data.main.humidity} %`),
        $("<p>").text(`Wind Speed: ${data.wind.speed} MPH`)
    ];
    $(".city-main").append(...elements);
}

function getfiveDay(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => displayFiveDayForecast(data))
        .catch(error => console.error("Error fetching 5-day forecast:", error));
}

function displayFiveDayForecast(data) {
    const forecastArray = data.list.filter(item => item.dt_txt.endsWith("12:00:00"));
    $("#forecast-row").empty();

    forecastArray.slice(0, 5).forEach(day => {
        const elements = [
            $("<h4>").text(new Date(day.dt * 1000).toLocaleDateString()),
            $("<p>").text(`Temp: ${day.main.temp} F`),
            $("<p>").text(`Humidity: ${day.main.humidity} %`),
            $("<p>").text(`Wind Speed: ${day.wind.speed} MPH`)
        ];

        const col = $("<div>").addClass("col-md-2");
        const card = $("<div>").addClass("card bg-primary");  // Here, make sure to reapply the "bg-primary" class
        card.append($("<div>").addClass("card-body").append(...elements));
        
        $("#forecast-row").append(col.append(card));
    });
}


window.addEventListener("DOMContentLoaded", () => {
    cityArray.forEach(createCityButton);
});
