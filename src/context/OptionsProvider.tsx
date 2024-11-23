import { useState } from "react";
import { OptionsContext } from "./OptionsContext";
import { optionObject } from "../utils/types";

interface OptionsProviderProps {
  children: React.ReactNode;
}

function OptionsProvider({ children }: OptionsProviderProps) {
  const [options, setOptions] = useState<optionObject>(() => {
    const savedOptions = localStorage.getItem("options");

    return savedOptions ? JSON.parse(savedOptions) : {
      angleUnit: "degree",
      precision: 5,
      theme: "dark",
    };
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