interface HistoryProp {
  history: string[];
  toggleHistoryShown: () => void;
  removeFromHistory: (index: number) => void;
  clearHistory: () => void;
}

function History({ history, removeFromHistory, toggleHistoryShown }: HistoryProp) {

  const onHistoryClicked = (index: number): void => {
    navigator.clipboard.writeText(history[index]);
    removeFromHistory(index);
  }

  return (
    <section
      className="history-div"
      onClick={toggleHistoryShown}
    >
      <img className="blob history-blob" src="/CalculatorJs/svg/blob3.svg" alt="Blob" />
      <ul>
        {history.map((elem, i) => (
          <li key={i} onClick={() => onHistoryClicked(i)}>
            <p className="result">
              {elem}
            </p>
            <p className="index">
              ({i + 1})
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default History;