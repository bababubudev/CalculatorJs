import type { angleUnit, historyObject, optionObject, suggestionObject } from "../utils/types";
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
  passedInput: historyObject | undefined;
  options: optionObject;
  removePassedInput: () => void;
  addToHistory: (info: historyObject) => void;
}

function CalculatorIO({ addToHistory, options, passedInput, removePassedInput }: CalculatorIOProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState<string>("");
  const [topDisplay, setTopDisplay] = useState<string>("");
  const [bracketPreview, setBracketPreview] = useState<string>("");

  const [isInputBlur, setIsInputBlur] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const [selectedPreview, setSelectedPreview] = useState<number>(0);
  const [functionPreview, setFunctionPreview] = useState<suggestionObject>({ attemptString: "", suggestions: [] });
  const hidePreview = isSubmitted || functionPreview?.suggestions.length <= 0 || functionPreview?.suggestionUsed;

  const angleUnitLabels: Record<angleUnit, string> = {
    degree: "deg",
    radian: "rad",
    gradian: "grad",
  };

  const [currentCalc, setCurrentCalc] = useState<historyObject | undefined>(undefined);

  const focusInput = () => {
    if (!inputRef.current) return;
    setIsInputBlur(false);
    inputRef.current.focus();
  }

  useEffect(() => {
    if (!passedInput) return;

    focusInput();
    setIsSubmitted(false);
    const { operation } = passedInput;
    const { result } = calculate(operation, options.angleUnit);

    const roundedResult = roundNumbers(Number(result), options.precision);
    const displayResult = roundedResult.requires ? roundedResult.rounded : result;
    const newBracketPreview = autoCompleteBrackets(operation);

    setInputValue(operation);
    setTopDisplay(displayResult);
    setFunctionPreview({ attemptString: "", suggestions: [], suggestionUsed: true });

    setBracketPreview(newBracketPreview);
  }, [passedInput, options.precision, options.angleUnit]);

  useEffect(() => {
    if (!currentCalc || passedInput) {
      return;
    }

    focusInput();
    const { operation, displayOperation } = currentCalc;
    const { result } = calculate(operation, options.angleUnit);

    const roundedResult = roundNumbers(Number(result), options.precision);
    const displayResult = roundedResult.requires ? roundedResult.rounded : result;
    const newBracketPreview = autoCompleteBrackets(displayResult);

    setInputValue(displayResult);
    setTopDisplay(displayOperation ?? operation);
    setBracketPreview(newBracketPreview);
  }, [currentCalc, options.angleUnit, options.precision, passedInput]);

  useEffect(() => {
    if (currentCalc || passedInput || !topDisplay) return;

    focusInput();
    const { result } = calculate(inputValue, options.angleUnit);
    const roundedResult = roundNumbers(Number(result), options.precision);
    const displayResult = roundedResult.requires ? roundedResult.rounded : result;

    setTopDisplay(displayResult);
  }, [inputValue, topDisplay, currentCalc, passedInput, options.angleUnit, options.precision]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!inputRef.current) return;

      const validOptions = /^[a-zA-Z0-9+\-*/.=]$/;
      const validKeys = event.key === "Backspace" || validOptions.test(event.key);
      const isControlKey = event.ctrlKey || event.metaKey;
      const isSupportedKeyCombo = isControlKey && ["c", "v", "x"].includes(event.key);

      if (validKeys && !isSupportedKeyCombo) {
        inputRef.current.focus();
        if (event.key === "Backspace" && currentCalc) {
          event.preventDefault();
          setIsInputBlur(false);

          const { operation, result } = currentCalc;

          setInputValue(operation);
          setTopDisplay(result);
          setBracketPreview(autoCompleteBrackets(operation));

          setIsSubmitted(false);
          setCurrentCalc(undefined);
        }
      }
      else if (event.key === "Escape") {
        inputRef.current.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentCalc]);

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

        // ? REFACTOR: There must be a better way of updating this
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
    setIsInputBlur(false);
    setIsSubmitted(false);
    setCurrentCalc(undefined);
    removePassedInput();

    const currentValue = e.target.value;

    const updatedValue = autoCompleteBrackets(currentValue);
    const { result } = calculate(currentValue, options.angleUnit);
    const roundedResult = roundNumbers(Number(result), options.precision);
    const displayResult = roundedResult.requires ? roundedResult.rounded : result;

    const { attemptString, suggestions } = suggestMathFunctions(currentValue);

    setInputValue(currentValue);
    setBracketPreview(updatedValue);
    setSelectedPreview(0);

    suggestions.length > 0
      ? setFunctionPreview({ attemptString, suggestions: suggestions.map(func => `${func}(`), suggestionUsed: usedCall })
      : setFunctionPreview({ attemptString: "", suggestions: [] });

    setTopDisplay(displayResult);
  };

  const onCalculationSubmit = (event?: FormEvent<HTMLFormElement>): void => {
    event?.preventDefault();

    if (isSubmitted) return;

    const output = calculate(inputValue, options.angleUnit);
    const roundedResult = roundNumbers(Number(output.result), options.precision);

    const displayResult = roundedResult.requires
      ? roundedResult.rounded
      : output.result

    if (output.result !== "") {
      setTopDisplay(bracketPreview);
      setInputValue(displayResult);
      setIsSubmitted(true);

      const currentInfo: historyObject = {
        key: uuidv4(),
        operation: inputValue,
        displayOperation: bracketPreview,
        result: displayResult,
        needsRounding: roundedResult.requires,
        angleUnit: output?.angleUnit
      };

      setCurrentCalc(currentInfo);
      addToHistory(currentInfo);
    }
  };

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
      >
        <div className="display">
          <p
            className="top-display"
            onPointerDown={e => e.preventDefault()}
          >
            {topDisplay}
          </p>
          <div className="interaction">
            {isSubmitted
              ? <p className="submit-text">
                {currentCalc?.needsRounding ? "≈" : "="}
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
          <p className="angle-unit">{angleUnitLabels[options.angleUnit ?? "radian"]}</p>
          <p className="submit-icon">=</p>
        </button>
      </form>
    </>
  );
}

export default CalculatorIO;