import axios from 'axios'

const getWeatherByCity = (city) => {
    return axios.get(`http://localhost:8080/weather/${city}`)
}
const getWeatherForecastHourlyByCity = (city) => {
    return axios.get(`http://localhost:8080/forecast/${city}`)
}
const getWeatherForecastDailyByCity = (city) => {
    return axios.get(`http://localhost:8080/forecast/${city}`)
}

export { getWeatherByCity, getWeatherForecastHourlyByCity, getWeatherForecastDailyByCity }