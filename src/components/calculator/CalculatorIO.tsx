import { FormEvent, useCallback, useMemo } from "react";
import { useCalculatorState } from "../../hooks/useCalculatorState";
import { usePreview } from "../../hooks/usePreview";
import { historyObject } from "../../types/calculator";
import { optionObject } from "../../types/options";
import CalculatorForm from "./CalculatorForm";
import Keypad from "./Keypad";
import PreviewDisplay from "./PreviewDisplay";

interface CalculatorIOProps {
  passedInput: string;
  options: optionObject;
  setOptions: (changes: Partial<optionObject>) => void;
  askForAnswer: (x: number) => string;
  removePassedInput: () => void;
  addToHistory: (info: historyObject) => void;
}

function CalculatorIO({ addToHistory, options, setOptions, passedInput, askForAnswer, removePassedInput }: CalculatorIOProps) {
  const {
    inputValue, topDisplay, bracketPreview,
    isSubmitted, isLoading, inputFocus,
    handleInputChange, handleSubmit, handleKeyDown: baseHandleKeydown,
    inputRef, bracketPrevRef,
    currentCalc, error, resetCalculator
  } = useCalculatorState({ options, askForAnswer, passedInput, removePassedInput, addToHistory });

  const {
    functionPreview, selectedPreview,
    hidePreview, setSelectedPreview,
    autoFillPreview, handlePreviewKeyDown
  } = usePreview({ inputValue, isSubmitted, onInputChange: handleInputChange });

  const formattedInputValue = useMemo(() => {
    return inputValue.trim();
  }, [inputValue]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const previewHandled = handlePreviewKeyDown(e);
    if (!previewHandled) baseHandleKeydown(e);
  }, [handlePreviewKeyDown, baseHandleKeydown]);

  const handleKeypadInput = useCallback((input: string) => {
    const updatedInput = inputValue + input;
    return updatedInput;
  }, [inputValue, handleInputChange]);

  const onCalculationSubmit = useCallback((event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (isSubmitted) {
      resetCalculator();
      return;
    }

    handleSubmit();
  }, [isSubmitted, handleSubmit, resetCalculator]);

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e.target.value);
  }, [handleInputChange]);

  const ErrorDisplay = useMemo(() => {
    if (!error) return null;

    return (
      <div className="error-display" role="alert">
        <span className="error-message">{error}</span>
      </div>
    );
  }, [error]);

  const LoadingIndicator = useMemo(() => {
    if (!isLoading) return null;

    return (
      <div className="loading-indicator" aria-label="Calculating...">
        <span className="loading-spinner"></span>
      </div>
    );
  }, [isLoading]);

  return (
    <>
      {ErrorDisplay}
      {LoadingIndicator}
      <CalculatorForm
        inputValue={formattedInputValue}
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
        currentValue={formattedInputValue}
        options={options}
      />

      <PreviewDisplay
        attempt={functionPreview.attemptString}
        hidePreview={hidePreview || false}
        previews={functionPreview}
        previewSelection={selectedPreview}
        autoFillPreview={autoFillPreview}
        setPreviewSelection={setSelectedPreview}
        addPadding={!options.showKeypad}
      />
    </>
  );
}

export default CalculatorIO;