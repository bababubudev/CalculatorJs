import { functionKeys, type suggestionObject } from "../utils/types";

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
  const highlightCharacters = (preview: string, attempt: string) => {
    let attemptIndex = 0;
    const attemptLength = attempt.length;

    return preview.split("").map((char, index) => {
      const isBold = attemptIndex < attemptLength && char.toLowerCase() === attempt[attemptIndex].toLowerCase();
      if (isBold) attemptIndex++;
      return (
        <span key={index} style={{ fontFamily: isBold ? "FiraSans" : "" }}>
          {char}
        </span>
      );
    });
  };

  return (
    <>
      {!hidePreview &&
        <div className={`preview-display ${isInputBlur ? "blurred" : ""}`}>
          <p className="tooltip">suggestion</p>
          <ul className="preview-list" onMouseDown={e => e.preventDefault()}>
            {previews.suggestions.map((preview, index) => {
              const autoFill = functionKeys[preview].pasteAs;
              const showBraces = autoFill.endsWith("(");

              return (
                (
                  <li
                    key={index}
                    className={previewSelection === index ? "selected" : ""}
                    onPointerDown={() => { setPreviewSelection(index) }}
                    onClick={() => { autoFillPreview(index); }}
                  >
                    <p>
                      {highlightCharacters(preview, attempt)}
                      {showBraces && (
                        <>
                          {"("}<span style={{ fontFamily: "Bold" }}>x</span>{")"}
                        </>
                      )}
                    </p>
                  </li>
                )
              )
            })}
          </ul>
        </div >
      }
    </>
  );
}

export default PreviewDisplay;