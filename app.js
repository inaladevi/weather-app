const apiKey = "Z7X4DW9SUB5NHBJSBY2ZKH6D2";

let currentWeatherData;

async function getWeather(city) {
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${apiKey}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const weatherData = await response.json();
        const cleanData = processData(weatherData);
        return cleanData;
    } catch (error) {
        console.error(error);
    }
}

function processData(weatherData) {
    const cityName = weatherData.resolvedAddress;
    const temp = weatherData.currentConditions.temp;
    const conditions  = weatherData.currentConditions.conditions;
    const humidity = weatherData.currentConditions.humidity;
    const windSpeed = weatherData.currentConditions.windspeed;
    const time = weatherData.currentConditions.datetime;
    const description = weatherData.description
    return ({cityName,temp,conditions,humidity,windSpeed,time,description});
}

const weatherForm = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const city = document.getElementById("display-city");
const temp = document.getElementById("display-temp");
const conditions = document.getElementById("display-conditions");
const humidity = document.getElementById("display-humidity");
const wind = document.getElementById("display-wind");
const celsiusButton = document.getElementById("btn-celsius");
const fahrenheitButton = document.getElementById("btn-fahrenheit");
const loadingMessage = document.getElementById('loading-message');
const errorMessage = document.getElementById('error-message');
const weatherContainer = document.getElementById('weather-result-container');
const displayDescription = document.getElementById('display-description');
const displayTime = document.getElementById('display-time');

function updateBackground(condition) {
  const lowerCondition = condition.toLowerCase();
  document.body.className = "";

  if (lowerCondition.includes("sun") || lowerCondition.includes("clear")) {
    document.body.classList.add("weather-sunny");
  } else if (lowerCondition.includes("cloud")) {
    document.body.classList.add("weather-cloudy");
  } else if (
    lowerCondition.includes("rain") ||
    lowerCondition.includes("drizzle")
  ) {
    document.body.classList.add("weather-rainy");
  } else if (lowerCondition.includes("snow")) {
    document.body.classList.add("weather-snowy");
  } else if (
    lowerCondition.includes("thunder") ||
    lowerCondition.includes("storm")
  ) {
    document.body.classList.add("weather-stormy");
  }
}

function displayWeather(cleanData) {
    const initialCelsius = fahrenheitToCelsius(cleanData.temp);
    temp.textContent = initialCelsius.toFixed(1);
    celsiusButton.classList.add("active-unit");
    fahrenheitButton.classList.remove("active-unit");
    city.textContent = cleanData.cityName; 
    displayDescription.textContent = `"${cleanData.description}"`;
    conditions.textContent = `${getWeatherIcon(cleanData.conditions)} ${cleanData.conditions}`;
    humidity.textContent = cleanData.humidity;
    wind.textContent = cleanData.windSpeed;
    displayTime.textContent = cleanData.time.slice(0, 5);
    updateBackground(cleanData.conditions);
}

function fahrenheitToCelsius(fahrenheit) {
    const celsius = Math.round(((fahrenheit - 32) * 5/9));
    return celsius;
}

celsiusButton.addEventListener("click", function() {
    const fahrenheit = currentWeatherData.temp;
    const celsius = fahrenheitToCelsius(fahrenheit);
    temp.textContent = celsius.toFixed(1);
    celsiusButton.classList.add("active-unit");
    fahrenheitButton.classList.remove("active-unit");
})

fahrenheitButton.addEventListener("click", function() {
    const fahrenheit = currentWeatherData.temp;
    temp.textContent = fahrenheit.toFixed(1);
    fahrenheitButton.classList.add("active-unit");
    celsiusButton.classList.remove("active-unit");
})

function getWeatherIcon(condition) {
    const lowerCondition = condition.toLowerCase();
    switch (true) {
        case lowerCondition.includes("sun") || lowerCondition.includes("clear"):
            return "☀️";
        case lowerCondition.includes("cloud"):
            return "☁️"; 
        case lowerCondition.includes("rain") || lowerCondition.includes("drizzle"):
            return "🌧️";
        case lowerCondition.includes("snow"):
            return "❄️";
        case lowerCondition.includes("thunder") || lowerCondition.includes("storm"):
            return "⚡";
        case lowerCondition.includes("mist") || lowerCondition.includes("fog"):
            return "🌫️";
        default:
            return "🌡️";
    }
}

weatherForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  errorMessage.classList.add("hidden");
  weatherContainer.classList.add("hidden");
  loadingMessage.classList.remove("hidden");

  const cleanData = await getWeather(cityInput.value);

  if (cleanData) {
    loadingMessage.classList.add("hidden");
    weatherContainer.classList.remove("hidden");
    currentWeatherData = cleanData;
    displayWeather(currentWeatherData);
  } else {
    loadingMessage.classList.add("hidden");
    errorMessage.classList.remove("hidden");
    weatherContainer.classList.add("hidden");
  }
});

window.addEventListener("DOMContentLoaded", () => {
    cityInput.value = "Yuma"; 
    weatherForm.dispatchEvent(new Event("submit"));
});


