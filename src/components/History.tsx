interface HistoryProp {
  history: string[];
  removeFromHistory: (index: number) => void;
  clearHistory: () => void;
}

function History({ history, removeFromHistory, clearHistory }: HistoryProp) {
  const onHistoryClicked = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number): void => {
    navigator.clipboard.writeText(history[index]);
    removeFromHistory(index);
  }

  return (
    <ul
      className="history-div"
      style={{ fontWeight: "bolder" }}
    >
      {history.map((elem, i) => (
        <li key={i}>
          <button onClick={(e) => onHistoryClicked(e, i)}>
            {elem}
          </button>
        </li>
      ))}
      <button
        type="button"
        onClick={clearHistory}
      >
        clear history
      </button>
    </ul>
  );
}

export default History;