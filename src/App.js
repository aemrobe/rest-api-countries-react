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
import { getJson } from "./Utils/helpers";

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
    setError("");
  };

  const backToTheHomePage = function () {
    setSelectedCountryDetail("");
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

  useEffect(
    function () {
      const fetchCountryDetail = async function () {
        try {
          const [result] = await getJson(
            `${API_URL}/name/${selectedCountryDetail}?fullText=true`,
            `${COUNTRY_DATA_ERR}`
          );

          return result;
        } catch (err) {
          throw err;
        }
      };

      if (!selectedCountryDetail) return;

      (async function () {
        try {
          setIsLoading(true);
          setError("");
          const data = await fetchCountryDetail();

          const flag = data.flags;
          const countryName = data.name?.common;
          let nativeName;
          const population = data.population;
          const region = data.region;
          const subRegion = data.subRegion ? data.subRegion : "No subregion";
          const capital = data.capital[0] ? data.capital[0] : "No capital city";
          const topLevelDomain = data.tld[0] ? data.tld[0] : "No TLD";
          let languagesData;
          let currencies;

          //assigning the value of the currency of the country
          if (data.currencies) {
            const { ...currency } = data.currencies;
            for (const key in currency) {
              currencies = currency[key].name;

              break;
            }
          } else {
            currencies = "No Currency data";
          }

          //assigning the value of the language of the country
          if (data.languages) {
            const { ...language } = data.languages;

            let languages = [];

            for (const key in language) {
              languages.push(language[key]);
            }

            languagesData = languages.join(", ");
          } else {
            languagesData = "No Language data";
          }

          //assigning the value of the border of the country
          let borderCountries = data.borders;

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
          if (data.name?.nativeName) {
            const { ...Name } = data.name.nativeName;
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
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      })();
    },
    [selectedCountryDetail]
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

          <DetailsPage
            isLoading={isLoading}
            error={error}
            selectedCountryDetail={selectedCountryDetail}
            onHandleBackToTheHomePage={backToTheHomePage}
            onHandleBorderCountryDetails={handleBorderCountryDetail}
            displayedCountryDetail={displayedCountryDetail}
          />
        </Main>
        <Footer />
      </WrapperContainer>
    </div>
  );
}

export default App;
