export default function Logo({ onTriggerFetch, onHandleEnterKeyPress }) {
  return (
    <p
      onClick={onTriggerFetch}
      onKeyUp={onHandleEnterKeyPress}
      className="title"
      role="button"
      tabIndex="0"
      aria-label="search whole countries"
    >
      Where in the world?
    </p>
  );
}
