const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const currentWeather = document.querySelector("#current-weather");
const forecastSection = document.querySelector("#forecast-weather");

let getWeatherData = function (city) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=ed354f779244a6744d2f5aac5c1c88cd")
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
                    createForecastCards(data);
                });
        });
};

let createForecastCards = function (weatherData) {
    forecastSection.textContent = "";
    for (let i = 1; i < 6; i++) {
        let forecastDayCard = document.createElement("div");
        let forecastDate = document.createElement("h3");
        // let forecastIcon
        let forecastTemp = document.createElement("p");
        let forecastWind = document.createElement("p");
        let forecastHumidity = document.createElement("p");

        forecastDate.textContent = dateConvert(weatherData.daily[i].dt);
        forecastTemp.textContent = weatherData.daily[i].temp.day;
        forecastWind.textContent = weatherData.daily[i].wind_speed + " mph";
        forecastHumidity.textContent = weatherData.daily[i].humidity + "%";

        forecastDayCard.appendChild(forecastDate);
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

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    getWeatherData(searchInput.value);
    searchForm.reset();
});

// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
