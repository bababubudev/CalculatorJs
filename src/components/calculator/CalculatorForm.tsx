import { useMemo, useCallback } from "react";
import type { optionObject } from "../../types/options";
import type { historyObject } from "../../types/calculator";
import type { angleUnit } from "../../types";

interface CalculatorFormProps {
  inputValue: string;
  topDisplay: string;
  bracketPreview: string;
  isSubmitted: boolean;
  options: optionObject;
  currentCalc: historyObject | undefined;
  lastCursorPosition: React.MutableRefObject<number>;

  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onCalculationSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  inputFocus: (focus: boolean, forceEnd?: boolean) => void;

  inputRef: React.RefObject<HTMLInputElement>;
  bracketPrevRef: React.RefObject<HTMLDivElement>;
}

function CalculatorForm({
  inputValue,
  topDisplay,
  bracketPreview,
  isSubmitted,
  options,
  currentCalc,
  lastCursorPosition,
  onCalculationSubmit,
  onInputChange,
  handleKeyDown: baseHandleKeyDown,
  inputFocus,
  inputRef,
  bracketPrevRef,
}: CalculatorFormProps) {
  const placeholderTexts = useMemo<string[]>(() => [
    "eg. nPr(5, 2) * (sin(pi / 6) + cos(pi / 3))",
    "eg. root(4, 2)",
    "eg. sin(30)",
    "eg. 2*pi*cos(pi / 3)",
    "eg. sqrt(2)+3^2",
    "eg. 2*(3+4)",
    "eg. 2+2-(-3*4)",
    "eg. 2^3",
  ], []);

  const angleUnitLabels = useMemo<Record<angleUnit, string>>(() => ({
    degree: "deg",
    radian: "rad",
    gradian: "grad",
  }), []);

  const getRandomPlaceholder = () => {
    const weightedPlaceholders = placeholderTexts.flatMap((text, index) =>
      Array(index + 1).fill(text)
    );
    const randomIndex = Math.floor(Math.random() * weightedPlaceholders.length);
    return weightedPlaceholders[randomIndex];
  };

  const handleInputInteraction = useCallback((e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;

    requestAnimationFrame(() => {
      if (target.selectionStart !== null) {
        lastCursorPosition.current = target.selectionStart;
      }
    });
  }, [lastCursorPosition]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const isControlKey = e.ctrlKey || e.metaKey;
    if (isControlKey && e.key === "a") {
      setTimeout(() => handleInputInteraction(e), 0);
      return;
    }

    baseHandleKeyDown(e);
  }, [baseHandleKeyDown, handleInputInteraction]);

  return (
    <form
      className={`calculation-display ${isSubmitted ? "submitted" : ""}`}
      onSubmit={onCalculationSubmit}
    >
      <div className="display">
        <p
          className="top-display"
          onClick={() => inputFocus(true)}
        >
          {topDisplay}
        </p>
        <div className="interaction">
          {isSubmitted && <p className="submit-text">{currentCalc?.needsRounding ? "≈" : "="}</p>}
          <input
            type="text"
            className="bottom-display"
            ref={inputRef}
            value={inputValue}
            onChange={onInputChange}
            onKeyDown={handleKeyDown}

            // Universal cursor tracking - works on mobile + desktop
            onSelect={handleInputInteraction}
            onClick={handleInputInteraction}
            onFocus={handleInputInteraction}
            onKeyUp={handleInputInteraction}
            onTouchEnd={handleInputInteraction}
            onPointerUp={handleInputInteraction}

            placeholder={getRandomPlaceholder()}
            spellCheck="false"
            autoFocus
          />
          {!isSubmitted && <div className="bracket-preview" ref={bracketPrevRef}>{bracketPreview}</div>}
        </div>
      </div>
      <button className="submission-area" type="submit">
        <p className="angle-unit">{angleUnitLabels[options.angleUnit ?? "radian"]}</p>
        <p className="submit-icon">{isSubmitted ? "AC" : "="}</p>
      </button>
    </form>
  );
}

export default CalculatorForm;