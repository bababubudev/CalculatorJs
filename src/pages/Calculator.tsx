import { useState } from "react";
import { useOptions } from "../context/OptionsContext";

import useLocalStorage from "../hooks/useLocalStorage";
import History from "../components/history/History";
import CalculatorIO from "../components/calculator/CalculatorIO";

import type { historyObject } from "../types/calculator";

function Calculator() {
  const [passedInput, setPassedInput] = useState<string>("");
  const [historyList, setHistoryList] = useLocalStorage<historyObject[]>("calculator-history", []);

  const { options, setOptions } = useOptions();

  const addToHistory = (info: historyObject) => {
    setHistoryList(prev => [...prev, info]);
  };

  const removeFromHistory = (key: string) => {
    setHistoryList(prev => prev.filter(elem => elem.key !== key));
  };

  const setCurrentInput = (key: string) => {
    const selectedItem = historyList.find(elem => elem.key === key);

    if (selectedItem) {
      setPassedInput(selectedItem.operation);
    }
  };

  const removePassedInput = () => {
    if (passedInput) {
      setPassedInput("");
    }
  };

  const ans = (index: number): string => {
    if (index < 1 || index >= historyList.length + 1) return "0";
    return historyList[historyList.length - index].result;
  };

  return (
    <div className={`calculator${options.showKeypad ? "" : " padded"}`}>
      <History
        history={historyList}
        removeFromHistory={removeFromHistory}
        onHistoryClicked={setCurrentInput}
      />
      <CalculatorIO
        passedInput={passedInput}
        options={options}
        setOptions={setOptions}
        askForAnswer={ans}
        addToHistory={addToHistory}
        removePassedInput={removePassedInput}
      />
    </div>
  );
}

export default Calculator;