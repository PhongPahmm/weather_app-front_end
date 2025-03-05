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
    fetchWeatherHourly()
    setCity('')
  }
  const fetchWeatherCurrent = async () => {
    const res = await getWeatherByCity(city)
    console.log('res', res);

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
  // const fetchWeatherDaily = async () => {
  //   const res = await getWeatherForecastDailyByCity(city)

  //   const dailyData = res.data.list.reduce((acc, entry) => {
  //     const date = new Date(entry.dt * 1000);
  //     const hours = date.getHours();

  //     // Filter entries between 0:00 and 21:00
  //     if (hours >= 0 && hours <= 21) {
  //       const existingDay = acc.find(day => 
  //         new Date(day.dt * 1000).toDateString() === date.toDateString()
  //       );

  //       if (existingDay) {
  //         existingDay.temperatures.push(entry.main.temp);
  //       } else {
  //         acc.push({
  //           ...entry,
  //           temperatures: [entry.main.temp]
  //         });
  //       }
  //     }

  //     return acc;
  //   }, []).map(day => ({
  //     ...day,
  //     averageTemp: day.temperatures.reduce((a, b) => a + b, 0) / day.temperatures.length
  //   }));

  //   setWeatherDataDaily(dailyData);
  // }

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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <span onClick={handleSearch} className='search-icon'><CiSearch /></span>
      </div>
      <div className='weather-content'>
        <div className='current-weather-container'>
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
                    {Math.round(weatherDataCurrent.main.temp)}°C
                  </div>
                </div>
              </div>
              <div className="details">
                <div className="info-box">
                  <div className="icon">🤲</div>
                  <div className="value">{Math.round(weatherDataCurrent.main.feels_like)}°C</div>
                  <div className="label">Feels Like</div>
                </div>

                <div className="info-box">
                  <div className="icon">💧</div>
                  <div className="value">{weatherDataCurrent.main.humidity}%</div>
                  <div className="label">Humidity</div>
                </div>

                <div className="info-box">
                  <div className="icon">💨</div>
                  <div className="value">{weatherDataCurrent.wind.speed} m/s</div>
                  <div className="label">Wind Speed</div>
                </div>

                <div className="info-box">
                  <div className="icon">⚡</div>
                  <div className="value">{weatherDataCurrent.main.pressure} hPa</div>
                  <div className="label">Pressure</div>
                </div>
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
                const date = new Date(entry.dt * 1000);
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
                  const date = new Date(entry.dt * 1000);
                  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
                  const iconUrl = `https://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`;
                  const description = entry.weather[0].description;
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
