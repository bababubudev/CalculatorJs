import { FormEvent, useEffect, useState } from "react";
import History from "../components/History";
import type { ComparisonObject } from "../evaluator";
import evaluateExpression from "../evaluator";
import CalculationForm from "../components/CalculationForm";
import { IoIosArrowDown } from "react-icons/io";
import {
  CgMathDivide, CgMathEqual,
  CgClose, CgMathPlus,
  CgMathMinus, CgBackspace,
  CgCornerDownLeft
} from "react-icons/cg";

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
    <div className="calculator">
      <CalculationForm
        inputValue={inputValue}
        setInput={setInputValue}
        onSubmit={onCalculationSubmit}
        calculation={calculate()}
      />
      <div className={`hidables ${historyShown ? "history-shown" : ""}`}>
        <div className="keypad">
          <div className="row row1">
            <button type="button">7</button>
            <button type="button">8</button>
            <button type="button">9</button>
            <button type="button"><CgClose /></button>
            <button type="button"><CgMathDivide /></button>
          </div>
          <div className="row row2">
            <button type="button">4</button>
            <button type="button">5</button>
            <button type="button">6</button>
            <button type="button"><CgMathPlus /></button>
            <button type="button"><CgMathMinus /></button>
          </div>
          <div className="row row3">
            <button type="button">1</button>
            <button type="button">2</button>
            <button type="button">3</button>
            <button type="button"><CgMathEqual /></button>
            <button type="button"><CgBackspace /></button>
          </div>
          <div className="row row4">
            <button type="button">0</button>
            <button type="button">.</button>
            <button type="button">&lt;</button>
            <button type="button">&gt;</button>
            <button type="button"><CgCornerDownLeft /></button>
          </div>
        </div>
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