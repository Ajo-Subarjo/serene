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
const rain = document.querySelector('#rain');
const weather_forecast_container = document.querySelector('#weather-forecast');

const location_setting = document.querySelector('#location-settings')
const input_lat = document.querySelector('#latitude-input')
const input_lon = document.querySelector('#longitude-input')
const save_loc = document.querySelector('#location-save')
const cancel_loc = document.querySelector('#location-cancel')


const sens_grass1 = 40;
const sens_grass2 = 120;
const sens_ornament = 70;

const sens_grass1Y = 0.3;
const sens_grass2Y = 0.6;
const sens_ornamentY = 1.2;


// just incase no offense. this emoticon is needed to render the weather icon, no ai we harmed :]
const weather_code = {
  0: ["☀️", "Clear", "🌙"],
  1: ["🌤️", "Mainly clear", "🌙"],
  2: ["⛅", "Partly cloudy", "☁️"],
  3: ["☁️", "Cloudy"],
  45: ["🌫️", "Fog"],
  48: ["🌫️", "Fog"],
  51: ["🌦️", "Drizzle"],
  53: ["🌦️", "Drizzle"],
  55: ["🌦️", "Drizzle"],
  56: ["🌨️", "Freezing drizzle"],
  57: ["🌨️", "Freezing drizzle"],
  61: ["🌧️", "Rain"],
  63: ["🌧️", "Rain"],
  65: ["🌧️", "Rain"],
  66: ["🌨️", "Freezing rain"],
  67: ["🌨️", "Freezing rain"],
  71: ["🏔️", "Snow fall"],
  73: ["🏔️", "Snow fall"],
  75: ["🏔️", "snow fall"],
  77: ["🏔️", "Snow grain"],
  80: ["🌦️", "Rain showers", "🌧️"],
  81: ["🌦️", "Rain showers", "🌧️"],
  82: ["🌦️", "Rain showers", "🌧️"],
  85: ["🌨️", "Snow howers"],
  86: ["🌨️", "Snow showers"],
  95: ["⛈️", "Thunderstorm"],
  96: ["⛈️", "Thunderstorm"],
  99: ["⛈️", "Thunderstorm"]
};


let mouseX = 0;
let mouseY = 0;
let mouse_scrollY = 0;

let lat = -6.530055;
let lon = 105.865028;

let setting_vis = false


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

document.addEventListener("keydown", (event) => {
  if (event.altKey && event.key.toLowerCase() === "c") {
    console.log("pressed")
    event.preventDefault()
    toggle_setting()
  }
})



save_loc.addEventListener("click", (event) => {
  const new_lat = Number(input_lat.value)
  const new_lon = Number(input_lon.value)

  if (!Number.isFinite(new_lat) || !Number.isFinite(new_lon)) {
    alert("Invalid latitude or longitude")
    return
  } else if (new_lat < -90 || new_lat > 90) {
    alert("latitude must be between -90 and 90")
    return
  } else if (new_lon < -180 || new_lon > 180) {
    alert("longitude must be between -180 and 180")
    return
  }

  lat = new_lat
  lon = new_lon
  localStorage.setItem("latitude", lat)
  localStorage.setItem("longitude", lon)
  location_setting.style.display = "none"
  setting_vis = false
  update_weather()
})

cancel_loc.addEventListener("click", (event) => {
  setting_vis = false
  location_setting.style.display = "none"
})



function toggle_setting() {
  if (!setting_vis) {
    input_lat.value = lat
    input_lon.value = lon
    location_setting.style.display = "flex"
    setting_vis = !setting_vis
  } else {
    location_setting.style.display = "none"
    setting_vis = !setting_vis
  }
}



function update_date_time() {
  const now = new Date();

  clock.textContent = now.toLocaleTimeString("en-EN", {
    hour12: false
  });
  calender.textContent = now.toLocaleDateString("en-EN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric"
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

async function start() {
  const saved_lon = localStorage.getItem('longitude');
  const saved_lat = localStorage.getItem('latitude')

  if (saved_lat !== null && saved_lon !== null) {
    lat = Number(saved_lat)
    lon = Number(saved_lon)
  }
  await update_weather()
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
    // console.log(response[0].current().variables(0).value())
    // console.log(response[0].daily().variables(0).valuesArray())
    current_weather(response[0].current())
    weather_forecast(response[0].daily())

  } catch (error) {
      console.log(error)
  }
};

function current_weather(weather_data) {
  const cur_temp = weather_data.variables(0).value()
  const cur_humidity = weather_data.variables(1).value()
  const cur_rain = weather_data.variables(2).value();
  const cur_weather_code = weather_data.variables(3).value();
  const is_day = weather_data.variables(4).value() === 1;
  // console.log(cur_humidity);
  // console.log(cur_temp);
  // console.log(cur_rain)
  console.log(cur_weather_code)
  // console.log(is_day)
  console.log(weather_code[cur_weather_code])
  const _weather_code = weather_code[cur_weather_code]

  console.log(_weather_code)


  if (is_day) {
    weather_icon.textContent = _weather_code[0]
    console.log("day")
  } else {
    weather_icon.textContent = _weather_code[0] ?? _weather_code[0]
    console.log("night")

    condition.textContent = String(_weather_code[1])
    temperature.textContent = String(Math.round(cur_temp))+"`C"
    humidity.textContent = "💧"+String(Math.round(cur_humidity))+"%"
    rain.textContent = "🌧️"+String(cur_rain.toFixed(1)) + "mm"
  }
}

function weather_forecast(forecast_data) {
  const _weather_code_array = forecast_data.variables(0).valuesArray()
  const max_temp = forecast_data.variables(1).valuesArray()
  const min_temp = forecast_data.variables(2).valuesArray()
  const rain_sum = forecast_data.variables(3).valuesArray()

  const date_formatter = new Intl.DateTimeFormat("en-EN", { weekday: "short" });
  const start_date = new Date();

  weather_forecast_container.innerHTML = ``

  for (let i = 0; i < _weather_code_array.length; i++) {
    const _weather_code = weather_code[_weather_code_array[i]]
    const _min_temp = min_temp[i]
    const _max_temp = max_temp[i]
    const _rain_sum = rain_sum[i]
    // console.log(_weather_code)
    let day_name;

    if (i === 0) {
      day_name = "Today"
    } else {
      const date = new Date(start_date)
      date.setDate(date.getDate() + i)
      day_name = date_formatter.format(date)
    }
    const forecast_day = document.createElement("div")
    forecast_day.className = "forecast-day"

    forecast_day.innerHTML = `
      <p>${day_name}</p>
      <p>${_weather_code[0]}
      <p>${_weather_code[1]}</p>
      <p>${_rain_sum}
      <p>${Math.round(_min_temp)}'/${Math.round(_max_temp)}'`

    weather_forecast_container.appendChild(forecast_day)
  }
}


await start()
setInterval(update_date_time, 1000);
