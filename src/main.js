import { fetchWeatherApi  } from "openmeteo";

const parallax = document.querySelector('.parallax');
const grass_1 = document.querySelector('#grass1');
const grass_2 = document.querySelector('#grass2');

const ornament = document.querySelector('#ornament')

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");

const clock = document.querySelector("#clock");
const calendar = document.querySelector("#calender");

const weatherIcon = document.querySelector("#weather-icon");
const temperature = document.querySelector("#temperature");
const condition = document.querySelector("#condition");
const humidity = document.querySelector("#humidity");
const rain = document.querySelector("#rain");

const weatherForecast = document.querySelector("#weather-forecast");


const locationSettings = document.querySelector("#location-settings");
const latitudeInput = document.querySelector("#latitude-input");
const longitudeInput = document.querySelector("#longitude-input");
const locationSave = document.querySelector("#location-save");
const locationCancel =document.querySelector("#location-cancel");


let latitude = -6.9277;
let longitude = 106.9317;

const savedLatitude = localStorage.getItem("latitude");
const savedLongitude = localStorage.getItem("longitude");

if (savedLatitude !== null && savedLongitude !== null) {
    latitude = Number(savedLatitude);
    longitude = Number(savedLongitude);
}


const sGrass1 = 40;
const sGrass2 = 120;
const sOrnament = 70;

const sGrass1Y = 0.3;
const sGrass2Y = 0.6;
const sOrnamentY = 1.2;


let mouseY = 0;
let mouseX = 0;
let scrollY = 0


window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX - window.innerWidth / 2;
  mouseY = e.clientY - window.innerHeight / 2;

  updateParallax()
});

window.addEventListener("scroll", () => {
  scrollY = window.scrollY

  updateParallax()
});

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const query = searchInput.value.trim();

    if (!query) return;

    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    window.location.href = url;
});

document.addEventListener("keydown", (event) => {

    if (
        event.altKey &&
        event.key.toLowerCase() === "c"
    ) {

        event.preventDefault();

        latitudeInput.value =
            latitude;

        longitudeInput.value =
            longitude;

        locationSettings.style.display =
            "flex";
    }
});

locationSave.addEventListener("click", () => {

    const newLatitude = Number(latitudeInput.value);

    const newLongitude = Number(longitudeInput.value)


    if (!Number.isFinite(newLatitude) || !Number.isFinite(newLongitude)) {
        alert("Invalid latitude or longitude");
        return;
    }


    if (newLatitude < -90 ||newLatitude > 90) {
        alert("Latitude must be between -90 and 90")
        return;
    }

    if (newLongitude < -180 ||newLongitude > 180) {
        alert("Longitude must be between -180 and 180");
        return;
    }

    latitude = newLatitude;

    longitude = newLongitude;


    localStorage.setItem("latitude", latitude);

    localStorage.setItem("longitude", longitude);

    locationSettings.style.display = "none";
    getWeather();
});


locationCancel.addEventListener("click", () => {
    locationSettings.style.display = "none";
});


function updateParallax() {

  grass_1.style.transform = `
    translate(
      ${mouseX / sGrass1}px,
      ${mouseY/ sGrass1 + scrollY * sGrass1Y}px
    )`;

  grass_2.style.transform = `
    translate(
      ${mouseX / sGrass2}px,
      ${mouseY / sGrass2 + scrollY * sGrass2Y}px
    )`;

  ornament.style.transform = `
    translate(
      ${mouseX / sOrnament}px,
      ${mouseY / sOrnament + scrollY * sOrnamentY}px
    )`;
}


function updateDateTime() {
    const now = new Date();

    clock.textContent = now.toLocaleTimeString("en-EN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });

    calendar.textContent = now.toLocaleDateString("en-EN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "long"
    });
}



