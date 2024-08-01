import { useEffect, useState } from "react";
import type { calculation } from "../utils/UtilityFuncitons";
import CalculatorIO from "../components/CalculatorIO";
// import History from "../components/History";
// import { IoIosArrowDown } from "react-icons/io";


function Calculator() {
  const [history, setHistory] = useState<calculation[]>([]);
  const [historyShown, setHistoryShown] = useState<boolean>(true);
  const [currentCalculation, setCurrentCalculation] = useState<calculation | null>(null);

  useEffect(() => {
    if (history.length > 0) {
      setHistoryShown(true);
      return;
    }

    setHistoryShown(false);
  }, [history]);

  const addToHistory = (element: calculation) => {
    setCurrentCalculation(element);
    setHistory(prev => [...prev, element]);
  }

  // const toggleHistoryShown = (): void => {
  //   if (!historyShown) setHistoryShown(prev => !prev);
  // }

  // const removeFromHistory = (index: number) => {
  //   setHistory(prev => prev.filter((_, ind) => ind !== index))
  // }

  // const clearHistory = () => {
  //   setHistory([]);
  // }
  //! Fix after styling changes

  return (
    <div className="calculator">
      <div
        className={`hidables ${historyShown ? "history-shown" : ""} `}
      >
        <div className="history-control">
          {
            /* <History
              history={history}
              removeFromHistory={removeFromHistory}
              clearHistory={clearHistory}
              toggleHistoryShown={toggleHistoryShown}
            />
            <button
              type="button"
              onClick={() => setHistoryShown(prev => !prev)}
              className="show-hide-btn"
            >
              <IoIosArrowDown />
            </button> */
            //! Fix after styling changes
          }
        </div>
      </div>
      <CalculatorIO
        addToHistory={addToHistory}
        previousOutput={currentCalculation}
      />
    </div>
  );
}

export default Calculator;