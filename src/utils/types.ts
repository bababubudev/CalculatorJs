export type angleUnit = "degree" | "radian" | "gradian";

export type suggestionObject = {
  attemptString: string,
  suggestions: string[],
  suggestionUsed?: boolean,
}

export type comparisonObject = {
  comparison: boolean,
  leftInput: string[],
  rightInput: string[],
  leftResult: string,
  rightResult: string,
  comparator: string
}

export type optionObject = {
  angleUnit?: angleUnit,
  precision?: number,
  theme?: "light" | "dark" | "default",
}

export const functionKeys: Record<string, string> = {
  "sin": "sin(",
  "cos": "cos(",
  "tan": "tan(",
  "asin": "asin(",
  "acos": "acos(",
  "atan": "atan(",
  "sqrt": "sqrt(",
  "log": "log(",
  "lg": "lg(",
  "ln": "ln(",
  "abs": "abs(",
  "ans": "ans(",
  "factorial": "factorial(",
  "PI": "π",
  "e": "e",
}

export type mathFunctions = ((x: number) => number) | number;

export type inputInfo = {
  input: string,
  angleUnit?: angleUnit
}

export type calculationInfo = {
  operation: string,
  result: string,
  angleUnit?: angleUnit,
}

export type historyObject = calculationInfo & {
  key: string,
  displayOperation?: string,
  needsRounding?: boolean,
}