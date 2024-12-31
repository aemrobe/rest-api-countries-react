import { useState, useEffect } from "react";
import { getJson } from "../Utils/helpers";
import { API_URL, COUNTRY_DATA_ERR } from "../config/config";
import Loader from "./Loader";
import Error from "./Error";

export default function FindCountryBySearch() {
  /* search element */
  const [isLoading, setIsLoading] = useState(null);
  const [error, setError] = useState(null);
  const [closed, setClosed] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [hideResults, setHideResults] = useState(false);
  const [searchResult, setSearchResult] = useState({
    flags: [],
    countries: [],
    populations: [],
    regions: [],
    capitals: [],
  });

  const closeSearchResults = () => {
    if (!showResults) return;

    setShowResults(false);

    setTimeout(function () {
      setHideResults(true);
    }, 10);

    setTimeout(() => {
      setHideResults(false);
      setClosed(true);
    }, 2000);
  };

  const handleEmptyInputBox = function (e) {
    const inputBox = e.target.value;

    if (inputBox === "") {
      closeSearchResults();
    }
  };

  const [query, SetQuery] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();

      const signal = controller.signal;

      const getCountrySearchResult = async function () {
        try {
          const result = await getJson(
            `${API_URL}/name/${query}?fields=flags,name,capital,population,continents`,
            `${COUNTRY_DATA_ERR}`,
            { signal }
          );

          return result;
        } catch (err) {
          throw err;
        }
      };

      setSearchResult({
        capitals: [],
        flags: [],
        countries: [],
        populations: [],
        regions: [],
      });

      if (query.length === 0) return;

      (async function () {
        try {
          setError(null);
          setIsLoading(true);
          setClosed(false);
          setShowResults(true);

          const data = await getCountrySearchResult();

          let capitals = data.map((data) =>
            data.capital[0] ? data.capital[0] : "No Capital city data"
          );
          let flags = data.map((data) =>
            data.flags ? data.flags : "No Flag data"
          );
          let countries = data.map((data) =>
            data.name?.common ? data.name?.common : "No Country Name Data"
          );
          let populations = data.map((data) =>
            data.population ? data.population : "No Population data"
          );
          let regions = data.map((data) =>
            data.continents[0] ? data.continents[0] : "No Continent data"
          );

          setSearchResult({
            capitals,
            flags,
            countries,
            populations,
            regions,
          });
        } catch (err) {
          if (!(err.name === "AbortError")) {
            setError(err.message);
            setSearchResult({
              capitals: [],
              flags: [],
              countries: [],
              populations: [],
              regions: [],
            });
          }
        } finally {
          setIsLoading(false);
        }
      })();

      return function () {
        controller.abort();
      };
    },
    [query, showResults]
  );

  return (
    <form className="find-country__search">
      {/* search icon */}
      <label className="find-country__search-icon" htmlFor="search-element">
        <span className="fa-solid fa-search"></span>

        <p className="sr-only">search icon</p>
      </label>

      {/* search input */}
      <input
        type="text"
        value={query}
        onChange={(e) => SetQuery(e.target.value)}
        onKeyUp={handleEmptyInputBox}
        id="search-element"
        name="country name"
        className="find-country__search-input"
        placeholder="Search for a country..."
        aria-label="Search countries"
      />

      {/* search results */}
      <div
        className={`find-country__search-results ${closed ? "not-open" : ""}${
          showResults ? "show-result-list" : ""
        }${hideResults ? "hide-result-list" : ""}`}
        tabIndex="0"
        aria-label="list of search results"
      >
        <ul className="find-country__search-results-container">
          {!error &&
            !isLoading &&
            searchResult.countries?.map((_, i) => (
              <SearchResult key={i} result={searchResult} i={i} />
            ))}
          {isLoading && <Loader />}
          {error && <Error error={error} />}
        </ul>
      </div>
    </form>
  );
}

function SearchResult({ result, i }) {
  return (
    <li
      role="button"
      tabIndex="0"
      className={`find-country__search-result result-${i + 1}`}
    >
      {result.countries[i]}
    </li>
  );
}
