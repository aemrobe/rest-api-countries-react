import { useState, useEffect } from "react";
import Header from "./components/Header";
import Logo from "./components/Logo";
import { DarkModeThemeSwitcher } from "./components/DarkModeThemeSwitcher";
import WrapperContainer from "./components/WrapperContainer";
import Main from "./components/Main";
import HomePage from "./components/HomePage";
import DetailsPage from "./components/DetailsPage";
import Footer from "./components/Footer";

import { API_URL, COUNTRY_DATA_ERR } from "./config/config";

import useFetch from "./Hooks/useFetch";

function App() {
  const [pageMode, setPageMode] = useState("light");
  const [triggerFetch, setTriggerFetch] = useState(true);
  const [displayedCountryDetail, setDisplayedCountryDetail] = useState("");
  const [selectedCountryDetail, setSelectedCountryDetail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTriggerFetch = function () {
    setTriggerFetch((prevValue) => !prevValue);
    setSelectedCountryDetail("");
    setDisplayedCountryDetail("");
    setError("");
  };

  const backToTheHomePage = function () {
    setSelectedCountryDetail("");
    setDisplayedCountryDetail("");
  };

  const handleCountryDetail = function (e) {
    const clickedCountryItem = e.target.closest(".country");

    if (!clickedCountryItem) return;

    const countryName = clickedCountryItem
      .querySelector(".country__name")
      .textContent.trim();

    setSelectedCountryDetail(countryName);
  };

  const handleEnterKeyPress = function (e) {
    if (e.code === "Enter") {
      handleTriggerFetch();
    }
  };

  const handleBorderCountryDetail = function (e) {
    const clickedBorderCountry = e.target.closest(
      ".page-detail__text-item-border"
    );

    if (!clickedBorderCountry) return;

    const borderCountryName = clickedBorderCountry.textContent.trim();

    setSelectedCountryDetail(borderCountryName);
  };

  //this handles the fetch logic when someone clicks on the countries to see their details
  const { data, loading, err } = useFetch(
    `${API_URL}/name/${selectedCountryDetail}?fullText=true`,
    `${COUNTRY_DATA_ERR}`,
    selectedCountryDetail
  );

  //this handles the data that is returned by the useFetch
  useEffect(
    function () {
      setIsLoading(loading);
      setError(err);

      if (data) {
        const [dataResult] = data;

        (async function () {
          const flag = dataResult.flags;
          const countryName = dataResult.name?.common;
          let nativeName;
          const population = dataResult.population;
          const region = dataResult.region;
          const subRegion = dataResult.subRegion
            ? dataResult.subRegion
            : "No subregion";
          const capital = dataResult.capital[0]
            ? dataResult.capital[0]
            : "No capital city";
          const topLevelDomain = dataResult.tld[0]
            ? dataResult.tld[0]
            : "No TLD";
          let languagesData;
          let currencies;

          //assigning the value of the currency of the country
          if (dataResult.currencies) {
            const { ...currency } = dataResult.currencies;
            for (const key in currency) {
              currencies = currency[key].name;

              break;
            }
          } else {
            currencies = "No Currency data";
          }

          //assigning the value of the language of the country
          if (dataResult.languages) {
            const { ...language } = dataResult.languages;

            let languages = [];

            for (const key in language) {
              languages.push(language[key]);
            }

            languagesData = languages.join(", ");
          } else {
            languagesData = "No Language data";
          }

          //assigning the value of the border of the country
          let borderCountries = dataResult.borders;

          const fetchBorderCountry = async function (borderCode) {
            const res = await fetch(`${API_URL}/alpha/${borderCode}`);

            const [data] = await res.json();

            return data.name.common;
          };

          if (borderCountries && borderCountries.length > 0) {
            borderCountries = await Promise.all(
              borderCountries?.map(async (bordercode) => {
                return await fetchBorderCountry(bordercode);
              })
            );
          } else {
            borderCountries = ["No Border Country"];
          }

          //assigning the value of the nativeName of the country
          if (dataResult.name?.nativeName) {
            const { ...Name } = dataResult.name.nativeName;
            for (const key in Name) {
              if (Name.hasOwnProperty(key)) {
                nativeName = Name[key].common;

                break;
              }
            }
          } else {
            nativeName = "No Native Name";
          }

          setDisplayedCountryDetail({
            flag,
            countryName,
            population,
            region,
            subRegion,
            capital,
            topLevelDomain,
            languagesData,
            borderCountries,
            nativeName,
            currencies,
          });
        })();
      } else if (err) {
        setDisplayedCountryDetail("No Border Country");
      }
    },
    [data, err, loading]
  );

  return (
    <div className={`${pageMode === "light" ? "" : "dark"} App`}>
      <Header pageMode={pageMode} setPageMode={setPageMode}>
        <Logo
          onTriggerFetch={handleTriggerFetch}
          onHandleEnterKeyPress={handleEnterKeyPress}
        />
        <DarkModeThemeSwitcher pageMode={pageMode} setPageMode={setPageMode} />
      </Header>

      <WrapperContainer>
        <Main>
          <HomePage
            selectedCountryDetail={selectedCountryDetail}
            onHandleSelectedCountries={handleCountryDetail}
            triggerFetch={triggerFetch}
          />

          {displayedCountryDetail && (
            <DetailsPage
              isLoading={isLoading}
              error={error}
              selectedCountryDetail={selectedCountryDetail}
              onHandleBackToTheHomePage={backToTheHomePage}
              onHandleBorderCountryDetails={handleBorderCountryDetail}
              displayedCountryDetail={displayedCountryDetail}
            />
          )}
        </Main>
        <Footer />
      </WrapperContainer>
    </div>
  );
}

export default App;
