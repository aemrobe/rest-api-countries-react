import { useState, useEffect, useRef, useCallback } from "react";
import { mapArray } from "../Utils/helpers";
import { API_URL, COUNTRY_DATA_ERR } from "../config/config";
import Loader from "./Loader";
import Error from "./Error";
import useFetch from "../Hooks/useFetch";
import { useHomePage } from "../Context/HomePageContext";
import { Link, useNavigate } from "react-router-dom";

export default function FindCountryBySearch() {
  const navigate = useNavigate();

  /* search element */
  const searchResultEl = useRef(null);
  const searchResultContainer = useRef(null);
  const searchInputBox = useRef(null);

  /* states */
  const [query, setQuery] = useState("");
  const { setCountriesData, setIsLoading, setError } = useHomePage();

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

  //handles the data returned from the useFetch hook that are changed when someone types on an search input box
  useEffect(
    function () {
      setIsLoading(isLoading);
      setError(error);
    },
    [isLoading, error, setError, setIsLoading]
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

  // ### handlers ###
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
  //handle when the user is going through the search results and finish his navigation through the search results and changes the focus outside of the search result.
  useEffect(
    function () {
      const focusinHandler = function (event) {
        if (!searchResultContainer.current.contains(event.target)) {
          closeSearchResults();
        }
      };

      const searchCountriesByKeyboard = function (e) {
        const elementOnFocus = e.target.closest(".find-country__search-result");

        if (e.code === "Enter" && elementOnFocus) {
          setQuery("");
          navigate(`/details/${elementOnFocus.textContent.trim()}`);
        } else if (e.code === "Tab") {
          const lastSearchResult =
            searchResultContainer.current.lastElementChild;

          const linkElement = lastSearchResult?.querySelector("a");

          if (document.activeElement === linkElement) {
            document.addEventListener("focusin", focusinHandler, {
              once: true,
            });
          }
        }
      };

      document.addEventListener("keyup", searchCountriesByKeyboard);

      return () => {
        document.removeEventListener("keyup", searchCountriesByKeyboard);
      };
    },
    [navigate]
  );

  //Hide The search Result when the user clicks on page outside of the search results
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
    <li className={`find-country__search-result`}>
      <Link to={`/details/${result.countries[i]}`}>{result.countries[i]}</Link>
    </li>
  );
}
