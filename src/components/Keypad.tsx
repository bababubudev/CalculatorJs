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
        &#43;
      </button>
      <button
        type="button"
        className="key"
        onClick={() => onKeyClick("-")}
      >
        &minus;
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
        &divide;
      </button>
    </div>
  );
}

export default Keypad;