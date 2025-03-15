import React, { useEffect, useState } from "react";
import "./App.scss";
import {
  getWeatherByCity,
  getWeatherForecastDailyByCity,
  getWeatherForecastHourlyByCity,
} from "./api/apiService";
import { CiSearch } from "react-icons/ci";
import { toast, ToastContainer } from "react-toastify";
import ModalHourlyDetail from "./components/ModalHourlyDetail";
import "bootstrap/dist/css/bootstrap.min.css";
import ModalDailyDetail from "./components/ModalDailyDetail";
import "react-toastify/dist/ReactToastify.css";
import { WiHumidity } from "react-icons/wi";
import { RiWindyLine } from "react-icons/ri";
import { AiFillThunderbolt } from "react-icons/ai";
import { FiSunrise, FiSunset } from "react-icons/fi";
import { FaHand } from "react-icons/fa6";

const App = () => {
  const [city, setCity] = useState("Hanoi");
  const [weatherDataCurrent, setWeatherDataCurrent] = useState(null);
  const [weatherDataDaily, setWeatherDataDaily] = useState(null);
  const [weatherDataHourly, setWeatherDataHourly] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [dataModalHourlyDetail, setDataModalHourlyDetail] = useState({});
  const [dataModalDailyDetail, setDataModalDailyDetail] = useState({});
  const [isDailyModal, setIsDailyModal] = useState(false);
  const [isErrorToastShown, setIsErrorToastShown] = useState(false);

  useEffect(() => {
    setIsErrorToastShown(false);
    fetchWeatherCurrent();
    fetchWeatherDaily();
    fetchWeatherHourly();
  }, []);

  const handleSearch = async () => {
    setIsErrorToastShown(false);
    try {
      await fetchWeatherCurrent();
      await fetchWeatherHourly();
      await fetchWeatherDaily();
    } catch (error) {
      setIsErrorToastShown(false);
      console.error(error);
    }
  };

  const handleError = (error) => {
    if (error.response?.data?.code === 404 && !isErrorToastShown) {
      toast.error(error.response.data.message);
      setIsErrorToastShown(true);
      throw error;
    }
  };

  const fetchWeatherCurrent = async () => {
    try {
      const res = await getWeatherByCity(city);
      setWeatherDataCurrent(res.data);
      setIsErrorToastShown(false);
    } catch (error) {
      handleError(error);
    }
  };
  const fetchWeatherHourly = async () => {
    try {
      const res = await getWeatherForecastHourlyByCity(city);
      setWeatherDataHourly(res.data.list.slice(0, 5));
      setIsErrorToastShown(false);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchWeatherDaily = async () => {
    try {
      const res = await getWeatherForecastDailyByCity(city);
      const dailyData = res.data.list
        .reduce((acc, entry) => {
          const date = new Date(entry.dt * 1000);
          const hours = date.getHours();

          if (hours >= 0 && hours <= 21) {
            const existingDay = acc.find(
              (day) =>
                new Date(day.dt * 1000).toDateString() === date.toDateString()
            );

            if (existingDay) {
              existingDay.temperatures.push(entry.main.temp);
            } else {
              acc.push({
                ...entry,
                temperatures: [entry.main.temp],
              });
            }
          }

          return acc;
        }, [])
        .map((day) => ({
          ...day,
          averageTemp:
            day.temperatures.reduce((prev, current) => prev + current, 0) /
            day.temperatures.length,
        }));
      // Filter out the current day's data
      const today = new Date().toDateString();
      const filteredDailyData = dailyData.filter(
        (day) => new Date(day.dt * 1000).toDateString() !== today
      );
      setWeatherDataDaily(filteredDailyData);
      setIsErrorToastShown(false);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <div className="weather-app-container">
        <div className="weather-title">Weather App</div>
        <div className="search-bar">
          <input
            type="search"
            placeholder="Search..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <span onClick={handleSearch} className="search-icon">
            <CiSearch />
          </span>
        </div>
        <div className="weather-content">
          <div className="current-weather-container">
            <ToastContainer />
            {weatherDataCurrent && (
              <div className="current-info">
                <div className="generals">
                  <div className="city">{weatherDataCurrent.name}</div>
                  <span className="date-time">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <div className="temperature">
                    <div className="temp-icon">
                      {weatherDataCurrent.weather &&
                        weatherDataCurrent.weather[0] && (
                          <img
                            src={`https://openweathermap.org/img/wn/${weatherDataCurrent.weather[0].icon}@2x.png`}
                            alt="weather icon"
                          />
                        )}
                    </div>
                    <div className="temp-desc">
                      {weatherDataCurrent.weather &&
                        weatherDataCurrent.weather[0]?.description}
                    </div>
                    <div className="temp-value">
                      {Math.round(weatherDataCurrent.main.temp)}°C
                    </div>
                  </div>
                </div>
                <div className="details">
                  <div className="info-box">
                    <div className="icon">
                      <FaHand />
                    </div>
                    <div className="value">
                      {Math.round(weatherDataCurrent.main.feels_like)}°C
                    </div>
                    <div className="label">Feels Like</div>
                  </div>

                  <div className="info-box">
                    <div className="icon">
                      <WiHumidity />
                    </div>
                    <div className="value">
                      {weatherDataCurrent.main.humidity}%
                    </div>
                    <div className="label">Humidity</div>
                  </div>

                  <div className="info-box">
                    <div className="icon">
                      <RiWindyLine />
                    </div>
                    <div className="value">
                      {weatherDataCurrent.wind.speed} m/s
                    </div>
                    <div className="label">Wind Speed</div>
                  </div>

                  <div className="info-box">
                    <div className="icon">
                      <AiFillThunderbolt />
                    </div>
                    <div className="value">
                      {weatherDataCurrent.main.pressure} hPa
                    </div>
                    <div className="label">Pressure</div>
                  </div>
                  <div className="info-box">
                    <div className="icon">
                      <FiSunrise />
                    </div>
                    <div className="value">
                      {new Date(
                        weatherDataCurrent.sys.sunrise * 1000
                      ).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                    <div className="label">Sunrise</div>
                  </div>

                  <div className="info-box">
                    <div className="icon">
                      <FiSunset />
                    </div>
                    <div className="value">
                      {new Date(
                        weatherDataCurrent.sys.sunset * 1000
                      ).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                    <div className="label">Sunset</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="forecast-weather-container">
            <div className="forecast-title">Extended Forecast</div>
            <div className="forecast-weather-hourly">
              <div className="forecast-title-hourly">Hourly (Each 3 hours)</div>
              <div className="forecast-hours">
                {weatherDataHourly.map((entry, index) => {
                  const date = new Date(entry.dt * 1000);
                  const time = date.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const iconUrl = `https://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`;
                  const description = entry.weather[0].description;
                  const temp = Math.round(entry.main.temp);

                  return (
                    <div
                      className="forecast-hour"
                      key={index}
                      onClick={() => {
                        setDataModalHourlyDetail(entry);
                        setIsDailyModal(false);
                        setIsShowModal(true);
                      }}
                    >
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
                    const dayOfWeek = date.toLocaleDateString("en-US", {
                      weekday: "long",
                    });
                    const iconUrl = `https://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`;
                    const description = entry.weather[0].description;
                    const temp = Math.round(entry.averageTemp);

                    return (
                      <div
                        className="forecast-day"
                        key={index}
                        onClick={() => {
                          setDataModalDailyDetail(entry);
                          setIsDailyModal(true);
                          setIsShowModal(true);
                        }}
                      >
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
        {isShowModal &&
          (isDailyModal ? (
            <ModalDailyDetail
              show={isShowModal}
              setShow={setIsShowModal}
              data={dataModalDailyDetail}
            />
          ) : (
            <ModalHourlyDetail
              show={isShowModal}
              setShow={setIsShowModal}
              data={dataModalHourlyDetail}
            />
          ))}
      </div>
    </>
  );
};

export default App;
