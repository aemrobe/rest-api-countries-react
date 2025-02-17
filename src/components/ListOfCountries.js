import { useEffect, useCallback } from "react";
import { mapArray } from "../Utils/helpers";
import { API_URL } from "../config/config";

import Loader from "./Loader";
import Error from "./Error";
import useFetch from "../Hooks/useFetch";
import { Link, useNavigate } from "react-router-dom";
import { useHomePage } from "../Context/HomePageContext";
import { useApp } from "../Context/AppContext";

export default function ListOfCountries() {
  const {
    isLoading,
    setIsLoading,
    error,
    setError,
    countriesData,
    setCountriesData,
  } = useHomePage();

  const { triggerFetch } = useApp();

  const navigate = useNavigate();

  const handleCountryDetail = function (e) {
    const clickedCountryItem = e.target.closest(".country");

    if (!clickedCountryItem) return;

    const countryName = clickedCountryItem
      .querySelector(".country__name")
      .textContent.trim();

    navigate(`/details/${countryName}`);
  };

  //arranging the data of the countries in a suitable format
  const arrangeDataForListOfCountries = useCallback(function (data) {
    const { flags, countries, populations, regions, capitals } = mapArray(data);

    return { flags, countries, populations, regions, capitals };
  }, []);

  const { data, loading, err } = useFetch(
    `${API_URL}/all?fields=flags,name,capital,population,continents
  `,
    "wrong countries url",
    triggerFetch,
    false,
    arrangeDataForListOfCountries
  );

  //this effect should be here
  useEffect(
    function () {
      setIsLoading(loading);
      setError(err);

      if (data) {
        setCountriesData(data);
      }
    },
    [data, loading, err, setError, setIsLoading, setCountriesData]
  );

  return (
    <ul
      className="list-of-countries"
      onKeyUp={function (e) {
        if (e.key === "Enter") {
          handleCountryDetail(e);
        }
      }}
    >
      {!isLoading &&
        !error &&
        countriesData?.countries?.map((__, i) => (
          <Country countriesData={countriesData} i={i} key={i} />
        ))}
      {isLoading && <Loader />}
      {error && <Error error={error} />}
    </ul>
  );
}

function Country({ countriesData, i }) {
  return (
    <li className="country">
      <Link to={`details/${countriesData.countries[i]}`}>
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
              <p className="country__statics-item">
                {countriesData.regions[i]}
              </p>
            </div>

            <div className="country__statics">
              <p className="country__statics-title">Capital:</p>
              <p className="country__statics-item">
                {countriesData.capitals[i]}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}
