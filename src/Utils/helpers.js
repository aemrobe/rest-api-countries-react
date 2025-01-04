import { TIME_OUT_SEC } from "../config/config";

const timeout = function (TIME_OUT_SEC) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long, Please try Again!`));
    }, TIME_OUT_SEC * 1000);
  });
};

export const getJson = async function (API_URL, errMessage, options = {}) {
  try {
    const res = await Promise.race([
      timeout(TIME_OUT_SEC),
      fetch(API_URL, options),
    ]);

    if (!res.ok) throw new Error(`${errMessage}`);

    const data = await res.json();

    return data;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

export const mapArray = function (arr, search) {
  console.log(arr);
  const flags = arr.map((country) =>
    country.flags ? country.flags : search ? "No Flag data" : ""
  );

  const countries = arr.map((country) =>
    country.name?.common
      ? country.name?.common
      : search
      ? "No Country Name Data"
      : ""
  );

  const populations = arr.map((country) =>
    country.population ? country.population : search ? "No Population data" : ""
  );

  const regions = arr.map((country) =>
    country.continents[0]
      ? country.continents[0]
      : search
      ? "No Continent data"
      : ""
  );

  const capitals = arr.map((country) =>
    country.capital[0]
      ? country.capital[0]
      : search
      ? "No Capital City data"
      : ""
  );

  return { flags, countries, populations, regions, capitals };
};
