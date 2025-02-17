import { useMemo } from "react";
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
    //* NOTE: Higher index means more likely to be selected
    const weightedPlaceholders = placeholderTexts.flatMap((text, index) =>
      Array(index + 1).fill(text)
    );

    const randomIndex = Math.floor(Math.random() * weightedPlaceholders.length);
    return weightedPlaceholders[randomIndex];
  };

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