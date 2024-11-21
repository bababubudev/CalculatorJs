import { useMemo } from "react";
import type { angleUnit, historyObject, optionObject } from "../utils/types";

interface CalculatorFormProps {
  inputValue: string;
  topDisplay: string;
  bracketPreview: string;

  isSubmitted: boolean;
  options: optionObject;
  currentCalc: historyObject | undefined;

  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onCalculationSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  inputFocus: (focus: boolean) => void;

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

  onCalculationSubmit,
  onInputChange,
  handleKeyDown,
  inputFocus,

  inputRef,
  bracketPrevRef,
}: CalculatorFormProps) {

  const angleUnitLabels = useMemo<Record<angleUnit, string>>(() => ({
    degree: "deg",
    radian: "rad",
    gradian: "grad",
  }), []);

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
            placeholder="eg. 2+2-(-3*4)"
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