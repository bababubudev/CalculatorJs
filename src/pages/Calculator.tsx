import { useState } from "react";
import type { historyObject } from "../utils/types";
import CalculatorIO from "../components/CalculatorIO";
import History from "../components/History";
import { useOptions } from "../context/OptionsContext";

function Calculator() {
  const [passedInput, setPassedInput] = useState<string>("");
  const [history, setHistory] = useState<historyObject[]>([]);

  const { options } = useOptions();

  const addToHistory = (info: historyObject) => {
    setHistory(prev => [...prev, info]);
  }

  const removeFromHistory = (key: string) => {
    setHistory(prev => prev.filter(elem => elem.key !== key));
  }

  const setCurrentInput = (key: string) => {
    const selectedItem = history.find(elem => elem.key === key);

    if (selectedItem) {
      setPassedInput("");
      setTimeout(() => setPassedInput(selectedItem.operation), 0);
    }
  }

  const removePassedInput = () => {
    if (passedInput) {
      setPassedInput("");
    }
  }

  return (
    <div className="calculator">
      <History
        history={history}
        removeFromHistory={removeFromHistory}
        onHistoryClicked={setCurrentInput}
      />
      <CalculatorIO
        passedInput={passedInput}
        options={options}
        addToHistory={addToHistory}
        removePassedInput={removePassedInput}
      />
    </div>
  );
}

export default Calculator;