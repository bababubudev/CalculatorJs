import { type suggestionInfo } from "../utils/UtilityFuncitons";

interface PreviewDisplayProp {
  hidePreview: boolean;
  isInputBlur: boolean;
  previews: suggestionInfo;
  previewSelection: number;
  autoFillPreview: (index: number) => void;
  setPreviewSelection: (index: number) => void;
}

function PreviewDisplay({ isInputBlur, hidePreview, previews, previewSelection, autoFillPreview, setPreviewSelection }: PreviewDisplayProp) {
  return (
    <>
      {!hidePreview &&
        <div className={`preview-display ${isInputBlur ? "blurred" : ""}`}>
          <p>suggestion</p>
          <ul className="preview-list" onMouseDown={e => e.preventDefault()}>
            {previews.suggestions.map((preview, index) =>
            (
              <li
                key={index}
                className={previewSelection === index ? "selected" : ""}
                onPointerDown={() => { setPreviewSelection(index) }}
                onClick={() => { autoFillPreview(index); }}
              >
                {preview}
                <span style={{ fontFamily: "Bold" }}>x</span>{")"}
              </li>
            ))}
          </ul>
        </div >
      }
    </>
  );
}

export default PreviewDisplay;