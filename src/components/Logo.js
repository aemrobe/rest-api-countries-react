export default function Logo({ onTriggerFetch, onHandleEnterKeyPress }) {
  return (
    <p
      onClick={onTriggerFetch}
      onKeyUp={onHandleEnterKeyPress}
      className="title"
      tabIndex="0"
    >
      Where in the world?
    </p>
  );
}
