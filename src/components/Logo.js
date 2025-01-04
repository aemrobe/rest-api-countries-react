export default function Logo({ onTriggerFetch }) {
  return (
    <p
      onClick={onTriggerFetch}
      className="title"
      role="button"
      tabIndex="0"
      aria-label="search whole countries"
    >
      Where in the world?
    </p>
  );
}
