import { useState, useEffect, useRef } from "react";
import { getJson, mapArray } from "../Utils/helpers";
import { API_URL, COUNTRY_DATA_ERR } from "../config/config";
import Loader from "./Loader";
import Error from "./Error";

export default function FindCountryBySearch({
  setCountriesData,
  setLoading,
  setErr,
}) {
  /* search element */
  const searchResultEl = useRef(null);
  const searchResultContainer = useRef(null);
  const searchInputBox = useRef(null);

  /* states */
  const [isLoading, setIsLoading] = useState(null);
  const [error, setError] = useState(null);
  const [searchResult, setSearchResult] = useState({
    flags: [],
    countries: [],
    populations: [],
    regions: [],
    capitals: [],
  });
  const [selectedCountry, setSelectedCountry] = useState("");

  const closeSearchResults = () => {
    if (!searchResultEl.current.classList.contains("show-result-list")) return;

    searchResultEl.current.classList.remove("show-result-list");
    searchResultEl.current.classList.add("hide-result-list");

    setTimeout(() => {
      searchResultEl.current.classList.remove("hide-result-list");
      searchResultEl.current.classList.add("not-open");
    }, 500);
  };

  //handler
  const handleSelectedCountry = function (country) {
    setSelectedCountry(country);
    SetQuery("");
    closeSearchResults();
  };

  //handle when user submits a search query
  const handlerFormSubmit = function (e) {
    e.preventDefault();

    setCountriesData(searchResult);
    SetQuery("");
  };

  //handle when the input box is empty
  const handleEmptyInputBox = function (e) {
    const inputBox = e.target.value;

    if (inputBox === "") {
      closeSearchResults();
    }
  };

  const [query, SetQuery] = useState("");

  //handle when the user clicks on search result and when focus is outside of the search result
  useEffect(function () {
    const focusinHandler = function (event) {
      if (!searchResultContainer.current.contains(event.target)) {
        closeSearchResults();
      }
    };

    const searchCountriesByKeyboard = function (e) {
      const elementOnFocus = e.target.closest(".find-country__search-result");

      if (e.code === "Enter" && elementOnFocus) {
        setSelectedCountry(elementOnFocus.textContent.trim());
        SetQuery("");
        closeSearchResults();
      } else if (e.code === "Tab") {
        const lastSearchResult = searchResultContainer.current.lastElementChild;

        if (document.activeElement === lastSearchResult) {
          document.addEventListener("focusin", focusinHandler, { once: true });
        }
      }
    };

    document.addEventListener("keyup", searchCountriesByKeyboard);

    return () => {
      document.removeEventListener("keyup", searchCountriesByKeyboard);
    };
  }, []);

  //handle the search result when the user clicks on the search result
  useEffect(
    function () {
      const controller = new AbortController();

      const signal = controller.signal;

      const getCountrySearchResult = async function () {
        try {
          const result = await getJson(
            `${API_URL}/name/${selectedCountry}?fields=flags,name,capital,population,continents`,
            `${COUNTRY_DATA_ERR}`,
            { signal }
          );

          return result;
        } catch (err) {
          throw err;
        }
      };

      //if there is no selected country, the fetch function won't be executed
      if (!selectedCountry) return;

      (async function () {
        try {
          setLoading(true);
          setErr(null);
          const data = await getCountrySearchResult();

          const { flags, countries, populations, regions, capitals } = mapArray(
            data,
            true
          );

          setCountriesData({
            flags,
            countries,
            populations,
            regions,
            capitals,
          });
        } catch (err) {
          if (!(err.name === "AbortError")) {
            setErr(err.message);
            setSearchResult({
              capitals: [],
              flags: [],
              countries: [],
              populations: [],
              regions: [],
            });
          }
        } finally {
          setLoading(false);
        }
      })();
    },
    [selectedCountry, setCountriesData, setErr, setLoading]
  );

  //Hide The search Result when the user clicks on page
  useEffect(function () {
    //handler Function
    const handleClickOnPage = function (e) {
      const searchForm = e.target.closest(".find-country__search");

      if (searchForm) return;

      closeSearchResults();
    };

    document.addEventListener("click", handleClickOnPage);

    //cleaner function
    return () => {
      document.removeEventListener("click", handleClickOnPage);
    };
  }, []);

  // Fetch the search result when the user types on the input
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
          searchResultEl.current.classList.remove("not-open");
          searchResultEl.current.classList.add("show-result-list");
          const data = await getCountrySearchResult();

          const { flags, countries, populations, regions, capitals } = mapArray(
            data,
            true
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
    [query]
  );

  return (
    <form className="find-country__search" onSubmit={handlerFormSubmit}>
      {/* search icon */}
      <label className="find-country__search-icon" htmlFor="search-element">
        <span className="fa-solid fa-search"></span>

        <p className="sr-only">search icon</p>
      </label>

      {/* search input */}
      <input
        ref={searchInputBox}
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
        className={`find-country__search-results  not-open
      `}
        tabIndex="0"
        ref={searchResultEl}
        aria-label="list of search results"
      >
        <ul
          className="find-country__search-results-container"
          ref={searchResultContainer}
        >
          {!error &&
            !isLoading &&
            searchResult.countries?.map((_, i) => (
              <SearchResult
                onSelectedCountry={handleSelectedCountry}
                key={i}
                result={searchResult}
                i={i}
              />
            ))}
          {isLoading && <Loader />}
          {error && <Error error={error} />}
        </ul>
      </div>
    </form>
  );
}

function SearchResult({ result, i, onSelectedCountry }) {
  return (
    <li
      role="button"
      tabIndex="0"
      onClick={() => onSelectedCountry(result.countries[i])}
      className={`find-country__search-result result-${i + 1}`}
    >
      {result.countries[i]}
    </li>
  );
}
