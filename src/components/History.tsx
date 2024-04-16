import { IoCopyOutline } from "react-icons/io5";

type history = {
  operation: string;
  result: string;
}

interface HistoryProp {
  history: history[];
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
          <li key={i}>
            <div className="history-part" onClick={() => onHistoryClicked(i)}>
              <p className="operation" style={{ letterSpacing: "0.5rem" }}>
                {elem.operation}
              </p>
              <p className="result">{elem.result}</p>
            </div>
            <div className="detail">
              <span className="index">({i + 1})</span>
              <button className="copy-btn">
                <IoCopyOutline className="copy-icon" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section >
  );
}

export default History;