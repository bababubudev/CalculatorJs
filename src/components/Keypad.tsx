import {
  CgBackspace, CgClose,
  CgCornerDownLeft, CgMathDivide,
  CgMathEqual, CgMathMinus, CgMathPlus
} from "react-icons/cg";

interface KeypadProps {
  onKeyPressed: (key: string) => void;
  onKeySubmit: () => void;
  onKeyClear: () => void;
  onRequestPrevAns: () => void;
}

function Keypad({ onKeyPressed, onKeyClear, onKeySubmit, onRequestPrevAns }: KeypadProps) {
  return (
    <div className="keypad">
      <div className="func">
        <div className="row">
          <button type="button" onClick={() => onKeyPressed("sin()")}>sin</button>
          <button type="button" onClick={() => onKeyPressed("cos()")}>cos</button>
          <button type="button" onClick={() => onKeyPressed("tan()")}>tan</button>
          <button type="button" onClick={() => onKeyPressed("sqrt()")}>√</button>
          <button type="button" onClick={() => onKeyPressed("%")}>%</button>
        </div>
        <div className="row">
          <button type="button" onClick={() => onKeyPressed("asin()")}>asin</button>
          <button type="button" onClick={() => onKeyPressed("acos()")}>acos</button>
          <button type="button" onClick={() => onKeyPressed("atan()")}>atan</button>
          <button type="button" onClick={() => onKeyPressed("deg")}>°</button>
          <button type="button" onClick={() => onKeyPressed("2.71828")}><i>e</i></button>
        </div>
        <div className="row">
          <button type="button" onClick={() => onKeyPressed("ln()")}>ln</button>
          <button type="button" onClick={() => onKeyPressed("log()")}>log</button>
          <button type="button" onClick={() => onKeyPressed("lg")}>log<sub>10</sub></button>
          <button type="button" onClick={() => onKeyPressed("!")}>!</button>
          <button type="button" onClick={() => onKeyPressed("rt(,)")}>
            <sup className="empty-char">&#11034;</sup>
            √
            <span className="empty-char">&#11034;</span>
          </button>
        </div>
        <div className="row">
          <button type="button" onClick={() => onKeyPressed("pi")}>π</button>
          <button type="button" onClick={() => onKeyPressed("(")}>&#40;</button>
          <button type="button" onClick={() => onKeyPressed(")")}>&#41;</button>
          <button type="button" onClick={() => onKeyPressed("|_|")}>|&#11034;|</button>
          <button type="button" onClick={() => onRequestPrevAns()}>ans</button>
        </div>
      </div>
      <div className="arith">
        <div className="row">
          <button type="button" onClick={() => onKeyPressed("7")}>7</button>
          <button type="button" onClick={() => onKeyPressed("8")}>8</button>
          <button type="button" onClick={() => onKeyPressed("9")}>9</button>
          <button type="button" onClick={() => onKeyPressed("⋅")}><CgClose /></button>
          <button type="button" onClick={() => onKeyPressed("/")}><CgMathDivide /></button>
        </div>
        <div className="row">
          <button type="button" onClick={() => onKeyPressed("4")}>4</button>
          <button type="button" onClick={() => onKeyPressed("5")}>5</button>
          <button type="button" onClick={() => onKeyPressed("6")}>6</button>
          <button type="button" onClick={() => onKeyPressed("+")}><CgMathPlus /></button>
          <button type="button" onClick={() => onKeyPressed("-")}><CgMathMinus /></button>
        </div>
        <div className="row">
          <button type="button" onClick={() => onKeyPressed("1")}>1</button>
          <button type="button" onClick={() => onKeyPressed("2")}>2</button>
          <button type="button" onClick={() => onKeyPressed("3")}>3</button>
          <button type="button" onClick={() => onKeyPressed("=")}><CgMathEqual /></button>
          <button type="button" onClick={() => onKeyClear()}><CgBackspace /></button>
        </div>
        <div className="row">
          <button type="button" onClick={() => onKeyPressed("0")}>0</button>
          <button type="button" onClick={() => onKeyPressed(".")}>.</button>
          <button type="button" onClick={() => onKeyPressed("")}>&lt;</button>
          <button type="button" onClick={() => onKeyPressed("")}>&gt;</button>
          <button type="button" onClick={() => onKeySubmit()}><CgCornerDownLeft /></button>
        </div>
      </div>
    </div>
  );
}

export default Keypad;