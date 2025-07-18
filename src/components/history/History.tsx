import { useEffect, useRef, useState } from "react";
import HistoryList from "./HistoryList";

import type { historyObject } from "../../types/calculator";

interface HistoryProp {
  history: historyObject[];
  removeFromHistory: (key: string) => void;
  onHistoryClicked: (key: string) => void;
}

function History({ history, removeFromHistory, onHistoryClicked }: HistoryProp) {
  const [historyShown, setHistoryShown] = useState<boolean>(false);

  const previousLength = useRef(history.length);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (history.length > previousLength.current) {
      setHistoryShown(true);

      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }

      hideTimeout.current = setTimeout(() => {
        setHistoryShown(false);
      }, 5000);
    }

    previousLength.current = history.length;
  }, [history]);

  const toggleHistoryShown = (): void => {
    if (!historyShown) setHistoryShown(prev => !prev);

    if (!historyShown && hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
  }

  return (
    <div className={`hidables ${historyShown ? "shown" : "hidden"}`}>
      <HistoryList
        history={history}
        removeFromHistory={removeFromHistory}
        toggleHistoryShown={toggleHistoryShown}
        onHistoryClicked={onHistoryClicked}
      />
      <button
        className="show-hide-btn"
        type="button"
        onClick={() => setHistoryShown(prev => !prev)}
      >
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="outer-circle"
            d="M11.998 2.5A9.503 9.503 0 0 0 3.378 8H5.75a.75.75 0 0 1 0 1.5H2a1 1 0 0 1-1-1V4.75a.75.75 0 0 1 1.5 0v1.697A10.997 10.997 0 0 1 11.998 1C18.074 1 23 5.925 23 12s-4.926 11-11.002 11C6.014 23 1.146 18.223 1 12.275a.75.75 0 0 1 1.5-.037 9.5 9.5 0 0 0 9.498 9.262c5.248 0 9.502-4.253 9.502-9.5s-4.254-9.5-9.502-9.5Z"
          >
          </path>
          <path
            className="clock-hands"
            d="M12.5 7.25a.75.75 0 0 0-1.5 0v5.5c0 .27.144.518.378.651l3.5 2a.75.75 0 0 0 .744-1.302L12.5 12.315V7.25Z"
          >
          </path>
        </svg>
      </button>
    </div>
  );
}

export default History;