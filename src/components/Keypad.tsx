interface KeypadProps {
  onKeyClick: (key: string) => void;
}

function Keypad({ onKeyClick }: KeypadProps) {
  return (
    <div className="keypad">
      <button
        type="button"
        className="key"
        onClick={() => onKeyClick("+")}
      >
        +
      </button>
      <button
        type="button"
        className="key"
        onClick={() => onKeyClick("-")}
      >
        -
      </button>
      <button
        type="button"
        className="key"
        onClick={() => onKeyClick("*")}
      >
        &times;
      </button>
      <button
        type="button"
        className="key"
        onClick={() => onKeyClick("/")}
      >
        /
      </button>
    </div>
  );
}

export default Keypad;