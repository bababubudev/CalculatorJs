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
  displayAs: string,
  pasteAs: string,
  description: string,
}

export const functionKeys: Record<string, functionValue> = {
  "sin": { 
    displayAs: "sin(n)",
    pasteAs: "sin(", 
    description: "Sine of an angle" 
  },
  "cos": { 
    displayAs: "cos(n)",
    pasteAs: "cos(", 
    description: "Cosine of an angle" 
  },
  "tan": { 
    displayAs: "tan(n)",
    pasteAs: "tan(", 
    description: "Tangent of an angle" 
  },
  "asin": {
    displayAs: "asin(n)",
    pasteAs: "asin(", 
    description: "Inverse sine of a value (arcsin) in degrees" 
  },
  "acos": {
    displayAs: "acos(n)",
    pasteAs: "acos(", 
    description: "Inverse cosine of a value (arccos) in degrees" 
  },
  "atan": {
    displayAs: "atan(n)",
    pasteAs: "atan(", 
    description: "Inverse tangent of a value (arctan) in degrees" 
  },

  "sqrt": {
    displayAs: "sqrt(n)",
    pasteAs: "sqrt(", 
    description: "Square root of a value" 
  },
  "cbrt": {
    displayAs: "cbrt(n)",
    pasteAs: "cbrt(", 
    description: "Cube root of a value" 
  },
  "lg": { 
    displayAs: "lg(n)",
    pasteAs: "lg(", 
    description: "Logarithm to base 10 of a number" 
  },
  "ln": { 
    displayAs: "ln(n)",
    pasteAs: "ln(", 
    description: "Natural logarithm of a number" 
  },
  "abs": { 
    displayAs: "abs(n)",
    pasteAs: "abs(", 
    description: "Absolute value of a number" 
  },
  
  "ans": { 
    displayAs: "ans(1 - n)",
    pasteAs: "ans(", 
    description: "Returns answer from history with a given number" 
  },
  "fact": {
    displayAs: "fact(1 - n)",
    pasteAs: "fact(", 
    description: "Factorial of a number" 
  },
  "add": { 
    displayAs: "add(m, n, o...)",
    pasteAs: "add(", 
    description: "Adds all the given numbers together" 
  },
  "high": {
    displayAs: "high(m, n, o...)",
    pasteAs: "high(", 
    description: "Returns the largest value among the given numbers" 
  },
  "root": {
    displayAs: "root(m, n)",
    pasteAs: "root(", 
    description: "Calculates the nth root of a number (ex. root(8, 3) = 2)" 
  },
  "log": { 
    displayAs: "log(m, n)",
    pasteAs: "log(", 
    description: "Calculates the log with a specified base (ex. log(2, 8) = 3)" 
  },
  
  "pi": { 
    displayAs: "pi",
    pasteAs: "π", 
    description: "Represents the mathematical constant π" 
  },
  "phi": { 
    displayAs: "phi",
    pasteAs: "ϕ", 
    description: "Represents the golden ratio ϕ" 
  },
  "e": { 
    displayAs: "e",
    pasteAs: "e", 
    description: "Represents the Euler's number e" 
  },
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