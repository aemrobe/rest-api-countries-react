import { IMGURL } from "../config/config";

export default function Loader() {
  return (
    <div className="spinner">
      <svg aria-hidden="true">
        <use href={`${IMGURL}/icons/icons.svg#icon-loader`}></use>
      </svg>

      <span className="sr-only">Loading...</span>
    </div>
  );
}
