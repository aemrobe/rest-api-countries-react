import Header from "./components/Header";
import WrapperContainer from "./components/WrapperContainer";
import { useState } from "react";

function App() {
  const [pageMode, setPageMode] = useState("light");

  return (
    <div className={`${pageMode === "light" ? "" : "dark"} App`}>
      <Header pageMode={pageMode} setPageMode={setPageMode} />
      <WrapperContainer />
    </div>
  );
}

export default App;
