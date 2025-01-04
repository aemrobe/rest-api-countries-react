import { useState } from "react";
import Header from "./components/Header";
import Logo from "./components/Logo";
import { DarkModeThemeSwitcher } from "./components/DarkModeThemeSwitcher";
import WrapperContainer from "./components/WrapperContainer";
import Main from "./components/Main";
import HomePage from "./components/HomePage";
import DetailsPage from "./components/DetailsPage";
import Footer from "./components/Footer";

function App() {
  const [pageMode, setPageMode] = useState("light");
  const [triggerFetch, setTriggerFetch] = useState(true);

  const handleTriggerFetch = function () {
    setTriggerFetch((prevValue) => !prevValue);
  };

  return (
    <div className={`${pageMode === "light" ? "" : "dark"} App`}>
      <Header pageMode={pageMode} setPageMode={setPageMode}>
        <Logo onTriggerFetch={handleTriggerFetch} />
        <DarkModeThemeSwitcher pageMode={pageMode} setPageMode={setPageMode} />
      </Header>

      <WrapperContainer>
        <Main>
          <HomePage triggerFetch={triggerFetch} />
          <DetailsPage />
        </Main>
        <Footer />
      </WrapperContainer>
    </div>
  );
}

export default App;
