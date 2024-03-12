import { FormEvent, useState } from "react";
import History from "./components/History";
import type { ComparisonObject } from "./evaluator";
import evaluateExpression from "./evaluator";
import CalculationForm from "./components/CalculationForm";

function Calculator() {
  const [history, setHistory] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const addToHistory = (element: string) => {
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

    addToHistory(calculate());
  }

  function calculate(): string {
    const output: [string[], number] | ComparisonObject = evaluateExpression(inputValue);

    if ("comparison" in output) {
      const { comparison, comparator, leftResult, rightResult }: ComparisonObject = output;
      return `${leftResult} ${comparison ? comparator : "!" + comparator} ${rightResult} (${comparison})`;
    }

    const [tokenized, result] = output;
    tokenized.map(elem => elem === "*" ? elem = "·" : elem);

    return `${tokenized.join(" ")}${isNaN(result) ? "" : " = " + result}`;
  }

  return (
    <>
      <History
        history={history}
        removeFromHistory={removeFromHistory}
        clearHistory={clearHistory}
      />
      <CalculationForm
        inputValue={inputValue}
        setInput={setInputValue}
        onSubmit={onCalculationSubmit}
        calculation={calculate()}
      />
    </>
  );
}

export default Calculator;