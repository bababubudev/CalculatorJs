import { FormEvent, useEffect, useRef, useState } from "react";
import {
  type calculationInfo,
  autoCompleteBrackets,
  calculate,
  roundNumbers,
  suggestionInfo,
  suggestMathFunctions
} from "../utils/UtilityFuncitons";

interface CalculatorIOProps {
  needsRounding: boolean;
  addToHistory: (info: calculationInfo) => void;
}

function CalculatorIO({ addToHistory, needsRounding }: CalculatorIOProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState<string>("");
  const [topDisplay, setTopDisplay] = useState<string>("");
  const [isInputBlur, setIsInputBlur] = useState<boolean>(false);

  const [bracketPreview, setBracketPreview] = useState<string>("");
  const [functionPreview, setFunctionPreview] = useState<suggestionInfo>({ attemptString: "", suggestions: [] });
  const [selectedPreview, setSelectedPreview] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const hidePreview = isSubmitted
    || functionPreview?.suggestions.length <= 0
    || functionPreview?.suggestionUsed;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!inputRef.current) return;

      const validOptions = /^[a-zA-Z0-9+\-*/.=]$/;
      const validKeys = event.key === "Backspace" || validOptions.test(event.key);
      const isControlKey = event.ctrlKey || event.metaKey;
      const isSupportedKeyCombo = isControlKey && ["c", "v", "x"].includes(event.key);

      if (validKeys && !isSupportedKeyCombo) {
        inputRef.current.focus();
      }
      else if (event.key === "Escape") {
        inputRef.current.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const autoFillPreview = (index: number) => {
    const suggestions = functionPreview.suggestions;
    const attempt = functionPreview.attemptString;

    setInputValue(prev => {
      const lastIndex = prev.lastIndexOf(attempt);

      if (lastIndex !== -1) {
        const before = prev.slice(0, lastIndex);
        const after = prev.slice(lastIndex + attempt.length);
        const currentChanges = before + suggestions[index] + after;

        // ? There must be a better way of updating this
        const currentEvent = { target: { value: currentChanges } } as React.ChangeEvent<HTMLInputElement>;
        onInputChange(currentEvent, true);

        return currentChanges;
      }

      return prev;
    });

    setSelectedPreview(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const suggestions = functionPreview.suggestions;

    if (e.key === "Tab" && suggestions.length > 0) {
      e.preventDefault();
      autoFillPreview(selectedPreview);
      setSelectedPreview(0);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedPreview(prev => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedPreview(prev => (prev - 1 + suggestions.length) % suggestions.length)
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, usedCall: boolean = false) => {
    const currentValue = e.target.value;

    const updatedValue = autoCompleteBrackets(currentValue);
    const output = calculate(currentValue);
    const possibleFunctions = suggestMathFunctions(currentValue);

    setInputValue(currentValue);
    setIsInputBlur(false);
    setIsSubmitted(false);
    setBracketPreview(updatedValue);
    setSelectedPreview(0);

    const currentAttempt = possibleFunctions.attemptString;
    const currentSuggestions = possibleFunctions.suggestions.map(func => `${func}(`);

    possibleFunctions.suggestions.length > 0
      ? setFunctionPreview({ attemptString: currentAttempt, suggestions: currentSuggestions, suggestionUsed: usedCall })
      : setFunctionPreview({ attemptString: "", suggestions: [] });

    setTopDisplay(output.result || "")
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

      addToHistory({
        operation: bracketPreview,
        result: displayResult,
        needsRounding: roundedResult.requires,
        currentCalculation: output
      });
    }
  }

  return (
    <>
      {!hidePreview &&
        <div className={`preview-display ${isInputBlur ? "blurred" : ""}`}>
          <p>suggestion</p>
          <ul className="preview-list">
            {functionPreview.suggestions.map((preview, index) =>
            (
              <li
                key={index}
                className={selectedPreview === index ? "selected" : ""}
                onClick={() => autoFillPreview(index)}
              >
                {preview}
                <span style={{ fontFamily: "Bold" }}>x</span>{")"}
              </li>
            ))}
          </ul>
        </div>
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
                {needsRounding ? "≈" : "="}
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