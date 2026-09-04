import { fetchWeatherApi } from "openmeteo";

const grass1 = document.querySelector('#grass1');
const grass2 = document.querySelector('#grass2');
const ornament = document.querySelector('#ornament');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const clock = document.querySelector('#clock');
const calender = document.querySelector('#calender');
const weather_icon = document.querySelector('#weather-icon');
const temperature = document.querySelector('#temperature');
const condition = document.querySelector('#condition');
const humidity = document.querySelector('#humidity');
const rain = document.querySelector('#rain')
const wether_forecast_container = document.querySelector('#weather-forecast');




const sens_grass1 = 40;
const sens_grass2 = 120;
const sens_ornament = 70;

const sens_grass1Y = 0.3;
const sens_grass2Y = 0.6;
const sens_ornamentY = 1.2;

const saved_lon = localStorage.getItem('lon');
const saved_lat = localStorage.getItem('lat')

const weatherTypes = {
    0: ["☀️", "Clear", "🌙"],
    1: ["🌤️", "Mainly clear", "🌙"],
    2: ["⛅", "Partly cloudy", "☁️"],
    3: ["☁️", "Cloudy"],
    45: ["🌫️", "Fog"],
    48: ["🌫️", "Fog"],
    51: ["🌦️", "Drizzle"],
    53: ["🌦️", "Drizzle"],
    55: ["🌦️", "Drizzle"],
    61: ["🌧️", "Rain"],
    63: ["🌧️", "Rain"],
    65: ["🌧️", "Rain"],
    80: ["🌦️", "Rain showers", "🌧️"],
    81: ["🌦️", "Rain showers", "🌧️"],
    82: ["🌦️", "Rain showers", "🌧️"],
    95: ["⛈️", "Thunderstorm"],
    96: ["⛈️", "Thunderstorm"],
    99: ["⛈️", "Thunderstorm"]
};



let mouseX = 0;
let mouseY = 0;
let mouse_scrollY = 0;

let lat = -6.40629;
let lon = 106.7947150;



window.addEventListener('mousemove', event => {
  mouseX = event.clientX - window.innerWidth / 2
  mouseY = event.clientX - window.innerHeight / 2

  update_parallax()
  // console.log(mouseX, mouseY)
})

window.addEventListener('scroll', event => {
  mouse_scrollY = window.scrollY
  update_parallax()
  // console.log(mouse_scrollY)
})

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  const query = searchInput.value

  if (query != "" ){
    const url = 'https://www.google.com/search?q=' + query
    window.location.href = url
  } else {
    return
  }
})


function update_date_time() {
  const now = new Date();

  clock.textContent = now.toLocaleTimeString("en-EN", {
    hour12: false
  });

  calender.textContent = now.toDateString("en-EN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long"
  })
};

function update_parallax() {
  grass1.style.transform = `
    translate(
      ${mouseX / sens_grass1}px,
      ${mouseY / sens_grass1 + mouse_scrollY * sens_grass1Y}px
    )`;
  grass2.style.transform = `
    translate(
      ${mouseX / sens_grass2}px,
      ${mouseY / sens_grass2 + mouse_scrollY * sens_grass2Y}px
    )`;
  ornament.style.transform = `
    translate(
      ${mouseX / sens_ornament}px,
      ${mouseY / sens_ornament + mouse_scrollY * sens_ornamentY}px
    )`;
};

function start() {
  if (saved_lat !== null && saved_lon !== null) {
    lat = Number(saved_lat)
    lon = Number(saved_lon)
  }
};

async function update_weather() {
  try {
    console.log(`loc from ${lat}, ${lon} `)

    const param = {
      longitude: [lon],
      latitude: [lat],
      current: "temperature_2m,relative_humidity_2m,rain,weather_code,is_day",
      daily: "weather_code,temperature_2m_max,temperature_2m_min,rain_sum",
      timezone: "auto",
      forecast_days: 7
    }
    const url = "https://api.open-meteo.com/v1/forecast"
    const response = await fetchWeatherApi(url, param)
    console.log(response[0].current().variables(0).value())
    console.log(response[0].daily().variables(0).valuesArray())



  } catch (error) {
      console.log(error)
  }
};

await update_weather()
// start()
setInterval(update_date_time, 1000);
