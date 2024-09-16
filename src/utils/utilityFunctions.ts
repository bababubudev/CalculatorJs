import evaluateExpression, { getAngleUnit, setAngleUnit } from "./evaluator";
import { angleUnit, calculationInfo, functionKeys, suggestionObject } from "./types";

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
  const functionMatch = input.match(/([a-z]+)\(?$/i);

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