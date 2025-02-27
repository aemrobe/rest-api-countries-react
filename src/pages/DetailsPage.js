import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useApp } from "../Context/AppContext";

export default function DetailsPage({
  displayedCountryDetail,
  isLoading,
  error,
}) {
  const navigate = useNavigate();
  const { countryName } = useParams();

  const handleBorderCountryDetail = function (e) {
    const clickedBorderCountry = e.target.closest(
      ".page-detail__text-item-border"
    );

    if (!clickedBorderCountry) return;

    const borderCountryName = clickedBorderCountry.textContent.trim();

    navigate(`/details/${borderCountryName}`);
  };

  const { setSelectedCountryDetail } = useApp();

  const handleBackToTheHomePage = function () {
    setSelectedCountryDetail("");
  };

  useEffect(
    function () {
      if (countryName) {
        setSelectedCountryDetail(countryName);
      } else {
        setSelectedCountryDetail(null);
      }
    },
    [countryName, setSelectedCountryDetail]
  );

  /* detail page */
  return (
    <>
      {isLoading && <Loader />}
      {error && <Error error={error} />}
      {!error && !isLoading && (
        <div className={`page-detail`}>
          <button
            onClick={() => {
              handleBackToTheHomePage();
              navigate(-1);
            }}
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
                onKeyUp={function (e) {
                  if (e.key === "Enter") {
                    handleBorderCountryDetail(e);
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
    <li className={`page-detail__text-item-border`}>
      <Link to={`/details/${borderCountry}`}>{borderCountry}</Link>
    </li>
  );
}
