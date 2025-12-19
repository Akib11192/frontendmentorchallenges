const cityCountry = document.querySelector("#city-country");
const searchBox = document.querySelector("#search-box");
const searchBtn = document.querySelector("#search-btn");
const getLocation = async () => {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;

    // const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const locationUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    try {
      const location = await fetch(locationUrl);
      const exectLocation = await location.json();
      renderWeather(exectLocation.address.town);
    } catch (error) {
      console.log(error);
    }
  });
};
getLocation();

function renderWeather(exectLocation) {
  // console.log(exectLocation);
  const url = `https://api.weatherapi.com/v1/current.json?key=562894dc23ab465b88a152717251912&q=${exectLocation}&aqi=no`;
  async function getWeather() {
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data);
    renderDom(data);
  }
  getWeather();
}

function renderDom(data) {
  console.log(data);
  const cc = (cityCountry.innerText =
    data.location.name + " , " + data.location.country);
}

// const response = await fetch(url);
// const data = await response.json();

// console.log(dcata);

// const url = `http://api.weatherapi.com/v1/current.json?key=562894dc23ab465b88a152717251912&q=&aqi=no`;

searchBtn.addEventListener("click", function (e) {
  console.log(searchBox.value);
  renderWeather(searchBox.value.toLowerCase());
});
