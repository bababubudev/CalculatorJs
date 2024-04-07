import {
  CgMathDivide, CgMathEqual,
  CgClose, CgMathPlus,
  CgMathMinus, CgBackspace,
  CgCornerDownLeft
} from "react-icons/cg";

interface KeypadProps {
  OnKeyDown: (key: string) => void;
  OnBackspace: () => void;
  /* Implement caret movement */
  OnSubmit: () => void;
}

function CalculatorKeypad({ OnKeyDown, OnBackspace, OnSubmit }: KeypadProps) {
  return (
    <div className="keypad">
      <div className="row row1">
        <button type="button" onClick={() => OnKeyDown("7")}>7</button>
        <button type="button" onClick={() => OnKeyDown("8")}>8</button>
        <button type="button" onClick={() => OnKeyDown("9")}>9</button>
        <button type="button" onClick={() => OnKeyDown("x")}><CgClose /></button>
        <button type="button" onClick={() => OnKeyDown("/")}><CgMathDivide /></button>
      </div>
      <div className="row row2">
        <button type="button" onClick={() => OnKeyDown("4")}>4</button>
        <button type="button" onClick={() => OnKeyDown("5")}>5</button>
        <button type="button" onClick={() => OnKeyDown("6")}>6</button>
        <button type="button" onClick={() => OnKeyDown("+")}><CgMathPlus /></button>
        <button type="button" onClick={() => OnKeyDown("-")}><CgMathMinus /></button>
      </div>
      <div className="row row3">
        <button type="button" onClick={() => OnKeyDown("1")}>1</button>
        <button type="button" onClick={() => OnKeyDown("2")}>2</button>
        <button type="button" onClick={() => OnKeyDown("3")}>3</button>
        <button type="button" onClick={() => OnKeyDown("=")}><CgMathEqual /></button>
        <button type="button" onClick={() => OnBackspace()}><CgBackspace /></button>
      </div>
      <div className="row row4">
        <button type="button" onClick={() => OnKeyDown("0")}>0</button>
        <button type="button" onClick={() => OnKeyDown(".")}>.</button>
        <button type="button" onClick={() => OnKeyDown("")}>&lt;</button>
        <button type="button" onClick={() => OnKeyDown("")}>&gt;</button>
        <button type="button" onClick={() => OnSubmit()}><CgCornerDownLeft /></button>
      </div>
    </div>
  );
}

export default CalculatorKeypad;