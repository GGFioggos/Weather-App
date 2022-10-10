import { getForecast } from './apistuff';
import { setupPage } from './domstuff';
import { getUserLocation } from './utils';

//DEFAULT LOAD BASED ON LOCATION
getUserLocation().then((defaultCity) => {
    citySelected(defaultCity);
});

async function citySelected(city) {
    const data = await getForecast(city);
    setupPage(data);
}

export { citySelected };
