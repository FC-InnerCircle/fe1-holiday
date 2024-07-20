import {
  fetchCountryInfo,
  fetchHolidayYear,
  fetchNextPublicHoliday,
} from "./api.js";
import { isHTTPError } from "./error.js";

const [, , countryCodeInput, yearOrNext] = process.argv;

const checkInputValues = (countryCodeInput, yearOrNext) => {
  if (!countryCodeInput || !yearOrNext) {
    console.error(
      "Please provide a country code and a year or 'next' as arguments"
    );
    process.exit(1);
  }

  if (countryCodeInput.length !== 2) {
    console.error("Country code must be 2 characters long");
    process.exit(1);
  }
};

const validateCountryCode = async (countryCode) => {
  try {
    await fetchCountryInfo(countryCode);
    return true;
  } catch (error) {
    if (isHTTPError(error)) {
      if (error.code === 404) {
        console.error(`Wrong country code: ${countryCode}`);
        return false;
      }
    }
  }
};

const extractYearOrNext = (yearOrNext) => {
  const isNext =
    isNaN(parseInt(yearOrNext)) && String(yearOrNext).toLowerCase() === "next";
  const year = isNext ? new Date().getFullYear() : parseInt(yearOrNext);

  return {
    isNext,
    year,
  };
};

const validateInputValues = async (countryCode, yearOrNext) => {
  checkInputValues(countryCode, yearOrNext);
  const isValid = await validateCountryCode(countryCode);

  if (!isValid) {
    throw new Error("Invalid country code");
  }
};

const handleErrorFetchHolidays = (error) => {
  if (isHTTPError(error)) {
    if (error.code === 400) {
      console.error("Validation Failure");
    }
    if (error.code === 404) {
      console.error(`Wrong country code`);
    }
  }
};

(async function () {
  try {
    await validateInputValues(countryCodeInput, yearOrNext);
  } catch (error) {
    process.exit(1);
  }

  const { isNext, year } = extractYearOrNext(yearOrNext);
  const countryCode = countryCodeInput.toUpperCase();

  try {
    const holidays = isNext
      ? await fetchNextPublicHoliday(countryCode)
      : await fetchHolidayYear(countryCode, year);

    if (holidays.length === 0) {
      throw new Error("No holidays found");
    }

    const result = holidays.map((holiday) => {
      return [holiday.date, holiday.name, holiday.localName].join(" ");
    });
    console.log(result.join("\n"));
    process.exit(0);
  } catch (error) {
    handleErrorFetchHolidays(error);
    process.exit(1);
  }
})();
