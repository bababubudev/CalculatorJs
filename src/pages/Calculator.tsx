import { useState } from "react";
import type { historyObject } from "../utils/types";
import CalculatorIO from "../components/CalculatorIO";
import History from "../components/History";
import { useOptions } from "../context/OptionsContext";
import useLocalStorage from "../hooks/useLocalStorage";

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