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
const btn = document.querySelector("#dayBtn");
const menu = document.querySelector("#dayMenu");
const hourlyForeCase = document.querySelector("#hours");
const unitsSelection = document.querySelector("#units-selection");
const unitsPopup = document.querySelector("#units-popup");
const tempUnitSelector = document.querySelector("#temp-unit-selector");
const windUnitSelector = document.querySelector("#wind-unit-selector");
const precUnitSelector = document.querySelector("#prec-unit-selector");

unitsPopup.classList.add("hidden");
unitsSelection.addEventListener("click", (e) => {
  e.stopPropagation();
  unitsPopup.classList.toggle("hidden");
});

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
let globalData;
let globaGeolData;
function hourlyShimmer() {}

async function getWeather(exectLocation) {
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${exectLocation}&count=1`
  );
  const geoData = await geoRes.json();
  console.log(geoData);
  globaGeolData = geoData;
  const { latitude, longitude } = geoData.results[0];

  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,precipitation_sum,precipitation_hours,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,wind_gusts_10m_max,wind_speed_10m_max,daylight_duration,sunshine_duration,precipitation_probability_max&hourly=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,apparent_temperature,precipitation_probability&current=wind_gusts_10m,wind_direction_10m,wind_speed_10m,is_day,relative_humidity_2m,apparent_temperature,temperature_2m,precipitation,rain,showers,snowfall,surface_pressure,cloud_cover,pressure_msl,weather_code&timezone=auto&`
  );
  const weatherData = await weatherRes.json();
  globalData = weatherData;
  renderWeather(geoData, globalData);
}
const date = new Date();
const dayName = days[date.getDay()];
const monthName = months[date.getMonth()];
const year = date.getFullYear();
const hourIndex = date.getHours();
let globelDayFromToday;
let windUnit = "k";
let tempUnit = "celcius";
let precipitationUnit = "inches";

tempUnitSelector.addEventListener("click", (e) => {
  if (e.target.tagName === "H3") return;
  tempUnit = e.target.id;
  renderToday(globaGeolData, globalData, tempUnit, windUnit, precipitationUnit);
  renderDailyForecast(globalData, tempUnit);
  dayMenu(globelDayFromToday[0], tempUnit);
});
windUnitSelector.addEventListener("click", (e) => {
  if (e.target.tagName === "H3") return;
  windUnit = e.target.id;
  renderToday(globaGeolData, globalData, tempUnit, windUnit, precipitationUnit);
  renderDailyForecast(globalData, tempUnit);
});
precUnitSelector.addEventListener("click", (e) => {
  if (e.target.tagName === "H3") return;
  precipitationUnit = e.target.id;
  renderToday(globaGeolData, globalData, tempUnit, windUnit, precipitationUnit);
  renderDailyForecast(globalData, tempUnit);
});

function getDaysStartingFromToday(days) {
  const todayIndex = date.getDay();

  return [...days.slice(todayIndex), ...days.slice(0, todayIndex)];
}

function renderWeather(geoData, weatherData) {
  const dayFromToday = getDaysStartingFromToday(days);
  globelDayFromToday = dayFromToday;
  renderToday(geoData, weatherData, tempUnit, windUnit, precipitationUnit);
  renderDailyForecast(weatherData, tempUnit);
  dayMenu(dayFromToday[0], tempUnit);
}

