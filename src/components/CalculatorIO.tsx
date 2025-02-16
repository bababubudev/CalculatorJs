import type { angleUnit, historyObject, optionObject, suggestionObject } from "../utils/types";
import { FormEvent, useEffect, useRef, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  autoCompleteBrackets,
  calculate,
  functionKeys,
  roundNumbers,
  suggestMathFunctions,
} from "../utils/utilityFunctions";
import PreviewDisplay from "./PreviewDisplay";
import Keypad from "./Keypad";
import CalculatorForm from "./CalculatorForm";

interface CalculatorIOProps {
  passedInput: string;
  options: optionObject;
  setOptions: (changes: Partial<optionObject>) => void;
  askForAnswer: (x: number) => string;
  removePassedInput: () => void;
  addToHistory: (info: historyObject) => void;
}

function CalculatorIO({ addToHistory, options, setOptions, askForAnswer, passedInput, removePassedInput }: CalculatorIOProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const bracketPrevRef = useRef<HTMLDivElement>(null);
  const isAppleDevice = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);

  const [inputValue, setInputValue] = useState<string>("");
  const [topDisplay, setTopDisplay] = useState<string>("");
  const [bracketPreview, setBracketPreview] = useState<string>("");

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [selectedPreview, setSelectedPreview] = useState<number>(0);
  const [functionPreview, setFunctionPreview] = useState<suggestionObject>({ attemptString: "", suggestions: [] });
  const hidePreview = isSubmitted || functionPreview?.suggestions.length <= 0 || functionPreview?.suggestionUsed;

  const [currentCalc, setCurrentCalc] = useState<historyObject | undefined>(undefined);

  const formattedResult = (result: string, precision: number = 5): [string, boolean] => {
    if (result === "true" || result === "false") {
      return [result, false];
    }

    const roundedResult = roundNumbers(Number(result), precision);
    return roundedResult.requires ? [roundedResult.rounded, true] : [result, false];
  };

  const updateDisplay = useCallback((operation: string, displayOperation?: string, angle?: angleUnit, isFlipped: boolean = false, precision: number = 5) => {
    const { result } = calculate(operation, angle);
    const [displayResult, _] = formattedResult(result, precision);

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

  const inputFocus = (focus = true) => {
    if (!inputRef.current) return;

    if (focus) {
      inputRef.current.focus();
      inputRef.current.scrollLeft = inputRef.current.scrollWidth;

      return;
    }

    inputRef.current.blur();
  };

  const syncBracketPreview = () => {
    if (inputRef.current) {
      const inputElement = inputRef.current;
      const scrollOffset = inputElement.scrollLeft;

      if (bracketPrevRef.current) {
        bracketPrevRef.current.style.transform = `translateX(${-scrollOffset}px)`;
        bracketPrevRef.current.style.willChange = "transform";
      }
    }
  };

  const modifyBrackets = (bracket: HTMLDivElement | null, input: HTMLInputElement | null) => {
    if (!bracket || !input) return;
    if (input.scrollWidth > input.clientWidth) {
      bracket.style.display = "none";
      input.style.paddingRight = "unset";
    }
    else {
      bracket.style.display = "block";
    }
  };

  const handleBracketsOnInput = (currentValue: string) => {
    const input = inputRef.current;
    if (!input) return;

    if (currentValue.includes("(") && !isSubmitted) {
      input.style.paddingRight = "1rem";
    }
    else {
      input.style.paddingRight = "unset";
    }
  };

  const handleAnswerRequest = (currentValue: string) => {
    const ansPattern = /ans\((\d+)([^)]*)/g;
    return currentValue.replace(ansPattern, (_, index) => {
      const ansValue = askForAnswer(Number(index));
      return ansValue.toString();
    });
  };

  useEffect(() => {
    if (!isAppleDevice) return;

    modifyBrackets(bracketPrevRef.current, inputRef.current);
  }, [inputValue, isAppleDevice]);

  //* INFO: Update input with passed input & when options change
  useEffect(() => {
    if (passedInput === "") return;
    inputFocus();

    setIsSubmitted(false);
    updateDisplay(passedInput, undefined, options.angleUnit, false, options.precision);
    setFunctionPreview({
      attemptString: "",
      suggestions: [],
      suggestionUsed: true
    });
  }, [passedInput, updateDisplay, options.precision, options.angleUnit, isAppleDevice]);

  //* INFO: Update submitted input when options change
  useEffect(() => {
    if (!currentCalc || passedInput !== "") {
      return;
    }

    inputFocus();
    const { operation, displayOperation } = currentCalc;
    updateDisplay(operation, displayOperation, options.angleUnit, true, options.precision);
  }, [currentCalc, updateDisplay, options.angleUnit, options.precision, passedInput]);

  //* INFO: Update input value when options change
  useEffect(() => {
    if (currentCalc || passedInput !== "") {
      if (passedInput) setCurrentCalc(undefined);
      return;
    }

    inputFocus();
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
          const { operation, result } = currentCalc;

          setInputValue(operation);
          setTopDisplay(result);
          setBracketPreview(autoCompleteBrackets(operation));

          setIsSubmitted(false);
          setCurrentCalc(undefined);
        }
      }
      else if (event.key === "Escape") {
        inputFocus(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentCalc]);

  //* INFO: Handles positioning bracket preview
  useEffect(() => {
    const inputElement = inputRef.current;
    if (!inputElement) return;

    const handleScroll = () => syncBracketPreview();

    inputElement.addEventListener("scroll", handleScroll);

    return () => {
      inputElement.removeEventListener("scroll", handleScroll);
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
        const selectedAutofill = functionKeys[selectedFunc].pasteAs;

        const currentChanges = before + selectedAutofill + after;

        // ? REFACTOR: There must be a better way of updating this
        const currentEvent = { target: { value: currentChanges } } as React.ChangeEvent<HTMLInputElement>;
        onInputChange(currentEvent, true);

        return currentChanges;
      }

      return prev;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const suggestions = functionPreview.suggestions;

    //* INFO: If nothing shown return *//
    if (hidePreview) return;

    if ((e.key === "Tab" || e.key === "Enter") && suggestions.length > 0) {
      e.preventDefault();
      autoFillPreview(selectedPreview);
      setSelectedPreview(0);
    } else if (suggestions.length > 1) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setSelectedPreview(prev => (prev + 1) % suggestions.length);
      }
      else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSelectedPreview(prev => (prev - 1 + suggestions.length) % suggestions.length)
      }
    }
  };

  const handleKeypadInput = (input: string) => {
    const currentInput = inputValue;
    const updatedInput = currentInput + input;

    const currentEvent = { target: { value: updatedInput } } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(currentEvent, true);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, usedCall: boolean = false) => {
    setIsSubmitted(false);

    setCurrentCalc(undefined);
    removePassedInput();

    let currentValue = e.target.value;

    //*NOTE: Replace ans(n) with the value from history
    currentValue = handleAnswerRequest(currentValue);
    handleBracketsOnInput(currentValue);

    const updatedValue = autoCompleteBrackets(currentValue);
    const { result } = calculate(currentValue, options.angleUnit);
    const [displayResult, _] = formattedResult(result, options.precision);

    const { attemptString, suggestions } = suggestMathFunctions(currentValue);

    setInputValue(currentValue);
    setBracketPreview(updatedValue);
    setTopDisplay(displayResult);

    suggestions.length > 0
      ? setFunctionPreview({ attemptString, suggestions, suggestionUsed: usedCall })
      : setFunctionPreview({ attemptString: "", suggestions: [] });

    setSelectedPreview(0);
  };

  const onCalculationSubmit = (event?: FormEvent<HTMLFormElement>): void => {
    event?.preventDefault();

    if (isSubmitted) {
      const currentEvent = { target: { value: "" } } as React.ChangeEvent<HTMLInputElement>;
      onInputChange(currentEvent, true);

      return;
    }

    const output = calculate(inputValue, options.angleUnit);
    const [displayResult, rounded] = formattedResult(output.result, options.precision);

    if (output.result !== "") {
      setTopDisplay(bracketPreview);
      setInputValue(displayResult);
      setIsSubmitted(true);

      const currentInfo: historyObject = {
        key: uuidv4(),
        operation: inputValue,
        displayOperation: bracketPreview,
        result: displayResult,
        needsRounding: rounded,
        angleUnit: output?.angleUnit
      };

      setCurrentCalc(currentInfo);
      addToHistory(currentInfo);
    }
  };

  return (
    <>
      <CalculatorForm
        inputValue={inputValue}
        topDisplay={topDisplay}
        bracketPreview={bracketPreview}
        isSubmitted={isSubmitted}
        options={options}
        currentCalc={currentCalc}
        onCalculationSubmit={onCalculationSubmit}
        onInputChange={onInputChange}
        handleKeyDown={handleKeyDown}
        inputFocus={inputFocus}
        inputRef={inputRef}
        bracketPrevRef={bracketPrevRef}
      />
      <Keypad
        setOptions={setOptions}
        onKeyClick={handleKeypadInput}
        isKeypadCovered={!hidePreview}
        currentValue={inputValue}
        options={options}
      />
      <PreviewDisplay
        attempt={functionPreview.attemptString}
        hidePreview={hidePreview || false}
        previews={functionPreview}
        previewSelection={selectedPreview}
        autoFillPreview={autoFillPreview}
        setPreviewSelection={setSelectedPreview}
        addPadding={options.showKeypad ? false : true}
      />
    </>
  );
}

export default CalculatorIO;