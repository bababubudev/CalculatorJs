import { optionObject } from "../utils/types";
import { ReactNode } from "react";
import { useOptions } from "../context/OptionsContext";

interface KeypadProps {
  onKeyClick: (key: string) => void;
  isKeypadCovered: boolean;
  currentValue: string;
  options: optionObject;
}

enum KeypadEnum {
  Basic = "basic",
  Function = "function",
  Advanced = "advanced",
}

interface KeypadType {
  label: ReactNode;
  value: string;
  category: KeypadEnum;
  action?: () => void;
  requiresParentheses?: boolean;
}

function Keypad({ onKeyClick, isKeypadCovered, currentValue, options }: KeypadProps) {
  const { setOptions } = useOptions();
  const currentAngleUnit = options.angleUnit?.slice(0, -3) || "deg";

  const getCurrentBracket = (): string => {
    const openCount = [...currentValue].reduce((count, char) => {
      if (char === "(") return count + 1;
      if (char === ")") return count - 1;
      return count;
    }, 0);

    return (currentValue.slice(-1) !== "(" && openCount > 0) ? ")" : "(";
  };

  const allKeys: KeypadType[] = [
    //* BASIC KEYS
    { label: "+", value: "+", category: KeypadEnum.Basic },
    { label: "-", value: "-", category: KeypadEnum.Basic },
    { label: "*", value: "*", category: KeypadEnum.Basic },
    { label: "/", value: "/", category: KeypadEnum.Basic },

    //* FUNCTIONAL KEYS
    {
      label: "sin",
      value: "sin(",
      category: KeypadEnum.Function,
    },
    {
      label: "cos",
      value: "cos(",
      category: KeypadEnum.Function,
    },
    {
      label: "tan",
      value: "tan(",
      category: KeypadEnum.Function,
    },
    {
      label:
        <span className="angle-convert">
          <p className={`${currentAngleUnit === "deg" ? "current" : ""}`}>
            deg
          </p>
          <hr />
          <p className={`${currentAngleUnit === "rad" ? "current" : ""}`}>
            rad
          </p>
        </span>,
      value: "",
      category: KeypadEnum.Function,
      action: () => { setOptions({ angleUnit: options.angleUnit === "degree" ? "radian" : "degree" }); }
    },

    //* ADVANCED KEYS
    {
      label: <span className="focus-sup">x<sup>y</sup></span>,
      value: "^",
      category: KeypadEnum.Advanced,
      requiresParentheses: false,
    },
    {
      label: <span><b>&radic;</b>x</span >,
      value: "sqrt",
      category: KeypadEnum.Advanced,
      requiresParentheses: true,
    },
    {
      label:
        <span className="braces">
          <p className={`${getCurrentBracket() === "(" ? "current" : ""}`}>
            {"("}
          </p>
          <p className={`${getCurrentBracket() === ")" ? "current" : ""}`}>
            {")"}
          </p>
        </span>,
      value: getCurrentBracket(),
      category: KeypadEnum.Advanced,
    },
    {
      label: <span>x<b>!</b></span >,
      value: "!",
      category: KeypadEnum.Advanced,
      requiresParentheses: false,
    }
  ];

  const handleKeyClick = (key: KeypadType) => {
    key.action?.() ?? onKeyClick(`${key.value}${key.requiresParentheses ? "(" : ""}`);
  };

  const renderKeys = (category: KeypadEnum) => (
    <div className={`${category}-keys`}>
      {allKeys
        .filter(key => key.category === category)
        .map(key => (
          <button
            key={key.value}
            type="button"
            className={`key ${category}-key`}
            onClick={() => handleKeyClick(key)}
          >
            {key.label}
          </button>
        ))}
    </div>
  );

  return (
    <div className={`keypad ${isKeypadCovered ? "cover" : "uncover"} ${options.showKeypad ? "shown" : "hidden"}`}>
      {Object.values(KeypadEnum).map(category => renderKeys(category))}
    </div>
  );
}

export default Keypad;