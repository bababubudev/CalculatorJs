import { useState } from "react";
import { OptionsContext } from "./OptionsContext";
import { optionObject } from "../utils/types";

interface OptionsProviderProps {
  children: React.ReactNode;
}

function OptionsProvider({ children }: OptionsProviderProps) {
  const [options, setOptions] = useState<optionObject>({
    angleUnit: "radian",
    precision: 5,
    theme: "default",
  });

  const handleSetOptions = (changes: Partial<optionObject>) => {
    setOptions((prevOptions: optionObject) => ({ ...prevOptions, ...changes }));
  };

  return (
    <OptionsContext.Provider value={{ options, setOptions: handleSetOptions }}>
      {children}
    </OptionsContext.Provider>
  )
}

export default OptionsProvider;