import { createContext, useContext } from "react";
import { optionObject } from "../utils/types";

interface OptionContextType {
  options: optionObject;
  setOptions: (changes: Partial<optionObject>) => void;
}

export const OptionsContext = createContext<OptionContextType | undefined>(undefined);

export const useOptions = () => {
  const context = useContext(OptionsContext);
  if (!context) { throw new Error("useOption must be used within an OptionsProvider"); }

  return context;
}