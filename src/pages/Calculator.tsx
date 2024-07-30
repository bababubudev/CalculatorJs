import { FormEvent, useEffect, useRef, useState } from "react";
import {
  type calculation,
  calculate,
  roundNumbers,
  suggestMathFunctions,
  autoCompleteBrackets,
} from "../utils/UtilityFuncitons";
// import History from "../components/History";
// import { IoIosArrowDown } from "react-icons/io";


function Calculator() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState<string>("");
  const [topDisplay, setTopDisplay] = useState<string>("");
  const [currentCalculation, setCurrentCalculation] = useState<calculation | null>(null);

  const [bracketPreview, setBracketPreview] = useState<string>("");
  const [funcitonPreview, setFunctionPreview] = useState<string[]>([]);
  const [history, setHistory] = useState<calculation[]>([]);
  const [historyShown, setHistoryShown] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  console.log(bracketPreview);

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
    const output = calculate(currentValue);
    const possibleFunctions = suggestMathFunctions(currentValue);
    const updatedValue = autoCompleteBrackets(currentValue);

    setInputValue(currentValue);
    setIsSubmitted(false);
    setBracketPreview(updatedValue);

    possibleFunctions.length > 0
      ? setFunctionPreview(possibleFunctions.map(func => `${func}(x)`))
      : setFunctionPreview([]);

    // const openParens = (currentValue.match(/\(/g) || []).length;
    // const closeParens = (currentValue.match(/\)/g) || []).length;

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
      setTopDisplay(bracketPreview);
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
            {isSubmitted && <p className="submit-text">
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
            {!isSubmitted && <div
              className="bracket-preview"
            >
              {bracketPreview}
            </div>}
          </div>
        </div>
        <button className="submit-btn">=</button>
      </form>
    </div>
  );
}

export default Calculator;