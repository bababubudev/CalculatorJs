import evaluateExpression, { mathFunctions } from "./evaluator";

export type calculation = {
  operation: string;
  result: string;
}

export type calculationInfo = calculation & {
  key: string,
  needsRounding?: boolean,
  currentCalculation?: calculation,
}

export type suggestionInfo = {
  attemptString: string,
  suggestions: string[],
  suggestionUsed?: boolean,
}

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

export function suggestMathFunctions(input: string): suggestionInfo {
  const functionMatch = input.match(/([a-z]+)\(?$/i);

  if (functionMatch) {
    const partialFunciton = functionMatch[1];
    return {
      attemptString: partialFunciton,
      suggestions: Object.keys(mathFunctions).filter(func => func.startsWith(partialFunciton)),
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

export function calculate(input: string): calculation {
  let output: number = 0;

  try {
    output = evaluateExpression(input);

    const modifiedResult = output === undefined ? "" : output.toString();

    return {
      operation: input,
      result: modifiedResult,
    }
  } catch (error) {
    return { operation: input, result: (error as Error).message };
  }
}