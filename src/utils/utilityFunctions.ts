import evaluateExpression, {
  mathFunctions,
  setAngleUnit,
  getAngleUnit
} from "./evaluator";
import type { angleUnit, calculationInfo, suggestionObject } from "./types";

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

export function excludeRight(str: string, character: string) {
  const lastIndex = str.lastIndexOf(character);
  return lastIndex === -1 ? str : str.substring(0, lastIndex + 1);
}

export function suggestMathFunctions(input: string): suggestionObject {
  const functionMatch = input.match(/([a-z]+)\(?$/i);

  if (functionMatch) {
    const partialFunciton = functionMatch[1];
    const regex = new RegExp(partialFunciton, "i");

    return {
      attemptString: partialFunciton,
      suggestions: Object.keys(mathFunctions).filter(func => regex.test(func)),
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
  let output: number = 0;

  try {
    setAngleUnit(angleUnit);
    output = evaluateExpression(input);

    const modifiedResult = output === undefined ? "" : output.toString();

    return {
      operation: input,
      result: modifiedResult,
      angleUnit: getAngleUnit()
    }
  } catch (error) {
    return { operation: input, result: (error as Error).message };
  }
}