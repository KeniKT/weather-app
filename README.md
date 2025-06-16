# 🌤️ Weekly Weather Forecast App

## 📝 About This Project

The **Weekly Weather Forecast App** is a dynamic web application that allows users to view a 7-day weather forecast for any city in the world or based on their current location. Built using **Node.js**, **Express**, and **EJS**, the app integrates with the [Open-Meteo API](https://open-meteo.com/) to retrieve accurate and up-to-date weather data, including temperature highs and lows, precipitation, wind speeds, and weather condition codes.

The app is designed to be responsive and user-friendly. Users can either type in the name of a city or click the “📍 Use Current Location” button to get the weather forecast for where they are. When a city is entered, the app uses the Open-Meteo **Geocoding API** to convert the city name into latitude and longitude coordinates. If the user opts to use their current location, the app uses the browser's **Geolocation API** and then applies reverse geocoding to display the nearest city name. 

Once the coordinates are obtained, the Open-Meteo **Forecast API** is called with daily parameters for weather conditions. The response is processed, formatted into a presentable format using EJS templates, and then displayed as daily weather cards. Each card shows the day of the week, date, a weather emoji (based on the weather code), temperature range, precipitation, and wind speed.

This project is ideal for learning how to work with third-party APIs, implement server-side rendering, handle asynchronous JavaScript operations, and create clean, mobile-friendly front-end interfaces.

---

## 🚀 Features

- 🌍 Search by city or use geolocation
- 📅 7-day forecast display
- 🌤️ Weather icons for visual representation
- 🌧️ Precipitation & 💨 wind speed indicators
- ⚠️ Graceful error handling
- 📱 Responsive design

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: HTML, CSS, EJS Templates
- **APIs**:
  - [Open-Meteo Forecast API](https://open-meteo.com/)
  - [Open-Meteo Geocoding API](https://open-meteo.com/)
- **Other**:
  - Axios (for HTTP requests)
  - JavaScript Fetch API (for client-side POST requests)
  - Geolocation API (for user’s current location)

---

## 📦 Installation

1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-username/weather-app.git
   cd weather-app
