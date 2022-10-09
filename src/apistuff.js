import { getCoords, processData } from './utils';

// const API_KEY = 'c52db2ca830438127da009af8d03b39b';
const API_KEY_ONE = '20f7632ffc2c022654e4093c6947b4f4';

async function getForecast(city) {
    const coords = await getCoords(city);

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY_ONE}`
    );
    const data = await response.json();
    const processedData = processData(data);
    console.log(processedData);
    return processedData;
}

export { getForecast };
