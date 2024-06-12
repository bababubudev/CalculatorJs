import { FormEvent } from "react";
import Keypad from "./Keypad";

type calculation = {
  operation: string;
  result: string;
}

interface CalculationFormProp {
  inputValue: string;
  calculation: calculation;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  history: calculation[];
  onSubmit: (event?: FormEvent<HTMLFormElement>) => void;
}

function CalculationForm(prop: CalculationFormProp) {
  const { onSubmit, inputValue, setInput, history, calculation } = prop;

  const keypadKeyClear = () => {
    setInput((prev: string) => prev.slice(0, -1));
  }

  const keypadKeydown = (value: string): void => {
    if (value === "=") {
      setInput(calculation.result);
      return;
    }

    setInput(prev => prev + value);
  }

  const prevAnswer = () => {
    if (history.length === 0) return;
    const currentResult: string = history[history.length - 1].result;
    setInput(prev => prev + currentResult);
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentInput = e.target.value;
    if (currentInput === "ans") {
      setInput("");
      prevAnswer();
      return;
    }

    setInput(currentInput);
  }

  return (
    <form
      className="userinput"
      onSubmit={onSubmit}
    >
      <div className="input-output">
        <p className="show-input">
          {calculation.result}
        </p>
        <input
          type="text"
          className="input"
          value={inputValue}
          onChange={onInputChange}
          autoFocus
        />
      </div>

      <Keypad
        onKeyPressed={keypadKeydown}
        onKeySubmit={onSubmit}
        onKeyClear={keypadKeyClear}
        onRequestPrevAns={prevAnswer}
      />
    </form >
  );
}

export default CalculationForm;