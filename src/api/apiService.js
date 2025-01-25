import axios from 'axios'

const getWeatherByCity = (city) => {
    return axios.get(`http://localhost:8080/weather/${city}`)
}
const getWeatherForecastByCity = (city) => {
    return axios.get(`http://localhost:8080/forecast/${city}`)
}

export { getWeatherByCity, getWeatherForecastByCity }