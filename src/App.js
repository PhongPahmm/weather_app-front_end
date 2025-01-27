import React, { useEffect, useState } from 'react'
import './App.scss';
import { getWeatherByCity, getWeatherForecastDailyByCity, getWeatherForecastHourlyByCity } from './api/apiService';
import { CiSearch } from "react-icons/ci";

function App() {
  const [city, setCity] = useState('Hanoi')
  const [weatherDataCurrent, setWeatherDataCurrent] = useState(null)
  const [weatherDataDaily, setWeatherDataDaily] = useState(null)
  const [weatherDataHourly, setWWeatherDataHourly] = useState([])

  useEffect(() => {
    fetchWeatherCurrent()
    fetchWeatherDaily()
    fetchWeatherHourly()
  }, [])

  const handleSearch = () => {
    fetchWeatherCurrent()
    fetchWeatherDaily()
  }
  const fetchWeatherCurrent = async () => {
    const res = await getWeatherByCity(city)
    setWeatherDataCurrent(res.data)
  }
  const fetchWeatherHourly = async () => {
    const res = await getWeatherForecastHourlyByCity(city)
    setWWeatherDataHourly(res.data.list.slice(0, 5));
  }
  const fetchWeatherDaily = async () => {
    const res = await getWeatherForecastDailyByCity(city)
    const dailyData = res.data.list.filter((entry) =>
      entry.dt_txt.includes("9:00:00")
    );

    setWeatherDataDaily(dailyData)
  }

  return (
    <div className="weather-app-container">
      <div className='weather-title'>
        Weather App
      </div>
      <div className='search-bar'>
        <input
          type='search'
          placeholder='Search...'
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <span onClick={handleSearch} className='search-icon'><CiSearch /></span>
      </div>
      <div className='weather-content'>
        <div className='current-weather-container'>
          <div className='current-title'>
            Current weather
          </div>
          {weatherDataCurrent &&
            <div className='current-info'>
              <div className='generals'>
                <div className="city">{weatherDataCurrent.name}</div>
                <div className="temperature">
                  <div className="temp-icon">
                    {weatherDataCurrent.weather && weatherDataCurrent.weather[0] && (
                      <img
                        src={`https://openweathermap.org/img/wn/${weatherDataCurrent.weather[0].icon}@2x.png`}
                        alt="weather icon"
                      />
                    )}
                  </div>
                  <div className="temp-desc">
                    {weatherDataCurrent.weather && weatherDataCurrent.weather[0]?.description}
                  </div>
                  <div className="temp-value">
                    {weatherDataCurrent.main.temp}°C
                  </div>
                </div>
              </div>
              <div className="details">
                <div>Feels like: {weatherDataCurrent.main?.feels_like}°C</div>
                <div>Humidity: {weatherDataCurrent.main?.humidity}%</div>
                <div>Wind: {weatherDataCurrent.wind?.speed} m/s</div>
                <div>Pressure: {weatherDataCurrent.main?.pressure} hPa</div>
              </div>
            </div>
          }
        </div>

        <div className="forecast-weather-container">
          <div className="forecast-title">Extended Forecast</div>
          <div className='forecast-weather-hourly'>
            <div className="forecast-title-hourly">Hourly (Each 3 hours)</div>
            <div className="forecast-hours">
              {weatherDataHourly.map((entry, index) => {
                const date = new Date(entry.dt * 1000); // Convert timestamp to Date
                const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
                const iconUrl = `https://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`;
                const description = entry.weather[0].description;
                const temp = entry.main.temp;

                return (
                  <div className="forecast-hour" key={index}>
                    <div className="time">{time}</div>
                    <div className="icon">
                      <img src={iconUrl} alt={description} />
                    </div>
                    <div className="description">{description}</div>
                    <div className="temp">{temp}°C</div>
                  </div>
                );
              })}
            </div>
          </div>
          {weatherDataDaily && (
            <div className="forecast-weather-daily">
              <div className="forecast-title-daily">Daily</div>
              <div className="forecast-days">
                {weatherDataDaily.map((entry, index) => {
                  const date = new Date(entry.dt * 1000); // Chuyển timestamp thành đối tượng Date
                  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" }); // Lấy thứ
                  const iconUrl = `https://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`; // Icon thời tiết
                  const description = entry.weather[0].description; // Mô tả
                  const temp = entry.main.temp;

                  return (
                    <div className="forecast-day" key={index}>
                      <div className="day-of-week">{dayOfWeek}</div>
                      <div className="icon">
                        <img src={iconUrl} alt={description} />
                      </div>
                      <div className="description">{description}</div>
                      <div className="temp">{temp}°C</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
