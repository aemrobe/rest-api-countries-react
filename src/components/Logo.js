import { useNavigate } from "react-router-dom";

export default function Logo({ onTriggerFetch, onHandleEnterKeyPress }) {
  const navigate = useNavigate();

  return (
    <h1
      onClick={() => {
        onTriggerFetch();
        navigate("/");
      }}
      onKeyUp={onHandleEnterKeyPress}
      className="title"
      tabIndex="0"
    >
      Where in the world?
    </h1>
  );
}
