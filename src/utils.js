import fromUnixTime from 'date-fns/fromUnixTime';

function formatDate(unix, offset, dateFormat = 'full') {
    const date = fromUnixTime(unix + offset).toUTCString();
    let dayOfWeek = date.slice(0, 3);
    let dayOfMonth = date.slice(5, 7);
    const month = date.slice(8, 11);
    const year = date.slice(14, 16);
    let suffix;

    if (dayOfMonth < 10) {
        dayOfMonth = dayOfMonth.slice(1);
    }

    if (dayOfMonth.slice(-1) === '1') {
        suffix = 'st';
    } else if (dayOfMonth.slice(-1) === '2') {
        suffix = 'nd';
    } else if (dayOfMonth.slice(-1) === '3') {
        suffix = 'rd';
    } else {
        suffix = 'th';
    }

    if (dayOfMonth > 3 && dayOfMonth < 21) {
        suffix = 'th';
    }

    if (dayOfWeek === 'Mon') {
        dayOfWeek = 'Monday';
    } else if (dayOfWeek === 'Tue') {
        dayOfWeek = 'Tuesday';
    } else if (dayOfWeek === 'Wed') {
        dayOfWeek = 'Wednesday';
    } else if (dayOfWeek === 'Thu') {
        dayOfWeek = 'Thursday';
    } else if (dayOfWeek === 'Fri') {
        dayOfWeek = 'Friday';
    } else if (dayOfWeek === 'Sat') {
        dayOfWeek = 'Saturday';
    } else if (dayOfWeek === 'Sun') {
        dayOfWeek = 'Sunday';
    }

    if (dateFormat === 'day') {
        return dayOfWeek;
    }

    return `${dayOfWeek}, ${dayOfMonth}${suffix} ${month} '${year}`;
}

function proccessData(data) {
    const current = currentWeather(data);
    const forecast = weatherForecast(data);
    return { current, forecast };
}

async function getCoords(city) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=20f7632ffc2c022654e4093c6947b4f4`
    );
    const weatherData = await response.json();
    const { coord } = weatherData;
    coord.name = weatherData.name;
    coord.country = weatherData.sys.country;

    return { lat: coord.lat, lon: coord.lon };
}

function currentWeather(data) {
    return {
        temp: data.current.temp,
        feels_like: data.current.feels_like,
        humidity: data.current.humidity,
        rainChance: `${data.daily[0].pop * 100}%`,
        wind: data.current.wind_speed * 3.6,
        condition: data.current.weather[0].main,
        icon: data.current.weather[0].icon,
        date: formatDate(data.current.dt, 0)
    };
}

function weatherForecast(data) {
    const forecast = [];
    for (let day in data.daily) {
        forecast.push({
            mintemp: Math.round(data.daily[day].temp.min),
            maxtemp: Math.round(data.daily[day].temp.max),
            condition: data.daily[day].weather[0].main,
            icon: data.daily[day].weather[0].icon,
            date: formatDate(data.daily[day].dt, 0, 'day')
        });
    }
    return forecast;
}

export { formatDate, getCoords, proccessData };
