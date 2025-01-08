import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Loader from "./Loader";
import Error from "./Error";
import { useEffect } from "react";

export default function DetailsPage({
  displayedCountryDetail,
  onHandleBackToTheHomePage,
  onHandleBorderCountryDetails,
  selectedCountryDetail,
  isLoading,
  error,
}) {
  console.log(displayedCountryDetail);
  console.log(selectedCountryDetail);
  useEffect(
    function () {
      document.title = `${
        displayedCountryDetail === "No Border Country"
          ? "Rest Api Countries with color theme switcher"
          : displayedCountryDetail.countryName
      }`;

      return function () {
        document.title = `Rest Api Countries with color theme switcher`;
      };
    },
    [displayedCountryDetail.countryName, displayedCountryDetail]
  );
  /* detail page */
  return (
    <>
      {isLoading && <Loader />}
      {error && <Error error={error} />}
      {!error && !isLoading && (
        <div
          className={`"page-detail ${selectedCountryDetail ? "" : "hidden"}`}
        >
          <button
            onClick={onHandleBackToTheHomePage}
            className="back-btn"
            aria-label="Back To Previous page"
          >
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
            Back
          </button>
          <div className="page-detail__info">
            <img
              className="page-detail__info-img"
              src={`${displayedCountryDetail?.flag?.png}`}
              alt={`${
                displayedCountryDetail?.flag?.alt
                  ? displayedCountryDetail?.flag?.alt
                  : "flag of the country"
              }`}
            />

            <div className="page-detail__info-text">
              <h2 className="page-detail__country-name">
                {displayedCountryDetail?.countryName}
              </h2>

              <div className="page-detail__info-wrapper">
                <div className="page-detail__info-text-part-1">
                  <div className="page-detail__text-item">
                    {/* native-name */}
                    <p className="page-detail__text-item-title">native name:</p>
                    <p className="page-detail__text-item-content">
                      {displayedCountryDetail?.nativeName}
                    </p>
                  </div>

                  <div className="page-detail__text-item">
                    <p className="page-detail__text-item-title">Populations:</p>
                    <p className="page-detail__text-item-content">
                      {displayedCountryDetail?.population}
                    </p>
                  </div>

                  <div className="page-detail__text-item">
                    <p className="page-detail__text-item-title">Regions:</p>
                    <p className="page-detail__text-item-content">
                      {displayedCountryDetail?.region}
                    </p>
                  </div>

                  <div className="page-detail__text-item">
                    <p className="page-detail__text-item-title">Sub Region:</p>
                    <p className="page-detail__text-item-content">
                      {displayedCountryDetail?.subRegion}
                    </p>
                  </div>

                  <div className="page-detail__text-item">
                    <p className="page-detail__text-item-title">Capital:</p>
                    <p className="page-detail__text-item-content">
                      {displayedCountryDetail?.capital}
                    </p>
                  </div>
                </div>

                <div className="page-detail__info-text-part-2">
                  <div className="page-detail__text-item">
                    <p className="page-detail__text-item-title">
                      Top Level Domain:
                    </p>
                    <p className="page-detail__text-item-content">
                      {displayedCountryDetail?.topLevelDomain}
                    </p>
                  </div>

                  <div className="page-detail__text-item">
                    <p className="page-detail__text-item-title">Currencies:</p>
                    <p className="page-detail__text-item-content">
                      {displayedCountryDetail?.currencies}
                    </p>
                  </div>

                  <div className="page-detail__text-item">
                    <p className="page-detail__text-item-title">Languages:</p>
                    <p className="page-detail__text-item-content">
                      {displayedCountryDetail?.languagesData}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="page-detail__info-text-part-3"
                onClick={onHandleBorderCountryDetails}
                onKeyUp={function (e) {
                  if (e.key === "Enter") {
                    onHandleBorderCountryDetails(e);
                  }
                }}
              >
                <p className="page-detail__text-item-title page-detail__text-item-title--size-2">
                  Border Countries:
                </p>

                <ul className="page-detail__text-item-container">
                  {displayedCountryDetail?.borderCountries?.map(
                    (borderCountry) => (
                      <DisplayBorderCountries
                        borderCountry={borderCountry}
                        key={borderCountry}
                      />
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DisplayBorderCountries({ borderCountry }) {
  return (
    <li className="page-detail__text-item-border" tabIndex="0">
      {borderCountry}
    </li>
  );
}
