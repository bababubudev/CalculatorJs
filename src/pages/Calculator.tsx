import { useEffect, useState } from "react";
import type { calculationInfo } from "../utils/UtilityFuncitons";
import CalculatorIO from "../components/CalculatorIO";
import History from "../components/History";
import { IoIosArrowDown } from "react-icons/io";


function Calculator() {
  const [history, setHistory] = useState<calculationInfo[]>([]);
  const [historyShown, setHistoryShown] = useState<boolean>(true);

  useEffect(() => {
    if (history.length > 0) {
      setHistoryShown(true);
      return;
    }

    setHistoryShown(false);
  }, [history]);

  const addToHistory = (info: calculationInfo) => {
    info.key = history.length;
    setHistory(prev => [...prev, info]);
  }

  const toggleHistoryShown = (): void => {
    if (!historyShown) setHistoryShown(prev => !prev);
  }

  const removeFromHistory = (index: number) => {
    setHistory(prev => prev.filter((_, ind) => ind !== index))
  }

  const clearHistory = () => {
    setHistory([]);
  }
  //! Fix after styling changes

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
            <IoIosArrowDown />
          </button>
        </div>
      </div>
      <CalculatorIO
        needsRounding={history[history.length - 1]?.needsRounding ?? false}
        addToHistory={addToHistory}
      />
    </div>
  );
}

export default Calculator;