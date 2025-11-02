// --------------------------------------------------
// Weather App – Unified Mentor Project
// --------------------------------------------------
const API_KEY = '507e1c97750a5ed105139ef9bdc0a5c4';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput      = document.getElementById('cityInput');
const submitBtn      = document.getElementById('submitBtn');
const weatherDisplay = document.getElementById('weatherDisplay');
const errorMessage   = document.getElementById('errorMessage');
const cityNameEl     = document.getElementById('cityName');
const weatherIconEl  = document.getElementById('weatherIcon');
const tempEl         = document.getElementById('temperature');
const descEl         = document.getElementById('description');

// --------------------------------------------------
// Event listeners
// --------------------------------------------------
submitBtn.addEventListener('click', fetchWeather);
cityInput.addEventListener('keypress', e => { if (e.key === 'Enter') fetchWeather(); });

// --------------------------------------------------
// Core function
// --------------------------------------------------
async function fetchWeather() {
  const city = cityInput.value.trim();
  if (!city) { showError('Please enter a city name'); return; }

  hideError();
  showLoading();

  try {
    const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);

    if (!response.ok) {
      if (response.status === 404) throw new Error('City not found');
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();
    displayWeather(data);

  } catch (err) {
    showError(err.message);
  }
}

// --------------------------------------------------
// Render weather
// --------------------------------------------------
function displayWeather(data) {
  const { name, sys, main, weather } = data;
  const iconCode = weather[0].icon;
  const iconUrl  = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  cityNameEl.textContent = `${name}, ${sys.country}`;
  weatherIconEl.src = iconUrl;
  tempEl.textContent = `${Math.round(main.temp)}°C`;
  descEl.textContent = weather[0].description;

  weatherDisplay.classList.remove('hidden');
}

// --------------------------------------------------
// UI helpers
// --------------------------------------------------
function showError(msg) {
  // Friendly messages
  const friendly = {
    'Failed to fetch weather data': 'Network error – check your internet or API key.',
    'City not found': 'City not found. Try another name.'
  };
  errorMessage.textContent = friendly[msg] || msg;
  errorMessage.classList.remove('hidden');
  weatherDisplay.classList.add('hidden');
}

function hideError()   { errorMessage.classList.add('hidden'); }
function showLoading() { weatherDisplay.classList.add('hidden'); }