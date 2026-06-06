/**
 * Weather Forecast Web Application
 * -----------------------------------
 * Fetches live weather data from OpenWeatherMap API.
 * Features: search, localStorage, dynamic backgrounds, error handling.
 */

// ============================================
// Configuration
// ============================================

/**
 * Replace with your OpenWeatherMap API key.
 * Sign up free at: https://openweathermap.org/api
 */
const API_KEY = "YOUR_API_KEY_HERE";

const API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const ICON_BASE_URL = "https://openweathermap.org/img/wn";

/** localStorage keys */
const STORAGE_KEYS = {
  RECENT_SEARCHES: "weather_recent_searches",
  LAST_CITY: "weather_last_city",
};

/** Maximum number of recent searches to keep */
const MAX_RECENT_SEARCHES = 5;

// ============================================
// DOM Element References
// ============================================

const elements = {
  searchForm: document.getElementById("searchForm"),
  cityInput: document.getElementById("cityInput"),
  searchBtn: document.getElementById("searchBtn"),
  errorMessage: document.getElementById("errorMessage"),
  weatherCard: document.getElementById("weatherCard"),
  datetime: document.getElementById("datetime"),
  backgroundOverlay: document.getElementById("backgroundOverlay"),
  apiHint: document.getElementById("apiHint"),
  recentSearches: document.getElementById("recentSearches"),
  recentList: document.getElementById("recentList"),

  // Weather display fields
  cityName: document.getElementById("cityName"),
  country: document.getElementById("country"),
  temperature: document.getElementById("temperature"),
  condition: document.getElementById("condition"),
  feelsLike: document.getElementById("feelsLike"),
  humidity: document.getElementById("humidity"),
  windSpeed: document.getElementById("windSpeed"),
  pressure: document.getElementById("pressure"),
  weatherIcon: document.getElementById("weatherIcon"),
};

// ============================================
// Initialization
// ============================================

/**
 * Runs when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

/**
 * Sets up event listeners, clock, and restores last search.
 */
function initApp() {
  // Show hint if API key is not configured
  if (!isApiKeyConfigured()) {
    showElement(elements.apiHint);
  }

  // Start live date/time display
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // Bind search form submit (also handles Enter key)
  elements.searchForm.addEventListener("submit", handleSearchSubmit);

  // Quick city buttons (Delhi, Mumbai)
  document.querySelectorAll(".city-suggestion-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const city = btn.dataset.city;
      elements.cityInput.value = city;
      fetchWeather(city);
    });
  });

  // Render saved recent searches
  renderRecentSearches();

  // Auto-load last searched city on page reload
  const lastCity = getLastCity();
  if (lastCity && isApiKeyConfigured()) {
    elements.cityInput.value = lastCity;
    fetchWeather(lastCity);
  }
}

// ============================================
// Date & Time
// ============================================

/**
 * Updates the header with the current date and time.
 */
function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  elements.datetime.textContent = now.toLocaleString(undefined, options);
}

// ============================================
// Search & Validation
// ============================================

/**
 * Handles form submission when user clicks Search or presses Enter.
 * @param {Event} event
 */
async function handleSearchSubmit(event) {
  event.preventDefault();

  const city = elements.cityInput.value.trim();

  if (!validateCityInput(city)) {
    return;
  }

  await fetchWeather(city);
}

/**
 * Validates the city name input.
 * @param {string} city
 * @returns {boolean}
 */
