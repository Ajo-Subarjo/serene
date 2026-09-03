import { fetchWeatherApi  } from "openmeteo";

const parallax = document.querySelector('.parallax');
const grass_1 = document.querySelector('#grass1');
const grass_2 = document.querySelector('#grass2');
const cloud = document.querySelector('#cloud');
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
const forecast = document.querySelector("#weather-forecast");

const latitude = -6.9277;
const longitude = 106.9317;


let params = {
    latitude: -6.9277,
    longitude: 106.9317,

    daily: ["weather_code"],

    hourly: [
        "temperature_2m",
        "relative_humidity_2m"
    ],

    current: [
        "temperature_2m",
        "relative_humidity_2m",
        "rain",
        "precipitation",
        "weather_code"
    ],

    timezone: "auto",
};



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


function getWeatherInfo(code) {

    const weather = {
        0: ["☀️", "Clear"],
        1: ["🌤️", "Mainly clear"],
        2: ["⛅", "Partly cloudy"],
        3: ["☁️", "Overcast"],

        45: ["🌫️", "Fog"],
        48: ["🌫️", "Rime fog"],

        51: ["🌦️", "Light drizzle"],
        53: ["🌦️", "Drizzle"],
        55: ["🌧️", "Heavy drizzle"],

        61: ["🌦️", "Light rain"],
        63: ["🌧️", "Rain"],
        65: ["🌧️", "Heavy rain"],

        71: ["🌨️", "Light snow"],
        73: ["❄️", "Snow"],
        75: ["❄️", "Heavy snow"],

        80: ["🌦️", "Rain showers"],
        81: ["🌧️", "Rain showers"],
        82: ["⛈️", "Heavy showers"],

        95: ["⛈️", "Thunderstorm"],
        96: ["⛈️", "Thunderstorm"],
        99: ["⛈️", "Thunderstorm"]
    };

    const [icon, name] = weather[code] ?? ["❓", "Unknown"];

    return { icon, name };
}


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


function updateCurrentWeather(current) {
  const temperatureValue = current.variables(0).value();
  const humidityValue = current.variables(1).value();
  const precipitationValue = current.variables(2).value();
  const weatherCode = current.variables(3).value();

  const weather = getWeatherInfo(weatherCode);

  weatherIcon.textContent = weather.icon;

  temperature.textContent =
      `${Math.round(temperatureValue)}°C`;

  condition.textContent =
      weather.name;

  humidity.textContent =
      `💧${Math.round(humidityValue)}%`;

  rain.textContent =
      `🌧️${precipitationValue.toFixed(1)}mm`;
}


function updateForecastDaily(daily) {

  forecast.innerHTML = ""

  const times = daily.time();
  const weatherCodes = daily.variables(0).valuesArray();
  const maxTemps = daily.variables(1).valuesArray();
  const minTemps = daily.variables(2).valuesArray();
  const rainProbability = daily.variables(3).valuesArray();

  for (let i = 0; i < times.lenght; i++) {
    const date = new Date(Number(times[i]) * 1000)

    const day = date.toLocaleDateString("en-US", { weekday: 'short' })

    const weather = getWeatherInfo(weatherCodes[i]);

    card.className = "forecast-day"

    card.innerHTML = `
      <p>${day}</p>
      <p>${weather.icon}</p>
      <p>${Math.round(maxTemps[i])}°</p>
      <p>${Math.round(minTemps[i])}°</p>
      <p>🌧️${Math.round(rainProbability[i])}%</p>
      `;
    forecast.appendChild(card)

  }
}

async function getWeather() {
  try {
    const responses = await fetchWeatherApi("https://api.open-meteo.com/v1/forecast",params)
    const res = responses[0]

    const current = res.current();
    const daily = res.daily()

    updateCurrentWeather(current);

  } catch (error) {
    console.error("failded to get Weather", error)
  }
}





updateDateTime();
getWeather()
setInterval(updateDateTime, 1000);
