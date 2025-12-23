const cityCountry = document.querySelector("#city-country");
const searchBox = document.querySelector("#search-box");
const searchBtn = document.querySelector("#search-btn");
const todayTemp = document.querySelector("#temp-today");
const feelsLike = document.querySelector("#value1");
const humidity = document.querySelector("#value2");
const windSpeed = document.querySelector("#value3");
const precipitation = document.querySelector("#value4");
const todayDate = document.querySelector("#today-date");
const dayOrNight = document.querySelector("#day-or-night");

const dailyForeCast = document.querySelector("#forecast-days");

const getLocation = async () => {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    console.log(pos);
    const { latitude, longitude } = pos.coords;
    const locationUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    try {
      const location = await fetch(locationUrl);
      const exectLocation = await location.json();
      getWeather(exectLocation.address.town);
    } catch (error) {
      console.log(error);
    }
  });
};
getLocation();

async function getWeather(exectLocation) {
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${exectLocation}&count=1`
  );
  const geoData = await geoRes.json();
  const { latitude, longitude } = geoData.results[0];

  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,precipitation_sum,precipitation_hours,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,wind_gusts_10m_max,wind_speed_10m_max,daylight_duration,sunshine_duration,precipitation_probability_max&hourly=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,apparent_temperature,precipitation_probability&current=wind_gusts_10m,wind_direction_10m,wind_speed_10m,is_day,relative_humidity_2m,apparent_temperature,temperature_2m,precipitation,rain,showers,snowfall,surface_pressure,cloud_cover,pressure_msl,weather_code&timezone=auto`
  );
  const weatherData = await weatherRes.json();
  renderWeather(geoData, weatherData);
}

const date = new Date();
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dayName = days[date.getDay()];
const monthName = months[date.getMonth()];
const year = date.getFullYear();

function renderWeather(geoData, weatherData) {
  renderToday(geoData, weatherData);
  renderDailyForecast(weatherData);
  renderHourlyForecast(weatherData);
}

function renderToday(geoData, weatherData) {
  if (weatherData.error) {
    cityCountry.innerText = "search for a city";
  } else {
    cityCountry.innerText =
      geoData.results[0].name + " , " + geoData.results[0].country;
  }

  dayOrNight.src =
    weatherData.current.is_day === 1 ? "./images/sun.png" : "./images/moon.png";
  feelsLike.innerHTML = `${weatherData.current.apparent_temperature}<sup>o</sup>`;
  humidity.innerHTML = `${weatherData.current.relative_humidity_2m}  %`;
  todayTemp.innerHTML = `${weatherData.current.temperature_2m}<sup>o</sup>`;
  windSpeed.innerHTML = `${weatherData.current.wind_speed_10m} <span class = "text-[16px]">kph</span>`;
  precipitation.innerHTML = `${weatherData.current.precipitation} in`;
  todayDate.innerHTML = `${dayName} , ${monthName} , ${year}`;
}

function renderDailyForecast(weatherData) {
  console.log(weatherData);
}

function renderHourlyForecast(weatherData) {
  console.log(weatherData);
}

searchBtn.addEventListener("click", function (e) {
  getWeather(searchBox.value.toLowerCase());
  searchBox.value = "";
});
