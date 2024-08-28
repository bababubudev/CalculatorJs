import { IoTrashBinOutline } from "react-icons/io5";
import type { calculationInfo } from "../utils/UtilityFuncitons";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import React, { useRef } from "react";

interface HistoryProp {
  history: calculationInfo[];
  toggleHistoryShown: () => void;
  removeFromHistory: (index: number) => void;
  clearHistory: () => void;
}

function History({ history, removeFromHistory, toggleHistoryShown }: HistoryProp) {
  const nodeRefs = useRef<(React.RefObject<HTMLLIElement> | null)[]>([]);

  const onHistoryClicked = (index: number): void => {
    removeFromHistory(index);
  }

  return (
    <section className="history-div" onClick={toggleHistoryShown}>
      <TransitionGroup component="ul">
        {history.map((elem, i) => {
          if (!nodeRefs.current[i]) {
            nodeRefs.current[i] = React.createRef<HTMLLIElement>();
          }

          return (
            <CSSTransition
              key={i}
              timeout={500}
              classNames="fade"
              nodeRef={nodeRefs.current[i]}
            >
              <li ref={nodeRefs.current[i]}>
                <div className="history-part">
                  <p className="operation">{elem.operation}</p>
                  <span>{elem.needsRounding ? "≈" : "="}</span>
                  <p className="result">{elem.result}</p>
                </div>
                <div className="detail">
                  <button className="del-btn" onClick={() => onHistoryClicked(i)}>
                    <IoTrashBinOutline className="del-icon" />
                  </button>
                  <span className="index">{i}</span>
                </div>
              </li>
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </section>
  );
}

export default History;