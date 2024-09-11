import { useState } from "react";
import type { calculationInfo, historyObject } from "../utils/types";
import CalculatorIO from "../components/CalculatorIO";
import History from "../components/History";
import { useOptions } from "../context/OptionsContext";

function Calculator() {
  const [passedInput, setPassedInput] = useState<calculationInfo>({ operation: "", result: "" });
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
    console.log("call");

    if (selectedItem) {
      setPassedInput({ operation: "", result: "" });
      setTimeout(() => setPassedInput(selectedItem), 0);
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
        needsRounding={history[history.length - 1]?.needsRounding ?? false}
        passedInput={passedInput}
        options={options}
        addToHistory={addToHistory}
      />
    </div>
  );
}

export default Calculator;