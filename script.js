const apiKey = "8a2c485e231e9f187b58fc334497f127"; 
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";


const demoData = {
  london: {
    name: "London",
    main: { temp: 59, humidity: 80 },
    weather: [{ id: 803, description: "broken clouds" }],
  },
  paris: {
    name: "Paris",
    main: { temp: 68, humidity: 60 },
    weather: [{ id: 800, description: "clear sky" }],
  },
  tokyo: {
    name: "Tokyo",
    main: { temp: 77, humidity: 70 },
    weather: [{ id: 501, description: "moderate rain" }],
  },
  dubai: {
    name: "Dubai",
    main: { temp: 104, humidity: 40 },
    weather: [{ id: 800, description: "clear sky" }],
  },
  moscow: {
    name: "Moscow",
    main: { temp: 14, humidity: 85 },
    weather: [{ id: 601, description: "heavy snow" }],
  },
  newyork: {
    name: "New York",
    main: { temp: 72, humidity: 55 },
    weather: [{ id: 211, description: "thunderstorm" }],
  },
  dessie: {
    name: "Dessie",
    main: { temp: 68, humidity: 62 },
    weather: [{ id: 801, description: "few clouds" }],
  },
  addisababa: {
    name: "Addis Ababa",
    main: { temp: 65, humidity: 58 },
    weather: [{ id: 800, description: "clear sky" }],
  },
  kombolcha: {
    name: "Kombolcha",
    main: { temp: 82, humidity: 55 },
    weather: [{ id: 800, description: "clear sky" }],
  },
  bahirdar: {
    name: "Bahir Dar",
    main: { temp: 75, humidity: 70 },
    weather: [{ id: 500, description: "light rain" }],
  },
};

const form = document.querySelector(".myform");
const input = document.getElementById("weather");
const cityDisplay = document.querySelector(".cityDisplay");
const tempDisplay = document.querySelector(".temDisplay");
const humidityDisplay = document.querySelector(".humidityDisplay");
const descDisplay = document.querySelector(".descDisplay");
const weatherEmoji = document.querySelector(".weatherEmoji");
const errorDisplay = document.querySelector(".errorDisplay");
const card = document.querySelector(".card");

// Hide card and error on load
card.style.display = "none";
errorDisplay.style.display = "none";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = input.value.trim();

  if (!city) {
    showError("Please enter a city name.");
    return;
  }

  // Check demo data first (works without an API key)
  const demoKey = city.toLowerCase().replace(/\s+/g, "");
  if (demoData[demoKey]) {
    updateWeatherCard(demoData[demoKey]);
    return;
  }

  // Real API call (needs a valid key)
  if (apiKey === "YOUR_API_KEY_HERE") {
    showError(
      `"${city}" is not in demo mode. Try: London, Paris, Tokyo, Dubai, Moscow, or New York. Or add a real API key.`
    );
    return;
  }

  try {
    const response = await fetch(
      `${apiUrl}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=imperial`
    );

    if (!response.ok) {
      if (response.status === 404) {
        showError(`City "${city}" not found. Try again.`);
      } else if (response.status === 401) {
        showError("Invalid API key. Check your key in script.js.");
      } else {
        showError("Something went wrong. Try again later.");
      }
      return;
    }

    const data = await response.json();
    updateWeatherCard(data);
  } catch (err) {
    showError("Network error. Check your connection.");
  }
});

function updateWeatherCard(data) {
  const { name, main, weather } = data;

  cityDisplay.textContent = name;
  tempDisplay.textContent = `${Math.round(main.temp)}℉`;
  humidityDisplay.textContent = `Humidity: ${main.humidity}%`;
  descDisplay.textContent = capitalise(weather[0].description);
  weatherEmoji.textContent = getWeatherEmoji(weather[0].id);

  errorDisplay.style.display = "none";
  card.style.display = "flex";
}

function showError(message) {
  card.style.display = "none";
  errorDisplay.textContent = message;
  errorDisplay.style.display = "block";
}

function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getWeatherEmoji(weatherId) {
  if (weatherId >= 200 && weatherId < 300) return "⛈️";  // thunderstorm
  if (weatherId >= 300 && weatherId < 400) return "🌦️";  // drizzle
  if (weatherId >= 500 && weatherId < 600) return "🌧️";  // rain
  if (weatherId >= 600 && weatherId < 700) return "❄️";   // snow
  if (weatherId >= 700 && weatherId < 800) return "🌫️";  // atmosphere (fog, haze)
  if (weatherId === 800)                   return "☀️";   // clear sky
  if (weatherId > 800)                     return "☁️";   // clouds
  return "🌡️";
}
