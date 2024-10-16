import { useState } from "react";
import { functionKeys, type suggestionObject } from "../utils/types";
import { TbInfoSquareRounded } from "react-icons/tb";

interface PreviewDisplayProp {
  attempt: string;
  hidePreview: boolean;
  isInputBlur: boolean;
  previews: suggestionObject;
  previewSelection: number;
  autoFillPreview: (index: number) => void;
  setPreviewSelection: (index: number) => void;
}

function PreviewDisplay({ attempt, isInputBlur, hidePreview, previews, previewSelection, autoFillPreview, setPreviewSelection }: PreviewDisplayProp) {
  const [descriptionText, setDescriptionText] = useState<string>("");

  const renderDisplayWithBoldParams = (display: string) => {
    const result: JSX.Element[] = [];
    const attemptLength = attempt.length;
    let attemptIndex = 0;
    let isInParams = false;

    for (let i = 0; i < display.length; i++) {
      const char = display[i];
      const isBold = attemptIndex < attemptLength && char.toLowerCase() === attempt[attemptIndex].toLowerCase();
      if (isBold) attemptIndex++;

      if (display[i - 1] === "(") isInParams = true;
      if (char === ")") isInParams = false;

      result.push(
        <span
          key={i}
          style={{
            fontFamily: isBold ? "FiraSans" : "",
            fontStyle: isInParams ? "italic" : "",
            fontWeight: isInParams ? "bold" : "",
          }}
        >
          {char}
        </span>
      );
    }

    return result;
  };


  return (
    <>
      {!hidePreview &&
        <div className={`preview-display ${isInputBlur ? "" : ""}`}>
          <p className="description">{descriptionText}</p>
          <ul className="preview-list" onMouseDown={e => e.preventDefault()}>
            {previews.suggestions.map((preview, index) => {
              const currentPrev = functionKeys[preview];
              const autoFill = currentPrev.displayAs;
              const selected = previewSelection === index;

              return (
                <div key={index} className={`list-display ${selected ? "selected" : ""}`}>
                  <li
                    className={selected ? "selected" : ""}
                    onPointerDown={() => { setPreviewSelection(index) }}
                    onClick={() => { autoFillPreview(index); }}
                  >
                    <p className="display">{renderDisplayWithBoldParams(autoFill)}</p>
                  </li>

                  <button
                    className="info-btn"
                    onClick={() => {
                      if (selected) {
                        setDescriptionText(currentPrev.description);
                        return;
                      }
                    }}
                  >
                    <TbInfoSquareRounded />
                  </button>
                </div>
              )
            })}
          </ul>
        </div >
      }
    </>
  );
}

export default PreviewDisplay;