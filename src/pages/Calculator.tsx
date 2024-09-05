import { useState } from "react";
import type { historyObject } from "../utils/types";
import CalculatorIO from "../components/CalculatorIO";
import History from "../components/History";
import { useOptions } from "../context/OptionsContext";

function Calculator() {
  const [history, setHistory] = useState<historyObject[]>([]);
  const { options } = useOptions();

  const addToHistory = (info: historyObject) => {
    setHistory(prev => [...prev, info]);
  }

  const removeFromHistory = (key: string) => {
    setHistory(prev => prev.filter(elem => elem.key !== key));
  }

  return (
    <div className="calculator">
      <History
        history={history}
        removeFromHistory={removeFromHistory}
        clearHistory={() => { setHistory([]); }}
      />
      <CalculatorIO
        option={options}
        needsRounding={history[history.length - 1]?.needsRounding ?? false}
        addToHistory={addToHistory}
      />
    </div>
  );
}

export default Calculator;