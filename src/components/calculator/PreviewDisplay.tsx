import { useEffect, useRef, useState } from "react";
import { LuInfo } from "react-icons/lu";
import { functionKeys } from "../../utils/utilityFunctions";
import Modal from "../ui/Modal";

import type { suggestionObject } from "../../types/calculator";

interface PreviewDisplayProp {
  attempt: string;
  hidePreview: boolean;
  addPadding: boolean;
  previews: suggestionObject;
  previewSelection: number;
  inputFocus: (focus: boolean, forceEndPos?: boolean) => void;
  autoFillPreview: (index: number) => void;
  setPreviewSelection: (index: number) => void;
}

function PreviewDisplay({
  attempt,
  hidePreview,
  addPadding,
  previews,
  previewSelection,
  inputFocus,
  autoFillPreview,
  setPreviewSelection,
}: PreviewDisplayProp) {
  const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const [showInfo, setShowInfo] = useState<boolean>(false);

  useEffect(() => {
    if (!isMobile) {
      const selectedItem = itemRefs.current[previewSelection];
      if (selectedItem) {
        selectedItem.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }

    setShowInfo(false);
  }, [isMobile, previewSelection]);

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

  const handleInfoClick = () => {
    setShowInfo(true);
  };

  const handleModalClose = () => {
    setShowInfo(false);
  };

  return (
    <>
      {!hidePreview && previews.suggestions.length > 0 && (
        <div className={`preview-display${addPadding ? " padded" : ""}`}>
          <ul
            className="preview-list"
          >
            {previews.suggestions.map((preview, index) => {
              const currentPrev = functionKeys[preview];
              const autoFill = currentPrev.displayAs;
              const selected = previewSelection === index;

              return (
                <li
                  key={index}
                  ref={(el) => (itemRefs.current[index] = el)}
                  className={selected ? "selected" : ""}
                  onPointerDown={() => { setPreviewSelection(index); }}
                  onClick={() => { autoFillPreview(index); inputFocus(true); }}
                >
                  <p className="display">{renderDisplayWithBoldParams(autoFill)}</p>
                </li>
              )
            })}
            <button
              onClick={handleInfoClick}
              disabled={showInfo}
            >
              <LuInfo className="info-icon" />
            </button>
          </ul>
          <Modal
            isInfo={true}
            isOpen={showInfo}
            dialogue={"Information"}
            description={
              <ul className="infoList">
                {previews.suggestions.map((preview, index) => {
                  const currentPrev = functionKeys[preview];

                  return (
                    <li key={index}>
                      <h3 className="display-as">{currentPrev.displayAs}</h3>
                      <p className="description">{currentPrev.description}</p>
                    </li>
                  )
                })}
              </ul>
            }
            onConfirm={handleModalClose}
            onCancel={handleModalClose}
          />
        </div >
      )}
    </>
  );
}

export default PreviewDisplay;