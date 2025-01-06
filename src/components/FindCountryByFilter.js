import { useEffect, useState, useRef } from "react";
import { getJson, mapArray } from "../Utils/helpers";
import { API_URL } from "../config/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function FindCountryByFilter({
  isLoading,
  error,
  setCountriesData,
  setLoading,
  setErr,
}) {
  const [filterByRegion, setFilterByRegion] = useState("");

  const regionList = useRef(null);

  const handleFilterbyRegion = function (region) {
    setFilterByRegion(region);
  };

  const handleClick = function (e) {
    if (!regionList.current.classList.contains("hidden")) return;

    regionList.current.classList.remove("hidden");
  };

  const handleClickOnEnterKeyOnRegions = function (e) {
    const filterRegion = e.target.closest(".find-country__filter-region-item");

    const label = e.target.closest(".find-country__filter-mode");

    if (label) {
      if (e.key !== "Enter") return;

      const filterRegionList = document.querySelector(
        ".find-country__filter-region-list"
      );

      filterRegionList.focus();
    } else if (filterRegion) {
      if (e.key !== "Enter") return;

      const filterRegionItem = filterRegion.textContent.trim().toLowerCase();

      setFilterByRegion(filterRegionItem);
    }
  };

  useEffect(
    function () {
      const fetchCountriesByRegion = async function () {
        try {
          const result = await getJson(
            `${API_URL}/region/${filterByRegion}?fields=flags,name,capital,population,continents`,
            "wrong region data"
          );

          return result;
        } catch (err) {
          throw err;
        }
      };

      if (!filterByRegion) return;

      (async function () {
        try {
          setLoading(true);
          setErr(null);
          const data = await fetchCountriesByRegion();

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
          setErr(err.message);
        } finally {
          setLoading(false);
        }
      })();
    },
    [filterByRegion, setCountriesData, setErr, setLoading]
  );

  /* filter by region */
  return (
    <div
      className="find-country__filter-countries expand-drop-down"
      onClick={handleClick}
      onKeyUp={handleClickOnEnterKeyOnRegions}
    >
      <div className="find-country__filter-countries__wrapper">
        <label
          tabIndex="0"
          htmlFor="filter-options"
          className="find-country__filter-mode"
        >
          Filter by Region
        </label>

        <div className="find-country__filter-icons">
          <FontAwesomeIcon icon={faChevronDown} />

          <p className="sr-only">arrow expanded</p>
        </div>
      </div>

      {/* filter regions */}
      <div
        id="filter-options"
        className={`${
          isLoading || error ? "hidden" : ""
        } find-country__filter-region-list`}
        tabIndex="0"
        ref={regionList}
      >
        <ul className="find-country__region-list-container">
          <li
            onClick={() => handleFilterbyRegion("africa")}
            tabIndex="0"
            role="button"
            aria-label="Filter by Africa"
            className="find-country__filter-region-item find-country__filter-region-item--1"
          >
            Africa
          </li>
          <li
            tabIndex="0"
            onClick={() => handleFilterbyRegion("america")}
            role="button"
            aria-label="Filter by America"
            className="find-country__filter-region-item find-country__filter-region-item--2"
          >
            America
          </li>
          <li
            tabIndex="0"
            onClick={() => handleFilterbyRegion("asia")}
            role="button"
            aria-label="Filter by Asia"
            className="find-country__filter-region-item find-country__filter-region-item--3"
          >
            Asia
          </li>

          <li
            tabIndex="0"
            onClick={() => handleFilterbyRegion("europe")}
            role="button"
            aria-label="Filter by Europe"
            className="find-country__filter-region-item find-country__filter-region-item--4"
          >
            Europe
          </li>

          <li
            tabIndex="0"
            onClick={() => handleFilterbyRegion("oceania")}
            role="button"
            aria-label="Filter by Oceania"
            className="find-country__filter-region-item find-country__filter-region-item--5"
          >
            Oceania
          </li>
        </ul>
      </div>
    </div>
  );
}
