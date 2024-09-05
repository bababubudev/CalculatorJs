import { useEffect, useState } from "react";
import type { historyObject } from "../utils/types";
import CalculatorIO from "../components/CalculatorIO";
import History from "../components/History";
import { useOptions } from "../context/OptionsContext";

function Calculator() {
  const [history, setHistory] = useState<historyObject[]>([]);
  const [historyShown, setHistoryShown] = useState<boolean>(true);
  const { options } = useOptions();

  useEffect(() => {
    if (history.length > 0) {
      setHistoryShown(true);
      return;
    }

    setHistoryShown(false);
  }, [history]);

  const addToHistory = (info: historyObject) => {
    setHistory(prev => [...prev, info]);
  }

  const toggleHistoryShown = (): void => {
    if (!historyShown) setHistoryShown(prev => !prev);
  }

  const removeFromHistory = (key: string) => {
    setHistory(prev => prev.filter(elem => elem.key !== key));
  }

  const clearHistory = () => {
    setHistory([]);
  }

  return (
    <div className="calculator">
      <div
        className={`hidables ${historyShown ? "shown" : "hidden"}`}
      >
        <div className="history-control">
          <History
            history={history}
            removeFromHistory={removeFromHistory}
            clearHistory={clearHistory}
            toggleHistoryShown={toggleHistoryShown}
          />
        </div>
        <div className="show-hide-btn">
          <button
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
      </div>
      <CalculatorIO
        option={options}
        needsRounding={history[history.length - 1]?.needsRounding ?? false}
        addToHistory={addToHistory}
      />
    </div>
  );
}

export default Calculator;