function getWeatherInfo(code, isDay = true) {

    if (code === 0) {
        return { icon: isDay ? "☀️" : "🌙", text: "Clear" };
    } else if (code === 1) {
        return { icon: isDay ? "🌤️" : "🌙", text: "Mainly clear" };
    } else if (code === 2) {
        return { icon: "⛅", text: "Partly cloudy" };
    } else if (code === 3) {
        return { icon: "☁️", text: "Cloudy" };
    } else if (code === 45 || code === 48) {
        return { icon: "🌫️", text: "Fog" };
    } else if (code === 51 || code === 53 || code === 55) {
        return { icon: "🌦️", text: "Drizzle" };
    } else if (code === 56 || code === 57) {
        return { icon: "🌧️", text: "Freezing drizzle" };
    } else if (code === 61 || code === 63 || code === 65) {
        return { icon: "🌧️", text: "Rain" };
    } else if (code === 66 || code === 67) {
        return { icon: "🌧️", text: "Freezing rain" };
    } else if (code === 71 || code === 73 || code === 75 || code === 77) {
        return { icon: "🌨️", text: "Snow" };
    } else if (code === 80 || code === 81 || code === 82) {
        return { icon: "🌦️", text: "Rain showers" };
    } else if (code === 85 || code === 86) {
        return { icon: "🌨️", text: "Snow showers" };
    } else if (code === 95 || code === 96 || code === 99) {
        return { icon: "⛈️", text: "Thunderstorm" };
    } else {
        return { icon: "❓", text: "Unknown" };
    }
}


async function getWeather() {

    try {

        console.log(`Getting weather for ${latitude}, ${longitude}`);

        const params = {
            latitude: [latitude],
            longitude: [longitude],

            current: "temperature_2m,relative_humidity_2m,rain,weather_code,is_day",
            daily: "weather_code,temperature_2m_max,temperature_2m_min,rain_sum",

            timezone: "auto",
            forecast_days: 7
        };


        const url = "https://api.open-meteo.com/v1/forecast"


        const responses = await fetchWeatherApi(url, params);


        const response = responses[0];
        const current =response.current();


        const currentTemperature = current.variables(0).value();
        const currentHumidity = current.variables(1).value();
        const currentRain = current.variables(2).value();
        const currentWeatherCode = current.variables(3).value()
        const isDay = current.variables(4).value() === 1;


        const currentWeather = getWeatherInfo(currentWeatherCode, isDay);


        weatherIcon.textContent = currentWeather.icon;
        temperature.textContent = `${Math.round(currentTemperature)}°C`;
        condition.textContent = currentWeather.text;
        humidity.textContent = `💧${Math.round(currentHumidity)}%`;
        rain.textContent = `🌧️${currentRain.toFixed(1)} mm`;


        const daily = response.daily()
        const weatherCodes = daily.variables(0).valuesArray();
        const maxTemperatures = daily.variables(1).valuesArray();

        const minTemperatures = daily.variables(2).valuesArray();
        const rainSums = daily.variables(3).valuesArray();

        weatherForecast.innerHTML = "";
        const days = [
            "Today",
            "Tomorrow",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun"
        ];


        const dateFormatter = new Intl.DateTimeFormat("en-EN", {weekday: "short"});


        const startDate = new Date();


        for (let i = 0; i < 7; i++) {

            const code =weatherCodes[i];
            const max = maxTemperatures[i];
            const min = minTemperatures[i];
            const rainAmount =rainSums[i]


            const weather = getWeatherInfo(code, true);
            let dayName;


            if (i === 0) {
                dayName = "Today";

            } else {

                const date =new Date(startDate);
                date.setDate(date.getDate() + i);
                dayName = dateFormatter.format(date);
            }


            const forecastDay = document.createElement("div");
            forecastDay.className ="forecast-day";


            forecastDay.innerHTML = `
                <p>${dayName}</p>
                <p>${weather.icon}</p>
                <p>${weather.text}</p>
                <p>
                    ${Math.round(min)}°
                    /
                    ${Math.round(max)}°
                </p>
            `;


            weatherForecast.appendChild(forecastDay);
        }


        console.log("Weather updated");

    } catch (error) {
        console.error("Failed to get weather:", error);
        condition.textContent = "Weather unavailable";
    }
}

getWeather();

updateDateTime();
setInterval(updateDateTime, 1000);

// Update weather every 10 minutes i guest
setInterval(getWeather,10 * 60 * 1000);
