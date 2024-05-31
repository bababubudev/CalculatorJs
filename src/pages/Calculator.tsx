import { FormEvent, useEffect, useState } from "react";
import History from "../components/History";
import evaluateExpression from "../evaluator";
import CalculationForm from "../components/CalculationForm";
import { IoIosArrowDown } from "react-icons/io";
import Keypad from "../components/Keypad";

type history = {
  operation: string;
  result: string;
}

function Calculator() {
  const [history, setHistory] = useState<history[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [historyShown, setHistoryShown] = useState<boolean>(true);
  let historyResult: history;

  useEffect(() => {
    if (history.length > 0) {
      setHistoryShown(true);
      return;
    }

    setHistoryShown(false);
  }, [history]);

  const addToHistory = (element: history) => {
    setHistory(prev => [...prev, element]);
  }

  const removeFromHistory = (index: number) => {
    setHistory(prev => prev.filter((_, ind) => ind !== index))
  }

  const clearHistory = () => {
    setHistory([]);
  }

  const onCalculationSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!historyResult) return;

    if (historyResult.result !== "") {
      addToHistory(historyResult);
    }
  }

  const calculate = (): string => {
    let output: number = 0;

    try {
      output = evaluateExpression(inputValue);

      historyResult = {
        operation: inputValue,
        result: output ? output.toString() : ""
      }

      return historyResult ? historyResult.result : "";
    } catch (error) {
      console.log(error);
      return "Invalid input";
    }
  }

  const toggleHistoryShown = (): void => {
    if (!historyShown) setHistoryShown(prev => !prev);
  }

  const prevAnswer = () => {
    if (history.length === 0) return;
    const currentResult: string = history[history.length - 1].result;
    setInputValue(prev => prev + currentResult);
  }

  const keypadKeyClear = () => {
    setInputValue(prev => prev.slice(0, -1));
  }

  const keypadKeydown = (value: string): void => {
    setInputValue(prev => prev + value);
  }

  const keypadSubmit = (): void => {
    if (!historyResult || historyResult.result === "") return;
    addToHistory(historyResult);
  }

  return (
    <div className="calculator">
      <CalculationForm
        inputValue={inputValue}
        setInput={setInputValue}
        onSubmit={onCalculationSubmit}
        calculation={calculate()}
      />
      <Keypad
        onKeyPressed={keypadKeydown}
        onKeySubmit={keypadSubmit}
        onKeyClear={keypadKeyClear}
        onRequestPrevAns={prevAnswer}
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