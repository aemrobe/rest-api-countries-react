import { useState } from "react";
import FindCountry from "./FindCountry";
import FindCountryBySearch from "./FindCountryBySearch";
import FindCountryByFilter from "./FindCountryByFilter";
import ListOfCountries from "./ListOfCountries";

export default function HomePage({
  triggerFetch,
  selectedCountryDetail,
  onHandleSelectedCountries,
}) {
  /* home page */
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
