import { useNavigate } from "react-router-dom";
import { useApp } from "../Context/AppContext";

export default function Logo({ setError }) {
  const navigate = useNavigate();

  const { setTriggerFetch, setSelectedCountryDetail } = useApp();

  //### Handlers ###
  const handleTriggerFetch = function () {
    setTriggerFetch((prevValue) => !prevValue);
    setSelectedCountryDetail("");
    setError("");
  };

  const handleEnterKeyPress = function (e) {
    if (e.code === "Enter") {
      handleTriggerFetch();
    }
  };

  return (
    <h1
      onClick={() => {
        handleTriggerFetch();
        navigate("/");
      }}
      onKeyUp={handleEnterKeyPress}
      className="title"
      tabIndex="0"
    >
      Where in the world?
    </h1>
  );
}
