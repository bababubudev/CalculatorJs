import { FormEvent, useEffect, useRef, useState } from "react";
import {
  autoCompleteBrackets,
  calculate,
  calculation,
  excludeRight,
  roundNumbers,
  suggestMathFunctions
} from "../utils/UtilityFuncitons";

interface CalculatorIOProps {
  previousOutput: calculation | null;
  addToHistory: (calculation: calculation) => void;
}

function CalculatorIO({ addToHistory, previousOutput }: CalculatorIOProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState<string>("");
  const [topDisplay, setTopDisplay] = useState<string>("");

  const [bracketPreview, setBracketPreview] = useState<string>("");
  const [functionPreview, setFunctionPreview] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const validKeys = /^[a-zA-Z0-9+\-*/.=]$/;
      const isControlKey = event.ctrlKey || event.metaKey;
      const isSupportedKeyCombo = isControlKey && (event.key === "c" || event.key === "v" || event.key === "x");

      if ((event.key === "Backspace" || validKeys.test(event.key)) && inputRef.current && !isSupportedKeyCombo) {
        inputRef.current.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && functionPreview.length > 0) {
      e.preventDefault();
      setInputValue(prev => {
        const updatedInput = excludeRight(prev, "(");
        return prev + functionPreview[0].substring(updatedInput.length);
      });
    }
  }


  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;
    const output = calculate(currentValue);
    const possibleFunctions = suggestMathFunctions(currentValue);
    const updatedValue = autoCompleteBrackets(currentValue);

    setInputValue(currentValue);
    setIsSubmitted(false);
    setBracketPreview(updatedValue);

    possibleFunctions.length > 0
      ? setFunctionPreview(possibleFunctions.map(func => `${func}(`))
      : setFunctionPreview([]);

    // const openParens = (currentValue.match(/\(/g) || []).length;
    // const closeParens = (currentValue.match(/\)/g) || []).length;

    if (output.result !== "") {
      setTopDisplay(output.result);
    } else {
      setTopDisplay("");
    }
  }

  const onCalculationSubmit = (event?: FormEvent<HTMLFormElement>): void => {
    event?.preventDefault();

    const output = calculate(inputValue);
    const roundedResult = roundNumbers(Number(output.result))

    const displayResult = roundedResult.requires
      ? roundedResult.rounded
      : output.result

    if (output.result !== "") {
      addToHistory(output);
      setTopDisplay(bracketPreview);
      setInputValue(displayResult);
      setIsSubmitted(true);
    }
  }

  return (
    <form
      className={`calculation-display ${isSubmitted ? "submitted" : ""}`}
      onSubmit={onCalculationSubmit}
    >
      <div className="display">
        <p className="top-display">
          {topDisplay}
        </p>
        <div className="interaction">
          {isSubmitted && <p className="submit-text">
            {roundNumbers(Number(previousOutput?.result)).requires ? "≈" : "="}
          </p>
          }
          <input
            type="text"
            className="bottom-display"
            ref={inputRef}
            value={inputValue}
            onChange={onInputChange}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          {!isSubmitted && <div
            className="bracket-preview"
          >
            {bracketPreview}
          </div>}
        </div>
      </div>
      <button className="submit-btn">=</button>
    </form>
  );
}

export default CalculatorIO;