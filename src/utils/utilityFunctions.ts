import { evaluateExpression, getAngleUnit, setAngleUnit } from "./evaluator";
import type { angleUnit, calculationInfo, functionValue, suggestionObject } from "./types.ts";

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
  "nCr": {
    displayAs: "nCr(n, r)",
    pasteAs: "nCr(",
    description: "Represents the combination formula used to calculate the number of ways to choose r items from n items where order does not matter"
  },
  "nPr": {
    displayAs: "nPr(n, r)",
    pasteAs: "nPr(",
    description: "Represents the permutation formula used to calculate the number of ways to arrange r items from n items where order matters"
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

const FILTER_KEYS = Object.keys(functionKeys).sort();

export function autoCompleteBrackets(input: string): string {
  let openBrackets = 0;
  let result = "";

  for (const char of input) {
    if (char === "(") {
      openBrackets++;
      result += char;
    }
    else if (char === ")") {
      if (openBrackets > 0) {
        openBrackets--;
      }

      result += char;
    }
    else {
      result += char;
    }
  }

  result += ")".repeat(openBrackets);

  return result;
}

export function suggestMathFunctions(input: string): suggestionObject {
  const functionMatch = input.toLowerCase().match(/([a-z]+)\(?$/i);

  if (functionMatch) {
    const partialFunciton = functionMatch[1];

    return {
      attemptString: partialFunciton,
      suggestions: FILTER_KEYS.filter(func => func.startsWith(partialFunciton)),
      suggestionUsed: false,
    };
  }
  else {
    return {
      attemptString: "",
      suggestions: [],
      suggestionUsed: false,
    };
  }
}

export function roundNumbers(num: number, precision: number = 5) {
  const multiplier = Math.pow(10, precision);
  const roundedNum = Math.round(num * multiplier) / multiplier;

  return {
    requires: num !== roundedNum,
    rounded: num.toFixed(precision),
  };
}

export function calculate(input: string, angleUnit?: angleUnit): calculationInfo {
  try {
    setAngleUnit(angleUnit);
    const expression = evaluateExpression(input);

    return {
      operation: input,
      result: input === "" ? "" : expression.toString(),
      angleUnit: getAngleUnit()
    }
  } catch (error) {
    return { operation: input, result: (error as Error).message };
  }
}