import type { angleUnit, historyObject, inputInfo, optionObject, suggestionObject } from "../utils/types";
import { FormEvent, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  autoCompleteBrackets,
  calculate,
  roundNumbers,
  suggestMathFunctions
} from "../utils/utilityFunctions";
import PreviewDisplay from "./PreviewDisplay";

interface CalculatorIOProps {
  needsRounding: boolean;
  option: optionObject;
  addToHistory: (info: historyObject) => void;
}

function CalculatorIO({ addToHistory, needsRounding, option }: CalculatorIOProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState<string>("");
  const [topDisplay, setTopDisplay] = useState<string>("");
  const [isInputBlur, setIsInputBlur] = useState<boolean>(false);

  const [selectedPreview, setSelectedPreview] = useState<number>(0);
  const [bracketPreview, setBracketPreview] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const [functionPreview, setFunctionPreview] = useState<suggestionObject>({ attemptString: "", suggestions: [] });

  const hidePreview = (isSubmitted
    || functionPreview?.suggestions.length <= 0
    || functionPreview?.suggestionUsed);

  const angleUnitLabels: Record<angleUnit, string> = {
    degree: "deg",
    radian: "rad",
    gradian: "grad",
  };

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

    setSelectedPreview(index);
    setInputValue(prev => {
      const lastIndex = prev.lastIndexOf(attempt);

      if (lastIndex !== -1) {
        const before = prev.slice(0, lastIndex);
        const after = prev.slice(lastIndex + attempt.length);
        const currentChanges = before + suggestions[index] + after;

        // ? REFACTORABLE: There must be a better way of updating this
        const currentEvent = { target: { value: currentChanges } } as React.ChangeEvent<HTMLInputElement>;
        onInputChange(currentEvent, true);

        return currentChanges;
      }

      return prev;
    });

    setIsInputBlur(false);
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

    const info: inputInfo = { input: currentValue, angleUnit: option.angleUnit ?? "radian" };
    const updatedValue = autoCompleteBrackets(currentValue);
    const output = calculate(info);
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

    const info: inputInfo = { input: inputValue, angleUnit: option.angleUnit ?? "radian" };
    const output = calculate(info);
    const roundedResult = roundNumbers(Number(output.result), option.precision);

    const displayResult = roundedResult.requires
      ? roundedResult.rounded
      : output.result

    if (output.result !== "") {
      setTopDisplay(bracketPreview);
      setInputValue(displayResult);
      setIsSubmitted(true);

      addToHistory({
        key: uuidv4(),
        operation: bracketPreview,
        result: displayResult,
        needsRounding: roundedResult.requires,
        currentCalculation: output,
        angleUnit: output?.angleUnit
      });
    }
  }

  return (
    <>
      <PreviewDisplay
        attempt={functionPreview.attemptString}
        isInputBlur={isInputBlur}
        hidePreview={hidePreview || false}
        previews={functionPreview}
        previewSelection={selectedPreview}
        autoFillPreview={autoFillPreview}
        setPreviewSelection={setSelectedPreview}
      />
      <form
        className={`calculation-display ${isSubmitted ? "submitted" : ""}`}
        onSubmit={onCalculationSubmit}
        onPointerDown={() => inputRef.current?.focus()}
      >
        <div className="display">
          <p
            className="top-display"
            onMouseDown={e => e.preventDefault()}
          >
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
        <button className="submission-area" type="submit">
          <p className="angle-unit">{angleUnitLabels[option.angleUnit ?? "radian"]}</p>
          <p className="submit-icon">=</p>
        </button>
      </form>
    </>
  );
}

export default CalculatorIO;