import { IMGURL } from "../config/config";

export default function Error({ error }) {
  return (
    <div className="error">
      <div>
        <svg>
          <use href={`${IMGURL}/icons/icons.svg#icon-alert-triangle`}></use>
        </svg>
      </div>

      <p role="alert" tabIndex="0" aria-hidden="true">
        {error}
      </p>
    </div>
  );
}
