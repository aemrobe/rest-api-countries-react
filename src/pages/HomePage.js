import FindCountry from "../components/FindCountry";
import FindCountryBySearch from "../components/FindCountryBySearch";
import FindCountryByFilter from "../components/FindCountryByFilter";
import ListOfCountries from "../components/ListOfCountries";
import { HomePageProvider } from "../Context/HomePageContext";

export default function HomePage() {
  return (
    <HomePageProvider>
      <div className={`home-page`}>
        <FindCountry>
          <FindCountryBySearch />
          <FindCountryByFilter />
        </FindCountry>
        <ListOfCountries />
      </div>
    </HomePageProvider>
  );
}
