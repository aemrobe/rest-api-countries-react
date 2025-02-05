import { useState } from "react";
import FindCountry from "../components/FindCountry";
import FindCountryBySearch from "../components/FindCountryBySearch";
import FindCountryByFilter from "../components/FindCountryByFilter";
import ListOfCountries from "../components/ListOfCountries";

export default function HomePage({
  triggerFetch,
  selectedCountryDetail,
  onHandleSelectedCountries,
}) {
  /* home page */
  // ### States ###
  const [countriesData, setCountriesData] = useState({
    flags: [],
    countries: [],
    populations: [],
    regions: [],
    capitals: [],
  });

  const [isLoading, setIsLoading] = useState(null);
  const [error, setError] = useState(null);
  return (
    <div className={`home-page ${selectedCountryDetail ? "hidden" : ""}`}>
      <FindCountry>
        <FindCountryBySearch
          setLoading={setIsLoading}
          setErr={setError}
          setCountriesData={setCountriesData}
        />
        <FindCountryByFilter
          error={error}
          isLoading={isLoading}
          setLoading={setIsLoading}
          setCountriesData={setCountriesData}
          setErr={setError}
        />
      </FindCountry>
      <ListOfCountries
        onHandleSelectedCountries={onHandleSelectedCountries}
        triggerFetch={triggerFetch}
        countriesData={countriesData}
        setCountriesData={setCountriesData}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        error={error}
        setError={setError}
      />
    </div>
  );
}
