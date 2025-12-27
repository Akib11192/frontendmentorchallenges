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
const infoBenner = document.querySelector("#info-benner");
const dayNamesSelect = document.querySelector("#day-names-select");

// infoBenner.innerHTML = `<div class="flex items-center justify-center bg-(--neutral-600) h-60 rounded-2xl"><img src="./images/icon-ui/icon-loading.svg" alt="" class="loading-rotate w-5 h-5 ">`;

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

function shimmerEffect(days) {
  infoBenner.innerHTML = `<div class="flex items-center justify-center bg-(--neutral-600) h-60 rounded-2xl"><img src="./images/icon-ui/icon-loading.svg" alt="" class="loading-rotate w-5 h-5 ">`;

  days.forEach((el, index) => {
    const shimmer = document.createElement("div");
    shimmer.classList.add(
      "bg-(--neutral-600)",
      "rounded-2xl",
      "w-20",
      "h-30",
      "flex",
      "items-center",
      "justify-center"
    );
    shimmer.innerHTML = `
    <img src="./images/icon-ui/icon-loading.svg" alt="" class="loading-rotate w-5 h-5 ">
    `;
    dailyForeCast.append(shimmer);
  });
}

shimmerEffect(days);

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
  console.log(geoData);
  const { latitude, longitude } = geoData.results[0];

  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,precipitation_sum,precipitation_hours,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,wind_gusts_10m_max,wind_speed_10m_max,daylight_duration,sunshine_duration,precipitation_probability_max&hourly=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,apparent_temperature,precipitation_probability&current=wind_gusts_10m,wind_direction_10m,wind_speed_10m,is_day,relative_humidity_2m,apparent_temperature,temperature_2m,precipitation,rain,showers,snowfall,surface_pressure,cloud_cover,pressure_msl,weather_code&timezone=auto`
  );
  const weatherData = await weatherRes.json();

  renderWeather(geoData, weatherData);
}
const date = new Date();
const dayName = days[date.getDay()];
const monthName = months[date.getMonth()];
const year = date.getFullYear();

function getDaysStartingFromToday(days) {
  const todayIndex = date.getDay();

  return [...days.slice(todayIndex), ...days.slice(0, todayIndex)];
}

function renderWeather(geoData, weatherData) {
  renderToday(geoData, weatherData);
  renderDailyForecast(weatherData);
  renderHourlyForecast(weatherData);
}

function renderToday(geoData, weatherData) {
  infoBenner.innerHTML = "";
  infoBenner.innerHTML = `<div class="img-today flex flex-row items-center justify-between h-60 rounded-2xl p-6">
                            <div class="flex flex-col gap-4">
                                <h2 id="city-country" class="text-2xl font-semibold text-(--neutral-0)">${
                                  weatherData.error
                                    ? "search for a city"
                                    : geoData.results[0].name +
                                      " , " +
                                      geoData.results[0].country
                                }
                                </h2>
                                <p id="today-date" class="text-(--neutral-0)">${`${dayName} , ${monthName} , ${year}`}</p>
                            </div>
                            <div class="flex flex-col md:flex-row gap-8">
                                <img src=${
                                  weatherData.current.is_day === 1
                                    ? "./images/sun.png"
                                    : "./images/moon.png"
                                } id="day-or-night" alt="" class="w-20 h-20">
                                <h2 id="temp-today" class="text-4xl md:text-6xl font-bold text-(--neutral-0)">${
                                  weatherData.current.temperature_2m
                                }<sup>o</sup>
                                </h2>
                            </div>
                        </div>`;
  feelsLike.innerHTML = `${weatherData.current.apparent_temperature}<sup>o</sup>`;
  humidity.innerHTML = `${weatherData.current.relative_humidity_2m}  %`;
  windSpeed.innerHTML = `${weatherData.current.wind_speed_10m} <span class = "text-[16px]">kph</span>`;
  precipitation.innerHTML = `${weatherData.current.precipitation} in`;
}

function renderDailyForecast(weatherData) {
  console.log(weatherData.daily);
  dailyForeCast.innerHTML = "";
  const dayFromToday = getDaysStartingFromToday(days);
  dayFromToday.forEach((el, index) => {
    let weatherCode;
    if ([0].includes(weatherData.daily.weather_code[index])) {
      weatherCode = "./images/icon-weather/icon-sunny.webp";
    } else if ([1, 2, 3].includes(weatherData.daily.weather_code[index])) {
      weatherCode = "./images/icon-weather/icon-sunny.webp";
    } else if ([45, 48].includes(weatherData.daily.weather_code[index])) {
      weatherCode = "./images/icon-weather/icon-sunny.webp";
    }

    const day = document.createElement("div");
    day.classList.add(
      "px-2",
      "py-4",
      "bg-(--neutral-600)",
      "rounded-2xl",
      "flex",
      "flex-col",
      "items-center"
    );
    day.innerHTML = `<h4 class="text-(--neutral-0)">${dayFromToday[index].slice(
      0,
      3
    )}</h4>
<img src=${weatherCode} alt="" class="w-20 h-20">
<div class="flex flex-row gap-6">
<p class="max-temp text-[12px] text-(--neutral-0)">${
      weatherData.daily.temperature_2m_max[index]
    }<sup>o</sup></p>
<p class="min-temp text-[12px] text-(--neutral-0)">${
      weatherData.daily.temperature_2m_min[index]
    }<sup>o</sup></p>
</div>`;
    dailyForeCast.append(day);
  });
}

function renderHourlyForecast(weatherData) {
  console.log(weatherData);
  const dayFromToday = getDaysStartingFromToday(days);
  dayFromToday.forEach((el, index) => {
    const option = document.createElement("option");
    option.classList.add(
      "text-(--neutral-0)",
      "p-2",
      "hover:bg-(--neutral-600)"
    );
    option.innerText = dayFromToday[index];
    dayNamesSelect.append(option);
  });
}

searchBtn.addEventListener("click", function (e) {
  getWeather(searchBox.value.toLowerCase());
  searchBox.value = "";
});
