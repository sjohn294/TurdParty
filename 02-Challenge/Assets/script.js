var apiKey = "35c7c95717df17280f8f02d4aaa61f79"
document.getElementById("search-form").addEventListener("submit", function (evt) {
    evt.preventDefault()
    var cityName = $("[name='city-input']").val()
    getlatlon(cityName)
})

function getlatlon(cityName) {
    console.log(cityName)
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`).then(function (response) {
        console.log(response)
        if (response.ok === false) {
            alert("apikey not authorized")
            return;
        }
        return response.json()
    }).then(function (data) {
        console.log(data)
        var lat = data[0].lat;
        var lon = data[0].lon;
        var city = data[0].name;
        getweather(lat, lon, city);
        getfiveDay(lat, lon);
        
    })
    
}

function getweather(lat, lon, city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        var cardTitle= $("<h2>").text(city);
        var temp= $("<p>").text(`Temp:${data.main.temp} F`);
        var humidity= $("<p>").text(`Humidity: ${data.main.humidity} %`);
        var windSpeed= $("<p>").text(`Wind Speed: ${data.wind.speed} MPH`)
        var currentDate = new Date(data.dt *1000);
        var date= $("<p>").text(`Date: ${currentDate.toLocaleDateString()}`);
        
        
        $(".city-main").append(cardTitle,temp, humidity, windSpeed, date);
    })
    .catch(error =>{
        console.error("Problem Getting Weather Data:", error);
    });
}

function getfiveDay(lat,lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        for (let i= 0; i<5; i++) {
            var fiveDay= data.list[i*8];

            var fivedayCard= $(`.container .row .col-md-2:nth-child(${i+1}) .card-body`);
            fivedayCard.empty();

            var fivecardDate= $("<h4>").text(new Date(fiveDay.dt * 1000).toLocaleDateString());
            var fivecardTemp= $("<p>").text(`Temp: ${fiveDay.main.temp} F`);
            var fivecardHumidity= $("<p>").text(`Humidity: ${fiveDay.main.humidity} %`);
            var fivecardWind= $("<p>").text(`Wind Speed: ${fiveDay.wind.speed} MPH`);

            fivedayCard.append(fivecardDate, fivecardTemp, fivecardHumidity, fivecardWind);
            
        }
    })
    .catch(error => {
        console.error("Problem Getting Weather Data:", error);
    });
}


const savedArray = JSON.parse(localStorage.getItem("savedArray")) || [];

function storeSearchAsButton(cityName) {
    if (!savedArray.includes(cityName)) {
        savedArray.push(cityName);
        localStorage.setItem("savedArray", JSON.stringify(savedArray));
        
        const button = document.createElement("button");
        button.textContent = cityName;
        button.classList.add("btn", "btn-secondary", "mb-2");
        button.addEventListener("click", () => getLatLon(cityName));
        document.getElementById("input-list").appendChild(button);
    }
}

savedArray.forEach(storeSearchAsButton);