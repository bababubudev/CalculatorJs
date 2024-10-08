import { functionKeys } from "../utils/types";
import type { angleUnit, historyObject, optionObject, suggestionObject } from "../utils/types";
import { FormEvent, useEffect, useRef, useState, useMemo, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  autoCompleteBrackets,
  calculate,
  roundNumbers,
  suggestMathFunctions,
} from "../utils/utilityFunctions";
import PreviewDisplay from "./PreviewDisplay";

interface CalculatorIOProps {
  passedInput: string;
  options: optionObject;
  askForAnswer: (x: number) => number;
  removePassedInput: () => void;
  addToHistory: (info: historyObject) => void;
}

function CalculatorIO({ addToHistory, options, askForAnswer, passedInput, removePassedInput }: CalculatorIOProps) {
  const PLACEHOLDERS = [
    "ex. 2-2(3-3)",
    "ex. sqrt(4)",
    "ex. asin(0.6)",
    "ex. cos(90)",
  ];

  const inputRef = useRef<HTMLInputElement>(null);
  const bracketPrevRef = useRef<HTMLDivElement>(null);

  const [inputValue, setInputValue] = useState<string>("");
  const [topDisplay, setTopDisplay] = useState<string>("");
  const [bracketPreview, setBracketPreview] = useState<string>("");

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isInputBlur, setIsInputBlur] = useState<boolean>(false);

  const [placeholderInd, setPlaceholderInd] = useState<number>(0);
  const [selectedPreview, setSelectedPreview] = useState<number>(0);
  const [functionPreview, setFunctionPreview] = useState<suggestionObject>({ attemptString: "", suggestions: [] });
  const hidePreview = isSubmitted || functionPreview?.suggestions.length <= 0 || functionPreview?.suggestionUsed;

  const angleUnitLabels = useMemo<Record<angleUnit, string>>(() => ({
    degree: "deg",
    radian: "rad",
    gradian: "grad",
  }), []);

  const [currentCalc, setCurrentCalc] = useState<historyObject | undefined>(undefined);

  const focusInput = () => {
    if (!inputRef.current) return;
    inputRef.current?.focus();
    setIsInputBlur(false);
  };

  const updateDisplay = useCallback((operation: string, displayOperation?: string, angle?: angleUnit, isFlipped: boolean = false, precision: number = 5) => {
    const { result } = calculate(operation, angle);
    const roundedResult = roundNumbers(Number(result), precision);
    const displayResult = roundedResult.requires ? roundedResult.rounded : result;

    if (!isFlipped) {
      setInputValue(operation);
      setTopDisplay(displayResult);
      setBracketPreview(autoCompleteBrackets(operation));
    }
    else {
      setIsSubmitted(true);
      setInputValue(displayResult);
      setTopDisplay(displayOperation ?? operation);
    }
  }, []);

  const syncBracketPreview = () => {
    if (inputRef.current && bracketPrevRef.current) {
      const inputElement = inputRef.current;
      const scrollOffset = inputElement.scrollLeft;

      bracketPrevRef.current.style.transform = `translateX(${-scrollOffset}px)`;
    }
  };

  //* INFO: Update input with passed input & when options change
  useEffect(() => {
    if (passedInput === "") return;

    focusInput();
    setIsSubmitted(false);
    updateDisplay(passedInput, undefined, options.angleUnit, false, options.precision);
    setFunctionPreview({
      attemptString: "",
      suggestions: [],
      suggestionUsed: true
    });
  }, [passedInput, updateDisplay, options.precision, options.angleUnit]);

  //* INFO: Update submitted input when options change
  useEffect(() => {
    if (!currentCalc || passedInput !== "") {
      return;
    }

    focusInput();
    const { operation, displayOperation } = currentCalc;
    updateDisplay(operation, displayOperation, options.angleUnit, true, options.precision);
  }, [currentCalc, updateDisplay, options.angleUnit, options.precision, passedInput]);

  //* INFO: Update input value when options change
  useEffect(() => {
    if (currentCalc || passedInput !== "") {
      if (passedInput) setCurrentCalc(undefined);
      return;
    }

    focusInput();
    updateDisplay(inputValue, undefined, options.angleUnit, false, options.precision);
  }, [inputValue, topDisplay, updateDisplay, currentCalc, passedInput, options.angleUnit, options.precision]);

  //* INFO: Handle input focus
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

  //* INFO: Handles positioning bracket preview
  useEffect(() => {
    const inputElement = inputRef.current;

    if (inputElement) {
      inputElement.addEventListener("scroll", syncBracketPreview);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener("scroll", syncBracketPreview);
      }
    };
  }, []);

  const autoFillPreview = (index: number) => {
    const suggestions = functionPreview.suggestions;
    const attempt = functionPreview.attemptString;


    setSelectedPreview(index);
    setInputValue(prev => {
      const previousValue = prev.toLowerCase();
      const lastIndex = previousValue.lastIndexOf(attempt);

      if (lastIndex !== -1) {
        const before = previousValue.slice(0, lastIndex);
        const after = previousValue.slice(lastIndex + attempt.length);

        const selectedFunc = suggestions[index];
        const selectedAutofill = functionKeys[selectedFunc];

        const currentChanges = before + selectedAutofill + after;

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

    let currentValue = e.target.value;

    //*NOTE: Replace ans(n) with the value from history
    const ansPattern = /ans\((\d+)([^)]*)/g;
    currentValue = currentValue.replace(ansPattern, (_, index) => {
      const ansValue = askForAnswer(Number(index));
      return isNaN(ansValue) ? `NaN` : String(ansValue);
    });

    const updatedValue = autoCompleteBrackets(currentValue);
    const { result } = calculate(currentValue, options.angleUnit);
    const roundedResult = roundNumbers(Number(result), options.precision);
    const displayResult = roundedResult.requires ? roundedResult.rounded : result;

    const { attemptString, suggestions } = suggestMathFunctions(currentValue);

    setInputValue(currentValue);
    setBracketPreview(updatedValue);
    setSelectedPreview(0);

    suggestions.length > 0
      ? setFunctionPreview({ attemptString, suggestions, suggestionUsed: usedCall })
      : setFunctionPreview({ attemptString: "", suggestions: [] });

    setTopDisplay(displayResult);
  };

  const onCalculationSubmit = (event?: FormEvent<HTMLFormElement>): void => {
    event?.preventDefault();

    if (isSubmitted) {
      const currentEvent = { target: { value: "" } } as React.ChangeEvent<HTMLInputElement>;
      onInputChange(currentEvent, true);
      setPlaceholderInd(prev => {
        const nextInd = prev + 1;
        return nextInd < PLACEHOLDERS.length ? nextInd : 0;
      });

      return;
    }

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
              : <div className="bracket-preview" ref={bracketPrevRef}>
                {bracketPreview}
              </div>
            }
            <input
              type="text"
              className="bottom-display"
              placeholder={PLACEHOLDERS[placeholderInd]}
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
          <p className="submit-icon">{isSubmitted ? "AC" : "="}</p>
        </button>
      </form>
    </>
  );
}

export default CalculatorIO;