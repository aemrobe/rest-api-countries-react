import FindCountry from "./FindCountry";
import ListOfCountries from "./ListOfCountries";
import { useState } from "react";
import FindCountryByFilter from "./FindCountryByFilter";
import FindCountryBySearch from "./FindCountryBySearch";

export default function HomePage() {
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
    <div className="home-page">
      <FindCountry>
        <FindCountryBySearch
          setLoading={setIsLoading}
          setErr={setError}
          setCountriesData={setCountriesData}
        />
        <FindCountryByFilter error={error} isLoading={isLoading} />
      </FindCountry>
      <ListOfCountries
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
