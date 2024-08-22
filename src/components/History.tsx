import { IoCopyOutline } from "react-icons/io5";
import type { calculationInfo } from "../utils/UtilityFuncitons";

interface HistoryProp {
  history: calculationInfo[];
  toggleHistoryShown: () => void;
  removeFromHistory: (index: number) => void;
  clearHistory: () => void;
}

function History({ history, removeFromHistory, toggleHistoryShown }: HistoryProp) {
  const onHistoryClicked = (index: number): void => {
    removeFromHistory(index);
  }

  return (
    <section
      className="history-div"
      onClick={toggleHistoryShown}
    >
      <ul>
        {history.map((elem, i) => (
          <li key={elem?.key ?? i} onClick={() => onHistoryClicked(i)}>
            <div className="history-part">
              <p className="operation">{elem.operation}</p>
              <span>{elem.needsRounding ? "≈" : "="}</span>
              <p className="result">{elem.result}</p>
            </div>
            <div className="detail">
              <span className="index">({history.length - i})</span>
              <button className="copy-btn">
                <IoCopyOutline className="copy-icon" />
              </button>
            </div>
          </li>
        ))
        }
      </ul>
    </section >
  );
}

export default History;