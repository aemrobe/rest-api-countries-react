import { createContext, useContext, useState } from "react";

const AppContext = createContext();

function AppProvider({ children }) {
  const [pageMode, setPageMode] = useState("light");
  const [triggerFetch, setTriggerFetch] = useState(true);
  const [selectedCountryDetail, setSelectedCountryDetail] = useState("");

  return (
    <AppContext.Provider
      value={{
        pageMode,
        setPageMode,
        triggerFetch,
        setTriggerFetch,
        selectedCountryDetail,
        setSelectedCountryDetail,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

function useApp() {
  const context = useContext(AppContext);

  if (context === undefined)
    throw new Error("you are using a context outisde of provider");

  return context;
}

export { AppProvider, useApp };
