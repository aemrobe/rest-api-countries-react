import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon } from "@fortawesome/free-regular-svg-icons";
import { useApp } from "../Context/AppContext";

export function DarkModeThemeSwitcher() {
  const { pageMode, setPageMode } = useApp();

  // ### Handler ###
  const handlePageMode = function () {
    setPageMode((previousMode) =>
      previousMode === "light" ? "dark" : "light"
    );
  };

  return (
    <div
      className="theme-switcher"
      onClick={handlePageMode}
      onKeyUp={function (e) {
        if (e.key === "Enter") {
          handlePageMode();
        }
      }}
      tabIndex="0"
    >
      <div className="theme-switcher__icon">
        <FontAwesomeIcon icon={faMoon} aria-hidden="true" />
        <p className="sr-only">
          the page is in {pageMode === "light" ? "light mode" : "dark mode"}
        </p>
      </div>

      <p className="theme-switcher__mode">Dark Mode</p>
    </div>
  );
}
