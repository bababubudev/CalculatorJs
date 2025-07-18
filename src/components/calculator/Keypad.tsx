import { ReactNode } from "react";
import type { optionObject } from "../../types/options";
import { suggestMathFunctions } from "../../utils/utilityFunctions";

interface KeypadProps {
  setOptions: (changes: Partial<optionObject>) => void;
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
  id: number;
  label: ReactNode;
  value: string;
  category: KeypadEnum;
  action?: () => void;
  requiresParentheses?: boolean;
}

function Keypad({ onKeyClick, setOptions, isKeypadCovered, currentValue, options }: KeypadProps) {
  const currentAngleUnit = options.angleUnit?.slice(0, -3) || "deg";

  const getCurrentBracket = (): string => {
    const openCount = [...currentValue].reduce((count, char) => {
      if (char === "(") return count + 1;
      if (char === ")") return count - 1;
      return count;
    }, 0);

    if (openCount === 0) return "(";

    const suggestions = suggestMathFunctions(currentValue);
    if (suggestions.suggestions.length > 0) {
      return "(";
    }

    const lastChar = currentValue.slice(-1);

    const isAfterNumber = /[\d.]$/.test(lastChar);
    const isAfterOperator = /[+\-*/^%]$/.test(lastChar);
    const isAfterComparator = /[<>=!]$/.test(lastChar);
    const isAfterComma = lastChar === ",";
    const isAfterOpenBracket = lastChar === "(";

    if (isAfterOperator || isAfterComparator || isAfterComma || isAfterOpenBracket) {
      return "(";
    }

    if (isAfterNumber && openCount > 0) {
      return ")";
    }

    return openCount > 0 ? ")" : "(";
  };

  const allKeys: KeypadType[] = [
    //* BASIC KEYS
    { id: 1, label: "+", value: "+", category: KeypadEnum.Basic },
    { id: 2, label: "-", value: "-", category: KeypadEnum.Basic },
    { id: 3, label: "*", value: "*", category: KeypadEnum.Basic },
    { id: 4, label: "/", value: "/", category: KeypadEnum.Basic },

    //* FUNCTIONAL KEYS
    {
      id: 5,
      label: "sin",
      value: "sin(",
      category: KeypadEnum.Function,
    },
    {
      id: 6,
      label: "cos",
      value: "cos(",
      category: KeypadEnum.Function,
    },
    {
      id: 7,
      label: "tan",
      value: "tan(",
      category: KeypadEnum.Function,
    },
    {
      id: 8,
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
      id: 9,
      label: <span className="focus-sup">x<sup>y</sup></span>,
      value: "^",
      category: KeypadEnum.Advanced,
      requiresParentheses: false,
    },
    {
      id: 10,
      label: <span><b>&radic;</b>x</span >,
      value: "sqrt",
      category: KeypadEnum.Advanced,
      requiresParentheses: true,
    },
    {
      id: 11,
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
      id: 12,
      label: <span>x<b>!</b></span >,
      value: "!",
      category: KeypadEnum.Advanced,
      requiresParentheses: false,
    }
  ];

  const handleKeyClick = (key: KeypadType) => {
    key.action?.() ?? onKeyClick(`${key.value}${key.requiresParentheses ? "(" : ""}`);
  };

  const renderKeys = (key: string, category: KeypadEnum) => (
    <div key={key} className={`${category}-keys`}>
      {allKeys
        .filter(key => key.category === category)
        .map(key => (
          <button
            key={key.id}
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
      {Object.values(KeypadEnum).map(category => renderKeys(category, category))}
    </div>
  );
}

export default Keypad;