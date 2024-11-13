import { useEffect, useRef, useState } from "react";
import { functionKeys, type suggestionObject } from "../utils/types";
import { TbInfoSquareRounded } from "react-icons/tb";
import Modal from "./Modal";

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
  const previewListRef = useRef<HTMLUListElement>(null);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  useEffect(() => {
    const previewList = previewListRef.current;
    if (previewList) {
      const handleWheel = (event: WheelEvent) => {
        if (event.deltaY !== 0) {
          event.preventDefault();
          previewList.scrollLeft += event.deltaY;
        }
      };
      previewList.addEventListener("wheel", handleWheel);
      return () => {
        previewList.removeEventListener("wheel", handleWheel);
      };
    }
  }, []);

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


  return (
    <>
      {!hidePreview &&
        <div className={`preview-display ${isInputBlur ? "" : ""}`}>
          <ul
            className="preview-list"
            onMouseDown={e => e.preventDefault()}
            ref={previewListRef}
          >
            {previews.suggestions.map((preview, index) => {
              const currentPrev = functionKeys[preview];
              const autoFill = currentPrev.displayAs;
              const selected = previewSelection === index;

              return (
                <div className="list-diplay">
                  <li
                    className={selected ? "selected" : ""}
                    onPointerDown={() => { setPreviewSelection(index) }}
                    onClick={() => { autoFillPreview(index); }}
                  >
                    <p className="display">{renderDisplayWithBoldParams(autoFill)}</p>
                  </li>
                </div>
              )
            })}
            <button
              onClick={handleInfoClick}
              disabled={showInfo}
            >
              <TbInfoSquareRounded className="info-icon" />
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
            onConfirm={() => setShowInfo(false)}
            onCancel={() => setShowInfo(false)}
          />
        </div >
      }
    </>
  );
}

export default PreviewDisplay;