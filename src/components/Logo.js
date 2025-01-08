export default function Logo({ onTriggerFetch, onHandleEnterKeyPress }) {
  return (
    <h1
      onClick={onTriggerFetch}
      onKeyUp={onHandleEnterKeyPress}
      className="title"
      tabIndex="0"
    >
      Where in the world?
    </h1>
  );
}
