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
    description: "Inverse sine of a value (arc sine)" 
  },
  "acos": {
    displayAs: "acos(n)",
    pasteAs: "acos(", 
    description: "Inverse cosine of a value (arc cosine)" 
  },
  "atan": {
    displayAs: "atan(n)",
    pasteAs: "atan(", 
    description: "Inverse tangent of a value (arc tangent)" 
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
    displayAs: "ans(n)",
    pasteAs: "ans(", 
    description: "Returns answer from history with a given number" 
  },
  "fact": {
    displayAs: "fact(n)",
    pasteAs: "fact(", 
    description: "Factorial of a number" 
  },
  "add": { 
    displayAs: "add(n₁, n₂, ...)",
    pasteAs: "add(", 
    description: "Adds all the 'n' numbers together" 
  },
  "high": {
    displayAs: "high(n₁, n₂, ...)",
    pasteAs: "high(", 
    description: "Returns the largest value among the 'n' numbers" 
  },
  "root": {
    displayAs: "root(m, n)",
    pasteAs: "root(", 
    description: "Calculates the 'n:th' root of number 'm' (ex. root(8, 3) = 2)" 
  },
  "log": { 
    displayAs: "log(m, n)",
    pasteAs: "log(", 
    description: "Calculates the log 'n' with a base 'm' (ex. log(2, 8) = 3)" 
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
  "infinity": {
    displayAs: "∞",
    pasteAs: "∞",
    description: "Represents the concept of infinity"
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