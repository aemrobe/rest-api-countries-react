import { useCallback } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Logo from "./components/Logo";
import { DarkModeThemeSwitcher } from "./components/DarkModeThemeSwitcher";
import WrapperContainer from "./components/WrapperContainer";
import Main from "./components/Main";
import HomePage from "./pages/HomePage";
import DetailsPage from "./pages/DetailsPage";
import Footer from "./components/Footer";

import { API_URL, COUNTRY_DATA_ERR } from "./config/config";

import useFetch from "./Hooks/useFetch";
import Error from "./components/Error";
import { useApp } from "./Context/AppContext";

function App() {
  const { pageMode, selectedCountryDetail } = useApp();

  //a function which the arrange the data it receives to make it suitable for the details page
  const arrangeDataForDetaillsPage = useCallback(async function (data) {
    const [dataResult] = data;

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
    const topLevelDomain = dataResult.tld[0] ? dataResult.tld[0] : "No TLD";
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

    return {
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
    };
  }, []);

  //this handles the fetch logic when someone clicks on the countries to see their details
  const {
    data: displayedCountryDetail,
    loading: isLoading,
    err: error,
    setErr: setError,
  } = useFetch(
    `${API_URL}/name/${selectedCountryDetail}?fullText=true`,
    `${COUNTRY_DATA_ERR}`,
    selectedCountryDetail,
    false,
    arrangeDataForDetaillsPage,
    "async"
  );

  return (
    <div className={`${pageMode === "light" ? "" : "dark"} App`}>
      <BrowserRouter basename="/rest-api-countries-react">
        <Header>
          <Logo setError={setError} />
          <DarkModeThemeSwitcher />
        </Header>

        <WrapperContainer>
          <Main>
            <Routes>
              <Route path="/" element={<HomePage />} />

              <Route
                path="details/:countryName"
                element={
                  <DetailsPage
                    isLoading={isLoading}
                    error={error}
                    displayedCountryDetail={displayedCountryDetail}
                  />
                }
              />

              <Route path="*" element={<Error error={"Page not found 😢"} />} />
            </Routes>
          </Main>
          <Footer />
        </WrapperContainer>
      </BrowserRouter>
    </div>
  );
}

export default App;
