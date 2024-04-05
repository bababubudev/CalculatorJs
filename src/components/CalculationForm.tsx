import { FormEvent } from "react";

interface CalculationFormProp {
  inputValue: string;
  calculation: string;
  setInput: (input: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function CalculationForm({ inputValue, setInput, calculation, onSubmit }: CalculationFormProp) {
  return (
    <form
      className="userinput"
      onSubmit={onSubmit}
    >
      <div className="input-output">
        <input
          type="text"
          className="input"
          value={inputValue}
          onChange={e => setInput(e.target.value)}
          autoFocus
        />
        <hr />
        <p className="show-input">
          {calculation}
        </p>
      </div>
    </form >
  );
}

export default CalculationForm;