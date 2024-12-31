import { useEffect, useState } from "react";
import { getJson } from "../Utils/helpers";
import { API_URL } from "../config/config";
import Loader from "./Loader";
import Error from "./Error";

export default function ListOfCountries({
  error,
  isLoading,
  setIsLoading,
  setError,
}) {
  const [countriesData, setCountriesData] = useState({
    flags: [],
    countries: [],
    populations: [],
    regions: [],
    capitals: [],
  });

  useEffect(
    function () {
      const fetchCountriesData = async function () {
        try {
          const data = await getJson(
            `${API_URL}/all?fields=flags,name,capital,population,continents
`,
            "wrong countries url"
          );

          return data;
        } catch (err) {
          console.log(err.message);
          throw err;
        }
      };

      (async function () {
        try {
          setIsLoading(true);
          setError(null);
          const data = await fetchCountriesData();

          const flags = data.map((country) => country.flags);
          const countries = data.map((country) => country.name?.common);
          const populations = data.map((country) => country.population);
          const regions = data.map((country) => country.continents[0]);
          const capitals = data.map((country) => country.capital[0]);

          setCountriesData({
            flags,
            countries,
            populations,
            regions,
            capitals,
          });
        } catch (err) {
          console.log(err.message);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      })();
    },
    [setError, setIsLoading]
  );

  return (
    <ul className="list-of-countries">
      {!isLoading &&
        !error &&
        countriesData.countries.map((__, i) => (
          <Country countriesData={countriesData} i={i} key={i} />
        ))}
      {isLoading && <Loader />}
      {error && <Error error={error} />}
    </ul>
  );
}

function Country({ countriesData, i }) {
  return (
    <li className="country" tabIndex="0" aria-label="country" role="button">
      <div className="image-container">
        <img
          src={`${countriesData.flags[i].png}`}
          alt={`${
            countriesData.flags[i].alt === ""
              ? "image of the flag"
              : countriesData.flags[i].alt
          } }
       
    }"`}
          className="country__flag"
        />
      </div>

      <div className="country__container">
        <h2 className="country__name">{countriesData.countries[i]}</h2>

        <div className="country__static-container">
          <div className="country__statics">
            <p className="country__statics-title">Population:</p>
            <p className="country__statics-item">
              {countriesData.populations[i]}
            </p>
          </div>

          <div className="country__statics">
            <p className="country__statics-title">Region:</p>
            <p className="country__statics-item">{countriesData.regions[i]}</p>
          </div>

          <div className="country__statics">
            <p className="country__statics-title">Capital:</p>
            <p className="country__statics-item">{countriesData.capitals[i]}</p>
          </div>
        </div>
      </div>
    </li>
  );
}
