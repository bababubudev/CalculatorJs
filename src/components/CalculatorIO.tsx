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
  const [isInputBlur, setIsInputBlur] = useState<boolean>(false);

  const [bracketPreview, setBracketPreview] = useState<string>("");
  const [functionPreview, setFunctionPreview] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!inputRef.current) return;

      const validKeys = /^[a-zA-Z0-9+\-*/.=]$/;
      const isControlKey = event.ctrlKey || event.metaKey;
      const isSupportedKeyCombo = isControlKey && (event.key === "c" || event.key === "v" || event.key === "x");

      if ((event.key === "Backspace" || validKeys.test(event.key)) && !isSupportedKeyCombo) {
        inputRef.current.focus();
      }
      else if (event.key === "Escape") {
        inputRef.current.blur();
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
    const updatedValue = autoCompleteBrackets(currentValue);
    const output = calculate(currentValue);
    const possibleFunctions = suggestMathFunctions(currentValue);

    setBracketPreview(updatedValue);
    setInputValue(currentValue);
    setIsInputBlur(false);
    setIsSubmitted(false);

    possibleFunctions.length > 0
      ? setFunctionPreview(possibleFunctions.map(func => `${func}(`))
      : setFunctionPreview([]);

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
      setTopDisplay(bracketPreview);
      setInputValue(displayResult);
      setIsSubmitted(true);

      addToHistory({ operation: bracketPreview, result: displayResult });
    }
  }

  return (
    <>
      {functionPreview.length > 0 &&
        <ul
          className={`preview-display ${isInputBlur ? "blurred" : ""}`}
        >
          {functionPreview.map((preview, i) =>
          (
            <li key={i}>
              {preview}
              <span style={{ fontFamily: "Bold" }}>x</span>{")"}
            </li>
          ))}
        </ul>
      }
      <form
        className={`calculation-display ${isSubmitted ? "submitted" : ""}`}
        onSubmit={onCalculationSubmit}
      >
        <div className="display">
          <p className="top-display">
            {topDisplay}
          </p>
          <div className="interaction">
            {isSubmitted
              ? <p className="submit-text">
                {roundNumbers(Number(previousOutput?.result)).requires ? "≈" : "="}
              </p>
              : <div className="bracket-preview">
                {bracketPreview}
              </div>
            }
            <input
              type="text"
              className="bottom-display"
              ref={inputRef}
              value={inputValue}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              onBlur={() => setIsInputBlur(true)}
              onFocus={() => setIsInputBlur(false)}
              autoFocus
            />
          </div>
        </div>
        <button className="submit-btn">=</button>
      </form>
    </>
  );
}

export default CalculatorIO;