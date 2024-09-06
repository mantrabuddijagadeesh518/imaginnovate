import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';

const WeatherForecast = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeatherData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
        params: {
          q: city,
          appid: '15ca787f2d191cf1f09525804a2ce85d',
          units: 'metric',
        },
      });

      const uniqueDays = response.data.list.filter((reading, index, self) =>
        index === self.findIndex((t) => new Date(t.dt_txt).getDate() === new Date(reading.dt_txt).getDate())
      );

      setWeatherData(uniqueDays.slice(0, 5));
    } catch (err) {
      setError('City not found or try with another name.');
      setWeatherData([]);
    }
    setLoading(false);
  };

  const handleCityChange = (e) => setCity(e.target.value);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
<div className="weather-container">
  <div className="search-section">
  <h1 className="weather-title">Weather in your city</h1>

    <input 
      type="text" 
      value={city} 
      onChange={handleCityChange} 
      placeholder="Enter city name"
      className="city-input"
    />
    <button onClick={fetchWeatherData}>
      <FontAwesomeIcon icon={faQuestionCircle} style={{ marginRight: '8px' }} /> Search
    </button>
    {loading && (
      <div className="loader">
        <FontAwesomeIcon icon={faSpinner} spin size="lg" />
      </div>
    )}
  </div>

  {error && <div className="error">{error}</div>}

  <div className="weather-grid">
    {weatherData.map((weather, index) => (
      <div key={index} className="weather-card">
        <h3 className="date-header">
          Date: {formatDate(weather.dt_txt)}
        </h3>
        <table className="weather-table">
          <thead>
            <tr>
              <th colSpan="2">Temperature</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Min</td>
              <td>Max</td>
            </tr>
            <tr>
              <td>{weather.main.temp_min}°C</td>
              <td>{weather.main.temp_max}°C</td>
            </tr>
            <tr className="no-background">
              <td>Pressure</td>
              <td>{weather.main.pressure} hPa</td>
            </tr>
            <tr className="no-background">
              <td>Humidity</td>
              <td>{weather.main.humidity}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    ))}
  </div>
</div>

  );
};

export default WeatherForecast;
