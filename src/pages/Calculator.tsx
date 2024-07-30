import { FormEvent, useEffect, useRef, useState } from "react";
// import History from "../components/History";
import evaluateExpression, { mathFunctions } from "../evaluator";
// import { IoIosArrowDown } from "react-icons/io";

type calculation = {
  operation: string;
  result: string;
}

function Calculator() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState<string>("");
  const [topDisplay, setTopDisplay] = useState<string>("");
  const [funcitonPreview, setFunctionPreview] = useState<string[]>([]);
  const [currentCalculation, setCurrentCalculation] = useState<calculation | null>(null);

  const [history, setHistory] = useState<calculation[]>([]);
  const [historyShown, setHistoryShown] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const roundNumbers = (num: number, precision: number = 5) => {
    const multiplier = Math.pow(10, precision);
    const roundedNum = Math.round(num * multiplier) / multiplier;

    return {
      requires: num !== roundedNum,
      rounded: num.toFixed(precision),
    };
  }

  const calculate = (input: string): calculation => {
    let output: number = 0;

    try {
      output = evaluateExpression(input);

      const modifiedResult = output === undefined ? "" : output.toString();

      return {
        operation: input,
        result: modifiedResult,
      }
    } catch (error) {
      return { operation: input, result: (error as Error).message };
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const validKeys = /^[a-zA-Z0-9+\-*/.=]$/;
      if (validKeys.test(event.key) && inputRef.current) {
        inputRef.current.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      setHistoryShown(true);
      return;
    }

    setHistoryShown(false);
  }, [history]);

  const addToHistory = (element: calculation) => {
    setHistory(prev => [...prev, element]);
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;
    setInputValue(currentValue);
    setIsSubmitted(false);

    const functionMatch = currentValue.match(/([a-z]+)\(?$/i);

    if (functionMatch) {
      const partialFunciton = functionMatch[1];
      const possibleFunction = Object.keys(mathFunctions).filter(func => func.startsWith(partialFunciton));

      if (possibleFunction.length > 0) {
        setFunctionPreview(possibleFunction.map(func => `${func}(x)`));
      } else {
        setFunctionPreview([]);
      }
    } else {
      setFunctionPreview([]);
    }

    const output = calculate(currentValue);
    if (output.result !== "") {
      setTopDisplay(output.result);
    } else {
      setTopDisplay("");
    }
  }

  const onCalculationSubmit = (event?: FormEvent<HTMLFormElement>): void => {
    event?.preventDefault();

    const output = calculate(inputValue);
    const roundedResult = roundNumbers(Number(output.result))

    const displayResult = roundedResult.requires
      ? roundedResult.rounded
      : output.result

    if (output.result !== "") {
      addToHistory(output);
      setCurrentCalculation(output);
      setTopDisplay(output.operation);
      setInputValue(displayResult);
      setIsSubmitted(true);
    }
  }

  // const toggleHistoryShown = (): void => {
  //   if (!historyShown) setHistoryShown(prev => !prev);
  // }

  // const removeFromHistory = (index: number) => {
  //   setHistory(prev => prev.filter((_, ind) => ind !== index))
  // }

  // const clearHistory = () => {
  //   setHistory([]);
  // }
  //! Fix after styling changes

  console.log(funcitonPreview);

  return (
    <div className="calculator">
      <div
        className={`hidables ${historyShown ? "history-shown" : ""} `}
      >
        <div className="history-control">
          {
            /* <History
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
            </button> */
            //! Fix after styling changes
          }
        </div>
      </div>

      <form
        className={`calculation-display ${isSubmitted ? "submitted" : ""}`}
        onSubmit={onCalculationSubmit}
      >
        <div className="display">
          <p className="top-display">
            {topDisplay}
          </p>
          <div className="interaction">
            {isSubmitted &&
              <p
                className="submit-text"
              >
                {roundNumbers(Number(currentCalculation?.result)).requires ? "≈" : "="}
              </p>
            }
            <input
              type="text"
              className="bottom-display"
              ref={inputRef}
              value={inputValue}
              onChange={onInputChange}
              autoFocus
            />
          </div>
        </div>
        <button className="submit-btn">=</button>
      </form>
    </div>
  );
}

export default Calculator;