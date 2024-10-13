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

  const highlightCharacters = (display: string, attempt: string): JSX.Element[] => {
    let attemptIndex = 0;
    const attemptLength = attempt.length;

    return display.split("").map((char, index) => {
      const isBold = attemptIndex < attemptLength && char.toLowerCase() === attempt[attemptIndex].toLowerCase();
      if (isBold) attemptIndex++;

      return (
        <span key={index} style={{ fontFamily: isBold ? "FiraSans" : "" }}>
          {char}
        </span>
      );
    });
  };

  const renderDisplayWithBoldParams = (display: string) => {
    const openParenIndex = display.indexOf("(");
    const closeParenIndex = display.indexOf(")");

    if (openParenIndex === -1 || closeParenIndex === -1) {
      return highlightCharacters(display, attempt);
    }

    const beforeParams = display.substring(0, openParenIndex + 1);
    const params = display.substring(openParenIndex + 1, closeParenIndex);
    const afterParams = display.substring(closeParenIndex);

    return (
      <>
        {highlightCharacters(beforeParams, attempt)}
        <span style={{ fontStyle: "italic", fontWeight: "bold" }}>
          {highlightCharacters(params, attempt)}
        </span>
        {highlightCharacters(afterParams, attempt)}
      </>
    );
  };

  return (
    <>
      {!hidePreview &&
        <div className={`preview-display ${isInputBlur ? "blurred" : ""}`}>
          <ul className="preview-list" onMouseDown={e => e.preventDefault()}>
            {previews.suggestions.map((preview, index) => {
              const autoFill = functionKeys[preview].displayAs;

              return (
                <li
                  key={index}
                  className={previewSelection === index ? "selected" : ""}
                  onPointerDown={() => { setPreviewSelection(index) }}
                  onClick={() => { autoFillPreview(index); }}
                >
                  <p>{renderDisplayWithBoldParams(autoFill)}</p>
                </li>
              )
            })}
          </ul>
        </div >
      }
    </>
  );
}

export default PreviewDisplay;