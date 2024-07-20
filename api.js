import { requestJsonFromUrl } from "./http.js";

const HOLIDAY_API_URL = "https://date.nager.at/api/v3";

export const fetchHolidayYear = async (country, year) => {
  const fetchUrl = `${HOLIDAY_API_URL}/PublicHolidays/${year}/${country}`;
  return requestJsonFromUrl(fetchUrl);
};

export const fetchNextPublicHoliday = async (country) => {
  const fetchUrl = `${HOLIDAY_API_URL}/NextPublicHolidays/${country}`;
  return requestJsonFromUrl(fetchUrl);
};

export const fetchCountryInfo = async (countryCode) => {
  const fetchUrl = `${HOLIDAY_API_URL}/CountryInfo/${countryCode}`;
  return requestJsonFromUrl(fetchUrl);
};
