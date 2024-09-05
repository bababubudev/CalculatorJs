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
  theme?: string,
  clearHistory?: () => void;
}

export enum functionKeys {
  sin = "sin",
  cos = "cos",
  tan = "tan",
  asin = "asin",
  acos = "acos",
  atan = "atan",
  sqrt = "sqrt",
  log = "log",
  lg = "lg",
  ln = "ln",
  abs = "abs",
  factorial = "!",
  factorialLong = "factorial",
}

export type inputInfo = {
  input: string,
  angleUnit: angleUnit
}

export type calculationInfo = {
  operation: string,
  result: string,
  angleUnit?: angleUnit,
}

export type historyObject = calculationInfo & {
  key: string,
  needsRounding?: boolean,
  currentCalculation?: calculationInfo,
}