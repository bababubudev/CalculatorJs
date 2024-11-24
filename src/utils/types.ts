export type angleUnit = "degree" | "radian" | "gradian";

export type variableType = { [key: string]: number };

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
  displayAs: string,
  pasteAs: string,
  description: string,
}

export type inputInfo = {
  input: string,
  angleUnit?: angleUnit
}

export type calculationInfo = {
  operation: string,
  result: string,
  currentRPN?: string[],
  angleUnit?: angleUnit,
}

export type historyObject = calculationInfo & {
  key: string,
  displayOperation?: string,
  needsRounding?: boolean,
}