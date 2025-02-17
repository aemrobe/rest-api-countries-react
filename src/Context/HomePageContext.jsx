import { createContext, useContext, useState } from "react";

const HomePageContext = createContext();

function HomePageProvider({ children }) {
  const [countriesData, setCountriesData] = useState({
    flags: [],
    countries: [],
    populations: [],
    regions: [],
    capitals: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <HomePageContext.Provider
      value={{
        countriesData,
        setCountriesData,
        isLoading,
        setIsLoading,
        error,
        setError,
      }}
    >
      {children}
    </HomePageContext.Provider>
  );
}

function useHomePage() {
  const context = useContext(HomePageContext);

  if (context === undefined)
    throw new Error(`you are using a context outisde of the provider`);

  return context;
}

export { HomePageProvider, useHomePage };
