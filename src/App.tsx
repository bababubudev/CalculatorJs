import { FormEvent, useRef, useState } from "react"
import evaluateExpression from "./evaluator";

function App() {
  const inputShowRef = useRef<HTMLParagraphElement>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);

  function onCalculationSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!inputShowRef.current) return;

    console.log(inputShowRef.current.textContent);
    const currentResult = `${inputValue} = ${inputShowRef.current.textContent}`;

    if (currentResult == null || inputShowRef.current.textContent === "NaN") return;

    setHistory(prev => [...prev, currentResult]);
  }

  return (
    <main>
      <ul
        className="history-div"
        style={{ fontWeight: "bolder" }}
      >
        {history.map((elem, i) => (
          <li key={i}>
            <button onClick={() => setHistory(prev => prev.filter((_, ind) => ind !== i))}>
              {elem}
            </button>
          </li>
        ))}
        <button
          type="button"
          onClick={() => setHistory([])}
        >
          clear history
        </button>
      </ul>
      <form
        className="userinput"
        onSubmit={onCalculationSubmit}
      >
        <p
          className="show-input"
          ref={inputShowRef}
          style={{ height: "1rem" }}
        >
          {evaluateExpression(inputValue)}
        </p>
        <input
          type="text"
          className="input"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
        <button
          type="submit"
          className="submit-btn"
        >
          enter
        </button>
      </form>
    </main>
  )
}

export default App
