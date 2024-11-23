import { useState } from "react";
import { OptionsContext } from "./OptionsContext";
import { optionObject } from "../utils/types";

interface OptionsProviderProps {
  children: React.ReactNode;
}

function OptionsProvider({ children }: OptionsProviderProps) {
  const [options, setOptions] = useState<optionObject>({
    angleUnit: "degree",
    precision: 5,
    theme: "default",
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