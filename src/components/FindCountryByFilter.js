export default function FindCountryByFilter({ isLoading, error }) {
  /* filter by region */
  return (
    <div className="find-country__filter-countries expand-drop-down">
      <div className="find-country__filter-countries__wrapper">
        <label
          tabIndex="0"
          htmlFor="filter-options"
          className="find-country__filter-mode"
        >
          Filter by Region
        </label>

        <div className="find-country__filter-icons">
          <span className="fa-solid fa-chevron-down"></span>

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
      >
        <ul className="find-country__region-list-container">
          <li
            tabIndex="0"
            role="button"
            aria-label="Filter by Africa"
            className="find-country__filter-region-item find-country__filter-region-item--1"
          >
            Africa
          </li>
          <li
            tabIndex="0"
            role="button"
            aria-label="Filter by America"
            className="find-country__filter-region-item find-country__filter-region-item--2"
          >
            America
          </li>
          <li
            tabIndex="0"
            role="button"
            aria-label="Filter by Asia"
            className="find-country__filter-region-item find-country__filter-region-item--3"
          >
            Asia
          </li>

          <li
            tabIndex="0"
            role="button"
            aria-label="Filter by Europe"
            className="find-country__filter-region-item find-country__filter-region-item--4"
          >
            Europe
          </li>

          <li
            tabIndex="0"
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
