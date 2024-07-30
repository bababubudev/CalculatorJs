import { FormEvent, useEffect, useRef, useState } from "react";
// import History from "../components/History";
import evaluateExpression from "../evaluator";
// import { IoIosArrowDown } from "react-icons/io";

type calculation = {
  operation: string;
  result: string;
}

function Calculator() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [history, setHistory] = useState<calculation[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [topDisplay, setTopDisplay] = useState<string>("");
  const [historyShown, setHistoryShown] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const calculate = (input: string): calculation => {
    let output: number = 0;

    try {
      output = evaluateExpression(input);

      return {
        operation: input,
        result: output === undefined ? "" : output.toString()
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
    if (output.result !== "") {
      addToHistory(output);
      setTopDisplay(output.operation);
      setInputValue(output.result);
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
            {isSubmitted && <p className="submit-text">=</p>}
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