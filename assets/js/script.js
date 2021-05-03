const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const currentWeather = document.querySelector("#current-weather");
const forecastSection = document.querySelector("#forecast-weather");
const searchHistoryEl = document.querySelector("#search-history");

let searchHistory = [];

let getWeatherData = function (city) {
    let cityName = city[0].toUpperCase() + city.substring(1);
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=ed354f779244a6744d2f5aac5c1c88cd")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let lat = data.coord.lat;
            let lon = data.coord.lon;
            fetch(
                "https://api.openweathermap.org/data/2.5/onecall?lat=" +
                    lat +
                    "&lon=" +
                    lon +
                    "&units=imperial&exclude=minutely&appid=ed354f779244a6744d2f5aac5c1c88cd"
            )
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    createCurrentWeather(data, cityName);
                    createForecastCards(data);
                });
        });
};

let createCurrentWeather = function (weatherData, city) {
    currentWeather.textContent = "";
    let currentDate = document.createElement("h2");
    let currentTemp = document.createElement("p");
    let currentWind = document.createElement("p");
    let currentHumidity = document.createElement("p");
    let currentUvi = document.createElement("p");

    currentDate.innerHTML =
        city +
        ", " +
        dateConvert(weatherData.current.dt) +
        " " +
        "<img src='http://openweathermap.org/img/wn/" +
        weatherData.current.weather[0].icon +
        "@2x.png'/>";
    currentTemp.innerHTML = "Temperature: " + weatherData.current.temp + " &deg;F";
    currentWind.textContent = "Wind Speed: " + weatherData.current.wind_speed + "mph";
    currentHumidity.textContent = "Humidity: " + weatherData.current.humidity + "%";
    currentUvi.textContent = "UV Index: " + weatherData.current.uvi;

    currentWeather.appendChild(currentDate);
    currentWeather.appendChild(currentTemp);
    currentWeather.appendChild(currentWind);
    currentWeather.appendChild(currentHumidity);
    currentWeather.appendChild(currentUvi);
};

let createForecastCards = function (weatherData) {
    forecastSection.textContent = "";
    for (let i = 1; i < 6; i++) {
        let forecastDayCard = document.createElement("div");
        let forecastDate = document.createElement("h3");
        let forecastIcon = document.createElement("img");
        let forecastTemp = document.createElement("p");
        let forecastWind = document.createElement("p");
        let forecastHumidity = document.createElement("p");

        forecastDayCard.className = "weather-card";
        forecastDate.innerHTML = dateConvert(weatherData.daily[i].dt);
        forecastIcon.setAttribute(
            "src",
            "http://openweathermap.org/img/wn/" + weatherData.daily[i].weather[0].icon + "@2x.png"
        );
        forecastTemp.innerHTML = "Temperature: " + weatherData.daily[i].temp.day + " &deg;F";
        forecastWind.textContent = "Wind Speed: " + weatherData.daily[i].wind_speed + " mph";
        forecastHumidity.textContent = "Humidity: " + weatherData.daily[i].humidity + "%";

        forecastDayCard.appendChild(forecastDate);
        forecastDayCard.appendChild(forecastIcon);
        forecastDayCard.appendChild(forecastTemp);
        forecastDayCard.appendChild(forecastWind);
        forecastDayCard.appendChild(forecastHumidity);

        forecastSection.appendChild(forecastDayCard);
    }
};

let dateConvert = function (time) {
    let milliseconds = time * 1000;
    let newDate = new Date(milliseconds);
    let dateString =
        newDate.toLocaleString("en-US", { month: "numeric" }) +
        "/" +
        newDate.toLocaleString("en-US", { day: "numeric" }) +
        "/" +
        newDate.toLocaleString("en-US", { year: "numeric" });
    return dateString;
};

let saveLocations = function () {
    localStorage.setItem("locations", JSON.stringify(searchHistory));
};

let loadLocations = function () {
    searchHistoryEl.textContent = "";
    searchHistory = JSON.parse(localStorage.getItem("locations")) || [];
    for (let i = 0; i < searchHistory.length; i++) {
        let historyEl = document.createElement("button");
        historyEl.className = "history-btn";
        historyEl.textContent = searchHistory[i];
        searchHistoryEl.appendChild(historyEl);
    }
};

loadLocations();

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let cityName = searchInput.value[0].toUpperCase() + searchInput.value.substring(1);
    if (searchInput.value) {
        getWeatherData(cityName);
        if (searchHistory.length < 10) {
            searchHistory.push(cityName);
        } else {
            searchHistory.shift();
            searchHistory.push(cityName);
        }
    }
    saveLocations();
    loadLocations();
    searchForm.reset();
});

searchHistoryEl.addEventListener("click", function (event) {
    if (event.target.className === "history-btn") {
        getWeatherData(event.target.textContent);
    }
});