function validateCityInput(city) {
  hideElement(elements.errorMessage);

  if (!city) {
    showError("Please enter a city name.");
    elements.cityInput.focus();
    return false;
  }

  // Allow letters, spaces, hyphens, and apostrophes (common in city names)
  const cityPattern = /^[a-zA-Z\s\-'.]+$/;
  if (!cityPattern.test(city)) {
    showError("City name can only contain letters, spaces, hyphens, and apostrophes.");
    return false;
  }

  if (city.length < 2) {
    showError("City name must be at least 2 characters long.");
    return false;
  }

  if (!isApiKeyConfigured()) {
    showError("API key is missing. Please add your OpenWeatherMap API key in script.js.");
    showElement(elements.apiHint);
    return false;
  }

  return true;
}

/**
 * Checks whether a real API key has been set.
 * @returns {boolean}
 */
function isApiKeyConfigured() {
  return API_KEY && API_KEY !== "YOUR_API_KEY_HERE";
}

// ============================================
// API Integration
// ============================================

/**
 * Fetches weather data for a given city using Fetch API + async/await.
 * @param {string} city
 */
async function fetchWeather(city) {
  // Fetch runs in the background — no loading UI shown on screen
  setLoadingState(true);
  hideElement(elements.errorMessage);

  const url = `${API_BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(getApiErrorMessage(response.status, data));
    }

    displayWeather(data);
    updateBackground(data.weather[0].main);
    saveToLocalStorage(city);
    renderRecentSearches();
  } catch (error) {
    showError(error.message || "Something went wrong. Please try again.");
    resetBackground();
  } finally {
    setLoadingState(false);
  }
}

/**
 * Maps HTTP status codes to user-friendly error messages.
 * @param {number} status
 * @param {object} data
 * @returns {string}
 */
function getApiErrorMessage(status, data) {
  if (status === 404) {
    return "City not found. Please check the spelling and try again.";
  }
  if (status === 401) {
    return "Invalid API key. Please verify your OpenWeatherMap API key.";
  }
  if (status === 429) {
    return "Too many requests. Please wait a moment and try again.";
  }
  return data?.message || "Unable to fetch weather data.";
}

// ============================================
// Display Weather Data
// ============================================

/**
 * Populates the weather card with API response data.
 * @param {object} data - OpenWeatherMap API response
 */
function displayWeather(data) {
  const weather = data.weather[0];

  elements.cityName.textContent = data.name;
  elements.country.textContent = data.sys.country;
  elements.temperature.textContent = `${Math.round(data.main.temp)}°C`;
  elements.condition.textContent = weather.description;
  elements.feelsLike.textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;
  elements.humidity.textContent = `${data.main.humidity}%`;
  elements.windSpeed.textContent = `${data.wind.speed} m/s`;
  elements.pressure.textContent = `${data.main.pressure} hPa`;

  // Weather icon from OpenWeatherMap CDN
  const iconCode = weather.icon;
  elements.weatherIcon.src = `${ICON_BASE_URL}/${iconCode}@2x.png`;
  elements.weatherIcon.alt = weather.description;

  showElement(elements.weatherCard);
}

/**
 * Changes the page background based on weather condition.
 * @param {string} weatherMain - e.g. "Clear", "Clouds", "Rain"
 */
function updateBackground(weatherMain) {
  // Remove any existing weather-* classes from body
  const weatherClasses = Array.from(document.body.classList).filter((cls) =>
    cls.startsWith("weather-")
  );
  document.body.classList.remove(...weatherClasses);

  // Add new class (lowercase for CSS)
  const weatherClass = `weather-${weatherMain.toLowerCase()}`;
  document.body.classList.add(weatherClass);
}

/**
 * Resets background to default when search fails.
 */
function resetBackground() {
  const weatherClasses = Array.from(document.body.classList).filter((cls) =>
    cls.startsWith("weather-")
  );
  document.body.classList.remove(...weatherClasses);
}

// ============================================
// Local Storage
// ============================================

/**
 * Saves city to recent searches and as last searched city.
 * @param {string} city
 */
function saveToLocalStorage(city) {
  const normalizedCity = city.trim();

  // Save last city for auto-reload
  localStorage.setItem(STORAGE_KEYS.LAST_CITY, normalizedCity);

  // Update recent searches (most recent first, no duplicates)
  let recent = getRecentSearches();
  recent = recent.filter(
    (item) => item.toLowerCase() !== normalizedCity.toLowerCase()
  );
  recent.unshift(normalizedCity);
  recent = recent.slice(0, MAX_RECENT_SEARCHES);

  localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(recent));
}

/**
 * @returns {string[]}
 */
function getRecentSearches() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * @returns {string|null}
 */
function getLastCity() {
  return localStorage.getItem(STORAGE_KEYS.LAST_CITY);
}

/**
 * Renders recent search chips in the UI.
 */
function renderRecentSearches() {
  const recent = getRecentSearches();
  elements.recentList.innerHTML = "";

  if (recent.length === 0) {
    hideElement(elements.recentSearches);
    return;
  }

  showElement(elements.recentSearches);

  recent.forEach((city) => {
    const li = document.createElement("li");
    li.className = "recent-item";
    li.textContent = city;
    li.setAttribute("role", "listitem");
    li.setAttribute("tabindex", "0");
    li.setAttribute("aria-label", `Search weather for ${city}`);

    // Click to search again
    li.addEventListener("click", () => {
      elements.cityInput.value = city;
      fetchWeather(city);
    });

    // Keyboard accessibility
    li.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        elements.cityInput.value = city;
        fetchWeather(city);
      }
    });

    elements.recentList.appendChild(li);
  });
}

// ============================================
// UI Helpers
// ============================================

/**
 * Tracks background fetch state (button only — no visible loader).
 * @param {boolean} isLoading
 */
function setLoadingState(isLoading) {
  elements.searchBtn.disabled = isLoading;
  elements.searchForm.classList.toggle("is-fetching", isLoading);
}

/**
 * Displays an error message to the user.
 * @param {string} message
 */
function showError(message) {
  elements.errorMessage.textContent = message;
  showElement(elements.errorMessage);
}

/**
 * @param {HTMLElement} element
 */
function showElement(element) {
  element.hidden = false;
}

/**
 * @param {HTMLElement} element
 */
function hideElement(element) {
  element.hidden = true;
}
