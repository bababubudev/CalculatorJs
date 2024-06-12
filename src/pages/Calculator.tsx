import { FormEvent, useEffect, useState } from "react";
import History from "../components/History";
import evaluateExpression from "../evaluator";
import CalculationForm from "../components/CalculationForm";
import { IoIosArrowDown } from "react-icons/io";

type calculation = {
  operation: string;
  result: string;
}

function Calculator() {
  const [history, setHistory] = useState<calculation[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [historyShown, setHistoryShown] = useState<boolean>(true);
  let currentResult: calculation;

  useEffect(() => {
    if (history.length > 0) {
      setHistoryShown(true);
      return;
    }

    setHistoryShown(false);
  }, [history]);

  const addToHistory = (element: calculation) => {
    setHistory(prev => [...prev, element]);
  }

  const removeFromHistory = (index: number) => {
    setHistory(prev => prev.filter((_, ind) => ind !== index))
  }

  const clearHistory = () => {
    setHistory([]);
  }

  const onCalculationSubmit = (event?: FormEvent<HTMLFormElement>): void => {
    event?.preventDefault();
    if (!currentResult) return;

    if (currentResult.result !== "") {
      addToHistory(currentResult);
    }
  }

  const calculate = (): calculation => {
    let output: number = 0;

    try {
      output = evaluateExpression(inputValue);

      currentResult = {
        operation: inputValue,
        result: output === undefined ? "" : output.toString()
      }

      return currentResult;
    } catch (error) {
      return { operation: inputValue, result: (error as Error).message };
    }
  }

  const toggleHistoryShown = (): void => {
    if (!historyShown) setHistoryShown(prev => !prev);
  }

  return (
    <div className="calculator">
      <CalculationForm
        inputValue={inputValue}
        setInput={setInputValue}
        onSubmit={onCalculationSubmit}
        history={history}
        calculation={calculate()}
      />
      <div className={`hidables ${historyShown ? "history-shown" : ""} `}>
        <div className="history-control">
          <History
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
          </button>
        </div>
      </div>
    </div>
  );
}

export default Calculator;