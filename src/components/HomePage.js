import FindCountry from "./FindCountry";
import ListOfCountries from "./ListOfCountries";
import { useState } from "react";
import FindCountryByFilter from "./FindCountryByFilter";
import FindCountryBySearch from "./FindCountryBySearch";

export default function HomePage() {
  /* home page */
  const [isLoading, setIsLoading] = useState(null);
  const [error, setError] = useState(null);
  return (
    <div className="home-page">
      <FindCountry>
        <FindCountryBySearch />
        <FindCountryByFilter error={error} isLoading={isLoading} />
      </FindCountry>
      <ListOfCountries
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        error={error}
        setError={setError}
      />
    </div>
  );
}
