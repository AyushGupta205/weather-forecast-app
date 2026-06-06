# Weather Forecast Web App

A modern, responsive weather forecast application built with **HTML**, **CSS**, and **JavaScript** using the [OpenWeatherMap API](https://openweathermap.org/api).

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## Live Demo

Open `index.html` in a browser or run a local server.

## Features

- Search weather by city name
- Quick search buttons for **Delhi** and **Mumbai**
- Displays city, country, temperature, condition, icon, humidity, wind speed, feels-like, and pressure
- Live date and time in the header
- Recent searches saved with **Local Storage**
- Last searched city auto-loads on page refresh
- Silent background fetch (no loading spinner on screen)
- Error handling for invalid cities and API failures
- Clean white UI with sky-blue accents
- Fully responsive — mobile, tablet, and desktop

## Screenshots

_Add screenshots here after deploying._

## Tech Stack

| Technology | Use |
|------------|-----|
| HTML5 | Page structure & semantic markup |
| CSS3 | Flexbox, Grid, responsive design |
| JavaScript | Fetch API, Async/Await, DOM manipulation |
| OpenWeatherMap API | Live weather data |
| Local Storage | Recent searches & last city |

## Project Structure

```
weatherap/
├── index.html    # App layout and UI components
├── style.css     # Styling and responsive design
├── script.js     # API integration and app logic
└── README.md     # Project documentation
```

## Getting Started

### 1. Clone or download

```bash
git clone https://github.com/YOUR_USERNAME/weather-forecast-app.git
cd weather-forecast-app
```

### 2. Get an API key

1. Sign up at [openweathermap.org/api](https://openweathermap.org/api)
2. Copy your free API key

### 3. Add your API key

Open `script.js` and replace `YOUR_API_KEY_HERE` with your own key:

```javascript
const API_KEY = "YOUR_API_KEY_HERE";  // ← paste your key here
```

> **Security note:** Never upload your real API key to GitHub. The repo uses a placeholder so others can add their own key after cloning.

### 4. Run the app

**Option A — Open directly**

Double-click `index.html`

**Option B — Local server (recommended)**

```bash
python -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080)

## How to Use

1. Type a city name in the search bar (e.g. `Delhi`, `Mumbai`, `London`)
2. Press **Search** or hit **Enter**
3. View the weather card with current conditions
4. Click **Delhi** or **Mumbai** for instant results
5. Recent searches appear below for quick access

## API Endpoint

```
GET https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric
```

## Key JavaScript Concepts Used

- `async/await` for API calls
- `fetch()` for HTTP requests
- DOM manipulation (`getElementById`, `textContent`, `classList`)
- Event handling (form submit, button clicks, keyboard)
- Input validation with regex
- `localStorage` for persistent data
- Error handling with `try/catch`

## Responsive Breakpoints

| Screen | Layout |
|--------|--------|
| Desktop | 3-column weather details grid |
| Tablet | Adjusted padding and spacing |
| Mobile | Stacked search bar, single-column details |

## Upload to GitHub

1. Create a new repository on [github.com/new](https://github.com/new)
2. Upload these files:
   - `index.html`
   - `style.css`
   - `script.js` (with `YOUR_API_KEY_HERE` placeholder only)
   - `README.md`
3. After cloning locally, add your real API key in `script.js` for personal use

## Future Improvements

- [ ] 5-day weather forecast
- [ ] Geolocation (use my location)
- [ ] Dark / light theme toggle
- [ ] Backend proxy to hide API key

## Author

**Your Name** — AyushGupta205

## License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).

## Acknowledgements

- [OpenWeatherMap](https://openweathermap.org/) for weather data
- [Google Fonts — Inter](https://fonts.google.com/specimen/Inter)
