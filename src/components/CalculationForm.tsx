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
      <p className="show-input">
        {calculation}
      </p>
      <input
        type="text"
        className="input"
        value={inputValue}
        onChange={e => setInput(e.target.value)}
      />
      <button
        type="submit"
        className="submit-btn"
      >
        enter
      </button>
    </form>
  );
}

export default CalculationForm;