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

export type functionValue = {
  pasteAs: string,
  description: string,
}

export const functionKeys: Record<string, functionValue> = {
  "sin": { pasteAs: "sin(", description: "" },
  "cos": { pasteAs: "cos(", description: "" },
  "tan": { pasteAs: "tan(", description: "" },
  "asin": { pasteAs: "asin(", description: "" },
  "acos": { pasteAs: "acos(", description: "" },
  "atan": { pasteAs: "atan(", description: "" },
  "sqrt": { pasteAs: "sqrt(", description: "" },
  "log": { pasteAs: "log(", description: "" },
  "lg": { pasteAs: "lg(", description: "" },
  "ln": { pasteAs: "ln(", description: "" },
  "abs": { pasteAs: "abs(", description: "" },
  "ans": { pasteAs: "ans(", description: "" },
  "fact": { pasteAs: "fact(", description: "" },
  "add": { pasteAs: "add(", description: "" },
  "largest": { pasteAs: "largest(", description: "" },
  "pi": { pasteAs: "π", description: "" },
  "e": { pasteAs: "e", description: "" },
}

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