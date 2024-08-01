import evaluateExpression, { mathFunctions } from "./evaluator";

export type calculation = {
  operation: string;
  result: string;
}

export function autoCompleteBrackets(input: string): string {
  const stack: { index: number, char: string }[] = [];
  let result = '';

  let i = 0;

  while (i < input.length) {
    const char = input[i];

    if (char === '(') {
      stack.push({ index: i, char: '(' });
      result += '(';
    } else if (char === ')') {
      if (stack.length > 0) {
        stack.pop();
      }
      result += ')';
    } else {
      result += char;
    }

    i++;
  }

  while (stack.length > 0) {
    result += ')';
    stack.pop();
  }

  return result;
}

export function concatNoDuplicate(str1: string, str2: string): string {
  const charsInStr2 = new Set(str2);
  const filteredStr1 = str1.split("").filter(char => !charsInStr2.has(char)).join("");

  return filteredStr1 + str2;
}

export function excludeRight(str: string, character: string) {
  // eslint-disable-next-line no-useless-escape
  const escapedCharacter = character.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`^(.*${escapedCharacter})(?=.*[^${escapedCharacter}].*)`);
  return str.replace(regex, '');
}

export function suggestMathFunctions(input: string): string[] {
  const functionMatch = input.match(/([a-z]+)\(?$/i);

  if (functionMatch) {
    const partialFunciton = functionMatch[1];
    return Object.keys(mathFunctions).filter(func => func.startsWith(partialFunciton));
  }
  else {
    return [];
  }
}

export const roundNumbers = (num: number, precision: number = 5) => {
  const multiplier = Math.pow(10, precision);
  const roundedNum = Math.round(num * multiplier) / multiplier;

  return {
    requires: num !== roundedNum,
    rounded: num.toFixed(precision),
  };
};

export const calculate = (input: string): calculation => {
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
};