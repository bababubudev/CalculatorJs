import { FormEvent, useState } from "react";
import History from "../components/History";
import type { ComparisonObject } from "../evaluator";
import evaluateExpression from "../evaluator";
import CalculationForm from "../components/CalculationForm";

function Calculator() {
  const [history, setHistory] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  let historyResult: string;

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
      return `${modified}${isNaN(result) || tokenized.length <= 1 ? "" : " = " + result}`;
    } catch (error) {
      return "Invalid input";
    }
  }


  return (
    <div className="calculator">
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
    </div>
  );
}

export default Calculator;