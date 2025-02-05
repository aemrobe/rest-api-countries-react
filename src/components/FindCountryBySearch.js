import { useState, useEffect, useRef, useCallback } from "react";
import { arrangeData, mapArray } from "../Utils/helpers";
import { API_URL, COUNTRY_DATA_ERR } from "../config/config";
import Loader from "./Loader";
import Error from "./Error";
import useFetch from "../Hooks/useFetch";

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
  const [query, setQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  //a function which arranges the searched country data in a suitable format
  const arrangeDataForTypeOnSearchInput = useCallback(function (data) {
    searchResultEl.current.classList.remove("not-open");
    searchResultEl.current.classList.add("show-result-list");

    const { flags, countries, populations, regions, capitals } = mapArray(
      data,
      true
    );

    return { flags, countries, populations, regions, capitals };
  }, []);

  // Fetch the search result when the user types on the input
  const {
    data: searchResult,
    loading: isLoading,
    err: error,
  } = useFetch(
    `${API_URL}/name/${query}?fields=flags,name,capital,population,continents`,
    `${COUNTRY_DATA_ERR}`,
    query,
    true,
    arrangeDataForTypeOnSearchInput
  );

  //showing the results from the user typing on the search box on the listofCountries component by using these setter function
  useEffect(
    function () {
      setLoading(isLoading);
      setErr(error);
    },
    [isLoading, error, setErr, setLoading]
  );

  const closeSearchResults = () => {
    if (!searchResultEl.current.classList.contains("show-result-list")) return;

    searchResultEl.current.classList.remove("show-result-list");
    searchResultEl.current.classList.add("hide-result-list");

    setTimeout(() => {
      searchResultEl.current.classList.remove("hide-result-list");
      searchResultEl.current.classList.add("not-open");
    }, 500);
  };

  // ### handler ###
  const handleSelectedCountry = function (country) {
    setSelectedCountry(country);
    setQuery("");
    closeSearchResults();
  };

  //handle when user submits a search query
  const handlerFormSubmit = function (e) {
    e.preventDefault();

    setCountriesData(searchResult);
    setQuery("");
  };

  //handle when the input box is empty
  const handleEmptyInputBox = function (e) {
    const inputBox = e.target.value;

    if (inputBox === "") {
      closeSearchResults();
    }
  };

  //### this is for keyboard users ###
  //handle when the user is going through the search results and finish his watching and changed the focus outside of the search result.
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
        setQuery("");
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
  const {
    data: dataSearch,
    loading: loadingSearch,
    err: errSearch,
  } = useFetch(
    `${API_URL}/name/${selectedCountry}?fields=flags,name,capital,population,continents`,
    `${COUNTRY_DATA_ERR}`,
    selectedCountry,
    false,
    arrangeData
  );

  //handle the useFetch hook when someone clicks on the search result
  useEffect(
    function () {
      setLoading(loadingSearch);
      setErr(errSearch);

      if (dataSearch) {
        setCountriesData(dataSearch);
      }
    },
    [dataSearch, errSearch, loadingSearch, setCountriesData, setErr, setLoading]
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
        onChange={(e) => setQuery(e.target.value)}
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
      >
        <ul
          className="find-country__search-results-container"
          ref={searchResultContainer}
        >
          {!error &&
            !isLoading &&
            searchResult?.countries?.map((_, i) => (
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
      tabIndex="0"
      onClick={() => onSelectedCountry(result.countries[i])}
      className={`find-country__search-result result-${i + 1}`}
    >
      {result.countries[i]}
    </li>
  );
}
