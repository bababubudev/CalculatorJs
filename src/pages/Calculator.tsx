import { FormEvent, useEffect, useState } from "react";
import History from "../components/History";
import type { ComparisonObject } from "../evaluator";
import evaluateExpression from "../evaluator";
import CalculationForm from "../components/CalculationForm";
import { IoIosArrowDown } from "react-icons/io";

function Calculator() {
  const [history, setHistory] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [historyShown, setHistoryShown] = useState<boolean>(false);
  let historyResult: string;

  useEffect(() => {
    if (history.length > 0) {
      setHistoryShown(true);
      return;
    }

    setHistoryShown(false);
  }, [history]);

  const addToHistory = (element: string | HTMLElement) => {
    setHistory(prev => [...prev, element as string]);
  }

  const removeFromHistory = (index: number) => {
    setHistory(prev => prev.filter((_, ind) => ind !== index))
  }

  const clearHistory = () => {
    setHistory([]);
  }

  const onCalculationSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (historyResult as string === "") return;
    addToHistory(historyResult as string);
  }

  const modifyOutput = (output: string[]) => {
    const comparators = new Set(["=", ">", "<"]);
    return output.map(elem => elem === "*" ? "·" : elem)
      .filter(elem => !comparators.has(elem))
      .join(" ");
  }

  const calculate = (): string => {
    let output: [string[], number] | ComparisonObject;

    try {
      output = evaluateExpression(inputValue);

      if ("comparison" in output) {
        const { comparison, comparator, leftInput, leftResult, rightInput }: ComparisonObject = output;
        const modifiedL = modifyOutput(leftInput);
        const modifiedR = modifyOutput(rightInput);

        historyResult = `${modifiedL} ${comparison ? comparator : "!" + comparator} ${modifiedR} (${comparison.toString().toUpperCase()})`;
        return `${leftResult} ${comparison ? comparator : "!" + comparator} ${modifiedR} (${comparison.toString().toUpperCase()})`;
      }

      const [tokenized, result] = output;
      const modified = modifyOutput(tokenized);

      historyResult = `${modified}${isNaN(result) ? "" : " = " + result}`;
      return `${isNaN(result) || tokenized.length <= 1 ? "" : " = " + result}`;
    } catch (error) {
      return "Invalid input";
    }
  }

  const toggleHistoryShown = (): void => {
    if (!historyShown) setHistoryShown(prev => !prev);
  }


  return (
    <div className={`calculator ${historyShown ? "history-shown" : ""}`}>
      <CalculationForm
        inputValue={inputValue}
        setInput={setInputValue}
        onSubmit={onCalculationSubmit}
        calculation={calculate()}
      />
      <History
        history={history}
        removeFromHistory={removeFromHistory}
        clearHistory={clearHistory}
        toggleHistoryShown={toggleHistoryShown}
      />
      <button
        type="button"
        onClick={() => setHistoryShown(prev => !prev)}
      >
        <IoIosArrowDown />
      </button>
    </div>
  );
}

export default Calculator;