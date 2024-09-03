export type calculation = {
  operation: string;
  result: string;
}

export type calculationInfo = calculation & {
  key: string,
  needsRounding?: boolean,
  currentCalculation?: calculation,
}

export type AngleUnit = "degree" | "radian" | "gradian";

export type suggestionInfo = {
  attemptString: string,
  suggestions: string[],
  suggestionUsed?: boolean,
}

export type ComparisonObject = {
  comparison: boolean,
  leftInput: string[],
  rightInput: string[],
  leftResult: string,
  rightResult: string,
  comparator: string
}

export type FunctionKeys = "sin" | "cos" | "tan" |
  "asin" | "acos" | "atan" |
  "sqrt" | "log" | "lg" | "ln" |
  "abs" | "!" | "factorial";