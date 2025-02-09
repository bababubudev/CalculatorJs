import { OptionsContext } from "./OptionsContext";
import { optionObject } from "../utils/types";
import useLocalStorage from "../hooks/useLocalStorage";

interface OptionsProviderProps {
  children: React.ReactNode;
}

function OptionsProvider({ children }: OptionsProviderProps) {
  const [options, setOptions] = useLocalStorage<optionObject>("calculator-options", {
    angleUnit: "degree",
    precision: 5,
    theme: "default",
    showKeypad: true
  });

  const handleSetOptions = (changes: Partial<optionObject>) => {
    setOptions((prevOptions: optionObject) => {
      const newOptions = { ...prevOptions, ...changes };
      localStorage.setItem("options", JSON.stringify(newOptions));
      return newOptions;
    });
  };

  return (
    <OptionsContext.Provider value={{ options, setOptions: handleSetOptions }}>
      {children}
    </OptionsContext.Provider>
  )
}

export default OptionsProvider;