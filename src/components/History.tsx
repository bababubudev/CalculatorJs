interface HistoryProp {
  history: string[];
  removeFromHistory: (index: number) => void;
  clearHistory: () => void;
}

function History({ history, removeFromHistory, clearHistory }: HistoryProp) {
  const onHistoryClicked = (index: number): void => {
    navigator.clipboard.writeText(history[index]);
    removeFromHistory(index);
  }

  return (
    <section className="history-div">
      <ul>
        <button
          type="button"
          onClick={clearHistory}
        >
          clear history
        </button>
        {history.map((elem, i) => (
          <li key={i}>
            <div onClick={() => onHistoryClicked(i)}>
              {elem}
            </div>
            <p>({i + 1})</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default History;