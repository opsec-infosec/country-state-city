import cityList from './assets/city.json';
import { compare, convertArrayToObject } from './utils';
import { ICity } from './interface';

const KEYS = [
	"name",
	"countryCode",
	"stateCode",
	"latitude",
	"longitude"
]

let convertedCityList: ICity[] = [];
// Get a list of all cities.
function getAllCities(keys: string[]): ICity[] {
	if (convertedCityList.length) {
		return convertedCityList;
	}

	const cityJSON: string[][] = cityList;
	convertedCityList = convertArrayToObject(keys, cityJSON);
	return (convertedCityList as unknown as ICity[])
}

// Get a list of cities with the city name as a key
function getCityOfState(cityName: string, countryCode: string, stateCode: string): ICity[] {
    if (!stateCode) return [];
    if (!countryCode) return [];
    if (!cityName) return [];

    const cityList = getAllCities(KEYS)
    const city = (cityList as ICity[]).filter((values: { name: string, countryCode: string, stateCode: string }) => {
        return values.countryCode === countryCode && values.stateCode === stateCode && values.name === cityName
    })
    return city.sort(compare)

}

// Get a list of cities belonging to a specific state and country.
function getCitiesOfState(countryCode: string, stateCode: string): ICity[] {
	if (!stateCode) return [];
	if (!countryCode) return [];

	const cityList = getAllCities(KEYS);
	const cities = (cityList as ICity[]).filter((value: { countryCode: string; stateCode: string }) => {
		return value.countryCode === countryCode && value.stateCode === stateCode;
	});

	return cities.sort(compare);
}

// Get a list of cities belonging to a specific country.
function getCitiesOfCountry(countryCode: string): ICity[] | undefined {
	if (!countryCode) return [];

	const cityList = getAllCities(KEYS);
	const cities = (cityList as ICity[]).filter((value: { countryCode: string }) => {
		return value.countryCode === countryCode;
	});
	return cities.sort(compare);
}

function sortByStateAndName(cities: ICity[]): ICity[] {
	return cities.sort((a, b) => {
		const result = compare<ICity>(a, b, (entity) => {
			return `${entity.countryCode}-${entity.stateCode}`;
		});
		if (result !== 0) return result;
		return compare(a, b);
	});
}

export default {
	getAllCities,
    getCityOfState,
	getCitiesOfState,
	getCitiesOfCountry,
	sortByStateAndName,
};
