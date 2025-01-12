import { useEffect } from "react";
import { mapArray } from "../Utils/helpers";
import { API_URL } from "../config/config";

import Loader from "./Loader";
import Error from "./Error";
import useFetch from "../Hooks/useFetch";

export default function ListOfCountries({
  error,
  isLoading,
  setIsLoading,
  setError,
  countriesData,
  setCountriesData,
  triggerFetch,
  onHandleSelectedCountries,
}) {
  const { data, loading, err } = useFetch(
    `${API_URL}/all?fields=flags,name,capital,population,continents
  `,
    "wrong countries url",
    triggerFetch
  );

  useEffect(
    function () {
      setIsLoading(loading);
      setError(err);

      if (data) {
        const { flags, countries, populations, regions, capitals } = mapArray(
          data,
          ""
        );
        setCountriesData({
          flags,
          countries,
          populations,
          regions,
          capitals,
        });
      }
    },
    [data, loading, err, setError, setIsLoading, setCountriesData]
  );

  return (
    <ul
      className="list-of-countries"
      onClick={onHandleSelectedCountries}
      onKeyUp={function (e) {
        if (e.key === "Enter") {
          onHandleSelectedCountries(e);
        }
      }}
    >
      {!isLoading &&
        !error &&
        countriesData.countries?.map((__, i) => (
          <Country countriesData={countriesData} i={i} key={i} />
        ))}
      {isLoading && <Loader />}
      {error && <Error error={error} />}
    </ul>
  );
}

function Country({ countriesData, i }) {
  return (
    <li className="country" tabIndex="0">
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
