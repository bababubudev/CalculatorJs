import { useState } from "react";
import type { historyObject } from "../utils/types";
import CalculatorIO from "../components/CalculatorIO";
import History from "../components/History";
import { useOptions } from "../context/OptionsContext";

function Calculator() {
  const [passedInput, setPassedInput] = useState<string>("");
  const [historyList, setHistoryList] = useState<historyObject[]>([]);

  const { options } = useOptions();

  const addToHistory = (info: historyObject) => {
    setHistoryList(prev => [...prev, info]);
  }

  const removeFromHistory = (key: string) => {
    setHistoryList(prev => prev.filter(elem => elem.key !== key));
  }

  const setCurrentInput = (key: string) => {
    const selectedItem = historyList.find(elem => elem.key === key);

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

  const ans = (index: number): number => {
    if (index < 1 || index >= historyList.length + 1) return NaN;
    return Number(historyList[historyList.length - index].result);
  }

  return (
    <div className="calculator">
      <History
        history={historyList}
        removeFromHistory={removeFromHistory}
        onHistoryClicked={setCurrentInput}
      />
      <CalculatorIO
        passedInput={passedInput}
        options={options}
        askForAnswer={ans}
        addToHistory={addToHistory}
        removePassedInput={removePassedInput}
      />
    </div>
  );
}

export default Calculator;