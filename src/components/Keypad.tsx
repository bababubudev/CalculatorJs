import { optionObject } from "../utils/types";

interface KeypadProps {
  onKeyClick: (key: string) => void;
  options: optionObject;
}

function Keypad({ onKeyClick, options }: KeypadProps) {
  return options.showKeypad && (
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