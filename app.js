const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    try {
        // Default city: Addis Ababa
        const defaultCity = 'Addis Ababa';
        
        // Get city coordinates
        const location = await getCityCoordinates(defaultCity);
        
        // Get weather data for the week
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=auto`;
        
        const response = await axios.get(weatherUrl);
        const daily = response.data.daily;
        
        // Process weather data for 7 days
        const weeklyWeather = [];
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(daily.time[i]);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            weeklyWeather.push({
                day: i === 0 ? 'Today' : dayName,
                date: dateString,
                icon: getWeatherIcon(daily.weathercode[i]),
                maxTemp: Math.round(daily.temperature_2m_max[i]),
                minTemp: Math.round(daily.temperature_2m_min[i]),
                precipitation: daily.precipitation_sum[i],
                windSpeed: Math.round(daily.windspeed_10m_max[i])
            });
        }
        
        res.render('index', {
            weather: {
                location: `${location.name}, ${location.country}`,
                weekly: weeklyWeather
            },
            error: null
        });
        
    } catch (err) {
        // If default city fails, show empty page
        res.render('index', { weather: null, error: null });
    }
});

// New route to get weather by coordinates (for current location)
app.post('/weather-by-coords', async (req, res) => {
    const { lat, lon } = req.body;
    
    try {
        // Get location name from coordinates (reverse geocoding)
        const reverseGeocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?latitude=${lat}&longitude=${lon}&count=1&language=en&format=json`;
        
        let locationName = `${lat}, ${lon}`; // fallback
        try {
            const geoResponse = await axios.get(reverseGeocodeUrl);
            if (geoResponse.data.results && geoResponse.data.results.length > 0) {
                const result = geoResponse.data.results[0];
                locationName = `${result.name}, ${result.country}`;
            }
        } catch (geoError) {
            // Use coordinates as fallback if reverse geocoding fails
        }
        
        // Get weather data for the week
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=auto`;
        
        const response = await axios.get(weatherUrl);
        const daily = response.data.daily;
        
        // Process weather data for 7 days
        const weeklyWeather = [];
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(daily.time[i]);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            weeklyWeather.push({
                day: i === 0 ? 'Today' : dayName,
                date: dateString,
                icon: getWeatherIcon(daily.weathercode[i]),
                maxTemp: Math.round(daily.temperature_2m_max[i]),
                minTemp: Math.round(daily.temperature_2m_min[i]),
                precipitation: daily.precipitation_sum[i],
                windSpeed: Math.round(daily.windspeed_10m_max[i])
            });
        }
        
        res.json({
            success: true,
            weather: {
                location: locationName,
                weekly: weeklyWeather
            }
        });
        
    } catch (err) {
        res.json({ 
            success: false,
            error: err.message || 'Unable to fetch weather data for current location.' 
        });
    }
});

// Function to get coordinates from city name
async function getCityCoordinates(cityName) {
    try {
        const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
        const response = await axios.get(geocodeUrl);
        
        if (response.data.results && response.data.results.length > 0) {
            const result = response.data.results[0];
            return {
                lat: result.latitude,
                lon: result.longitude,
                name: result.name,
                country: result.country
            };
        } else {
            throw new Error('City not found');
        }
    } catch (error) {
        throw new Error('Unable to find city coordinates');
    }
}

// Function to get weather icon based on weather code
function getWeatherIcon(weatherCode) {
    const weatherIcons = {
        0: '☀️', // Clear sky
        1: '🌤️', // Mainly clear
        2: '⛅', // Partly cloudy
        3: '☁️', // Overcast
        45: '🌫️', // Fog
        48: '🌫️', // Depositing rime fog
        51: '🌦️', // Light drizzle
        53: '🌦️', // Moderate drizzle
        55: '🌦️', // Dense drizzle
        61: '🌧️', // Slight rain
        63: '🌧️', // Moderate rain
        65: '🌧️', // Heavy rain
        71: '🌨️', // Slight snow
        73: '🌨️', // Moderate snow
        75: '🌨️', // Heavy snow
        77: '❄️', // Snow grains
        80: '🌦️', // Slight rain showers
        81: '🌧️', // Moderate rain showers
        82: '⛈️', // Violent rain showers
        85: '🌨️', // Slight snow showers
        86: '🌨️', // Heavy snow showers
        95: '⛈️', // Thunderstorm
        96: '⛈️', // Thunderstorm with hail
        99: '⛈️'  // Thunderstorm with heavy hail
    };
    return weatherIcons[weatherCode] || '🌡️';
}

app.post('/weather', async (req, res) => {
    const { city } = req.body;
    
    try {
        // Get city coordinates
        const location = await getCityCoordinates(city);
        
        // Get weather data for the week
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=auto`;
        
        const response = await axios.get(weatherUrl);
        const daily = response.data.daily;
        
        // Process weather data for 7 days
        const weeklyWeather = [];
        const today = new Date();
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(daily.time[i]);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            weeklyWeather.push({
                day: i === 0 ? 'Today' : dayName,
                date: dateString,
                icon: getWeatherIcon(daily.weathercode[i]),
                maxTemp: Math.round(daily.temperature_2m_max[i]),
                minTemp: Math.round(daily.temperature_2m_min[i]),
                precipitation: daily.precipitation_sum[i],
                windSpeed: Math.round(daily.windspeed_10m_max[i])
            });
        }
        
        res.render('index', {
            weather: {
                location: `${location.name}, ${location.country}`,
                weekly: weeklyWeather
            },
            error: null
        });
        
    } catch (err) {
        res.render('index', { 
            weather: null, 
            error: err.message || 'Unable to fetch weather data. Please check the city name and try again.' 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));