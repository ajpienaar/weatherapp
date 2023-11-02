
document.addEventListener("DOMContentLoaded", function() {

  //gets the wind direction from the degrees
  function getWindDirection(degrees) {
    const directions = ['North', 'North East', 'East', 'South East', 'South', 'South West', 'West', 'North West'];
    const index = Math.round(((degrees % 360) / 45)) % 8;
    return directions[index];
  }
  
  const API_KEY = "";//API key here, but best to use some ENV variables
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?`;
  
  //gets the weather data from the API using async/await and fetch
  async function getWeather(lat, long) {
    try {
      const url = `${WEATHER_API_URL}lat=${lat}&lon=${long}&appid=${API_KEY}`;
      const response = await fetch(url);
      if(!response.ok){
          const errorData = await response.json();
          const errorMessage = errorData.message || `Status: ${response.status}`;
          throw new Error(errorMessage);
      }
      else{
      const weatherData = await response.json();
      
      const city = weatherData.name;
      const temp = (weatherData.main.temp - 273.15).toFixed(2);
      const hum = weatherData.main.humidity;
      const gen = weatherData.weather[0].description;
      const wind = (weatherData.wind.speed * 3.6).toFixed(2);
      const direct = weatherData.wind.deg;
      const iconCode = weatherData.weather[0].icon;
      const overview = weatherData.weather[0].main;
  
      //calculate time of day for background image
      const currentTimeUTC = weatherData.dt;
      const sunriseTimeUTC = weatherData.sys.sunrise;
      const sunsetTimeUTC = weatherData.sys.sunset;
      let isDaytime = currentTimeUTC >= sunriseTimeUTC && currentTimeUTC < sunsetTimeUTC;


      let backgroundElement = document.getElementById('background');
      backgroundElement.className = '';

  //changes the background image depending on the weather overview day/night
    if (overview === 'Clouds') {
      if (isDaytime) {
        backgroundElement.classList.add("clouds-day");
      } else {
        backgroundElement.classList.add("clouds-night");
      }
    } else if (overview === 'Clear') {
      if (isDaytime) {
        backgroundElement.classList.add("clear-day");
      } else {
        backgroundElement.classList.add("clear-night");
      }
    } else if (overview === 'Rain') {
      if (isDaytime) {
        backgroundElement.classList.add("rain-day");
      } else {
        backgroundElement.classList.add("rain-night");
      }
    } else if (overview === 'Snow') {
      if (isDaytime) {
        backgroundElement.classList.add("snow-day");
      } else {
        backgroundElement.classList.add("snow-night");
      }
    } else if (overview === 'Thunderstorm') {
      backgroundElement.classList.add("thunder");
    } else if (overview === 'Drizzle') {
      if (isDaytime) {
        backgroundElement.classList.add("drizzly-day");
      } else {
        backgroundElement.classList.add("drizzly-night");
      }
    } else if (overview === 'Mist' || overview === 'Smoke' || overview === 'Haze' || overview === 'Dust' || overview === 'Fog' || overview === 'Sand' || overview === 'Ash') {
      if (isDaytime) {
        backgroundElement.classList.add("foggy-day");
      } else {
        backgroundElement.classList.add("foggy-night");
      }
    }
  //updates the DOM with the weather data
      document.getElementById("name").innerText = city + " Weather";
      document.getElementById("wind").innerText = "Wind: " + wind + " km/h " + getWindDirection(direct);
      document.getElementById("temp").innerText= "Temp: " + temp + " °C";
      document.getElementById("humid").innerText= "Humidity: " + hum + " %";
      document.getElementById("general").innerText= "Overview: " + gen;
      document.getElementById("weatherIcon").src = `https://openweathermap.org/img/w/${iconCode}.png`;            
      document.getElementById("overview").innerText = overview;
    }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      document.getElementById("error").innerText = `Failed to fetch weather: ${error}`;
    }
  
  }
  
  //If geolocation is supported and succeeds, it resolves with the position as a promise. If it fails or isn't supported, it rejects with an error.
  function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        } else {
            reject(new Error("Geolocation is not supported by this browser."));
        }
    });
  }
  //uses the getCurrentLocation function to get the current location and then calls the getWeather function with the coordinates
  async function fetchCurrentLocationWeather() {
    try {
        const position = await getCurrentLocation();
        await getWeather(position.coords.latitude, position.coords.longitude);
    } catch (error) {
        console.error("Error fetching location/weather:", error);
    }
  }
  //calls the fetchCurrentLocationWeather function
  document.getElementById("locationForm").addEventListener("submit", function(event) {
    event.preventDefault();
  
    const selectedLocation = document.getElementById("city").value;
  
  //checks which location is selected and calls the getWeather function with the coordinates
    if (selectedLocation === "Current Location") {
        fetchCurrentLocationWeather();
    } else if (selectedLocation === "Wanaka") {
        getWeather(-44.70, 169.15);
    } else if (selectedLocation === "Queenstown") {
      getWeather(-45.03, 168.66);
    } else if (selectedLocation === "New York City") {
      getWeather(40.7128, -74.0060);
    } else if (selectedLocation === "London") {
      getWeather(51.5074, -0.1278);
    } else if (selectedLocation === "Tokyo") {
      getWeather(35.6895, 139.6917);
    } else if (selectedLocation === "Sydney") {
      getWeather(-33.8688, 151.2093);
    } else if (selectedLocation === "Paris") {
      getWeather(48.8566, 2.3522);
    } else if (selectedLocation === "Cape Town") {
      getWeather(-33.9249, 18.4241);
    } else if (selectedLocation === "Rio de Janeiro") {
      getWeather(-22.9068, -43.1729);
    } else if (selectedLocation === "Moscow") {
      getWeather(55.7558, 37.6173);
    } else if (selectedLocation === "Mumbai") {
      getWeather(19.0760, 72.8777);
    } else if (selectedLocation === "Beijing") {
      getWeather(39.9042, 116.4074);
    } else {
      console.log("Please select a valid location!");
    }
  });
  });