function renderToday(
  geoData,
  weatherData,
  tempUnit,
  windUnit,
  precipitationUnit
) {
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
                                  tempUnit === "celcius"
                                    ? weatherData.current.temperature_2m
                                    : (weatherData.current.temperature_2m * 9) /
                                        5 +
                                      32
                                }<sup>o</sup>
                                </h2>
                            </div>
                        </div>`;
  feelsLike.innerHTML = `${
    tempUnit === "celcius"
      ? weatherData.current.apparent_temperature
      : (weatherData.current.apparent_temperature * 9) / 5 + 32
  }<sup>o</sup>`;
  humidity.innerHTML = `${weatherData.current.relative_humidity_2m}  %`;
  windSpeed.innerHTML = `${
    windUnit === "k"
      ? weatherData.current.wind_speed_10m
      : Math.floor(weatherData.current.wind_speed_10m * 0.621371)
  } <span class = "text-[16px]">${windUnit === "k" ? "kph" : "mph"}</span>`;
  precipitation.innerHTML = `${
    precipitationUnit === "inches"
      ? weatherData.current.precipitation
      : weatherData.current.precipitation * 25.4
  } ${precipitationUnit === "inches" ? "in" : "mm"}`;
}

function getWeatherCode(foreCastOf, index) {
  let weatherCode;
  let weatherCodeImg;
  let isDay = globalData.current.is_day;

  if (foreCastOf === "daily") {
    weatherCode = globalData.daily.weather_code;
  } else if (foreCastOf === "hourly") {
    weatherCode = globalData.hourly.weather_code;
  }
  // console.log(weatherCode);

  if ([0].includes(weatherCode[index])) {
    weatherCodeImg = `./images/icon-weather/clear-${
      isDay === 1 ? "day" : "night"
    }.svg`;
  } else if ([1, 2, 3].includes(weatherCode[index])) {
    weatherCodeImg = `./images/icon-weather/overcast-${
      isDay === 1 ? "day" : "night"
    }.svg`;
  } else if ([45, 48].includes(weatherCode[index])) {
    weatherCodeImg = "./images/icon-weather/fog-day.svg";
  } else if ([51, 53, 55].includes(weatherCode[index])) {
    weatherCodeImg = "./images/icon-weather/icon-sunny.webp";
  } else if ([56, 57].includes(weatherCode[index])) {
    weatherCodeImg = "./images/icon-weather/icon-sunny.webp";
  } else if ([61, 63, 65].includes(weatherCode[index])) {
    weatherCodeImg = "./images/icon-weather/icon-sunny.webp";
  } else if ([66, 67].includes(weatherCode[index])) {
    weatherCodeImg = "./images/icon-weather/icon-sunny.webp";
  } else if ([71, 73, 75].includes(weatherCode[index])) {
    weatherCodeImg = "./images/icon-weather/icon-sunny.webp";
  } else if ([77].includes(weatherCode[index])) {
    weatherCodeImg = "./images/icon-weather/icon-sunny.webp";
  } else if ([80, 81, 82].includes(weatherCode[index])) {
    weatherCodeImg = "./images/icon-weather/icon-sunny.webp";
  } else if ([85, 86].includes(weatherCode[index])) {
    weatherCodeImg = "./images/icon-weather/icon-sunny.webp";
  } else if ([95].includes(weatherCode[index])) {
    weatherCodeImg = "./images/icon-weather/icon-sunny.webp";
  } else if ([96, 99].includes(weatherCode[index])) {
    weatherCodeImg = "./images/icon-weather/icon-sunny.webp";
  }
  return weatherCodeImg;
}

function renderDailyForecast(weatherData, tempUnit) {
  console.log(weatherData);
  dailyForeCast.innerHTML = "";
  const dayFromToday = getDaysStartingFromToday(days);
  dayFromToday.forEach((el, index) => {
    const weatherCodeImg = getWeatherCode("daily", index);
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
<img src=${weatherCodeImg} alt="" class="w-20 h-20">
<div class="flex flex-row gap-6">
<p class="max-temp text-[12px] text-(--neutral-0)">${
      tempUnit === "celcius"
        ? weatherData.daily.temperature_2m_max[index]
        : Math.floor((weatherData.daily.temperature_2m_max[index] * 9) / 5 + 32)
    }<sup>o</sup></p>
<p class="min-temp text-[12px] text-(--neutral-0)">${
      tempUnit === "celcius"
        ? weatherData.daily.temperature_2m_min[index]
        : Math.floor((weatherData.daily.temperature_2m_min[index] * 9) / 5 + 32)
    }<sup>o</sup></p>
</div>`;
    dailyForeCast.append(day);
  });
}

function renderHourlyForecast(index, tempUnit) {
  hourlyForeCase.innerHTML = "";
  globalData.hourly.time
    .slice(hourIndex + index * 24, hourIndex + index * 24 + 8)
    .forEach((el, i) => {
      const weatherCodeImg = getWeatherCode("hourly", i);
      const hour = document.createElement("div");
      hour.classList.add(
        "bg-(--neutral-700)",
        "flex",
        "flex-row",
        "items-center",
        "justify-between",
        "w-full",
        "px-2",
        "py-1",
        "rounded-2xl"
      );
      hour.innerHTML = `<div class=" flex flex-row items-center justify-between">
                                <img src=${weatherCodeImg} alt="" class="w-10 h-10">
                                <p id="time" class="text-(--neutral-0)">${
                                  hourIndex + i - 12 > 12
                                    ? hourIndex + i - 12 - 12
                                    : hourIndex + i - 12
                                } : 00 ${
        hourIndex + i - 12 < 12 ? "pm" : "am"
      }</p> 
                            </div>
                            <p id="hour-temp" class="px-2 text-(--neutral-0)">${
                              tempUnit === "celcius"
                                ? globalData.hourly.apparent_temperature[
                                    hourIndex + index * 24 + i
                                  ]
                                : Math.floor(
                                    (globalData.hourly.apparent_temperature[
                                      hourIndex + index * 24 + i
                                    ] *
                                      9) /
                                      5 +
                                      32
                                  )
                            } deg</p>`;
      hourlyForeCase.append(hour);
    });
}

function rotateDays(days, selectedDay) {
  const index = days.indexOf(selectedDay);
  return {
    orderedDays: [...days.slice(index), ...days.slice(0, index)],
    index,
  };
}

function dayMenu(selectedDay) {
  const { orderedDays, index } = rotateDays(days, selectedDay);
  renderHourlyForecast(index, tempUnit);
  btn.innerHTML = `${orderedDays[0]} <span>▼</span>`;
  menu.innerHTML = "";

  orderedDays.slice(1).forEach((day) => {
    const li = document.createElement("li");
    li.className =
      "px-4 py-2 hover:bg-white/10 text-(--neutral-0) cursor-pointer";
    li.textContent = day;
    menu.appendChild(li);
  });
}

btn.addEventListener("click", function () {
  menu.classList.toggle("hidden");
});
menu.addEventListener("click", (e) => {
  if (e.target.tagName !== "LI") return;

  dayMenu(e.target.textContent);
  menu.classList.add("hidden");
});
searchBtn.addEventListener("click", function (e) {
  if (!searchBox.value.toLowerCase()) {
    return alert("please enter a city name");
  }
  getWeather(searchBox.value.toLowerCase());
  searchBox.value = "";
});
