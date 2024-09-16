import evaluateExpression from "./evaluator";
import type { angleUnit, calculationInfo, mathFunctions, suggestionObject } from "./types";

export const functions: { [key: string]: mathFunctions } = {
  sin: (x: number) => Math.sin(toCurrentAngle(x)),
  cos: (x: number) => Math.cos(toCurrentAngle(x)),
  tan: (x: number) => Math.tan(toCurrentAngle(x)),
  asin: (x: number) => Math.asin(x) * (180 / Math.PI),
  acos: (x: number) => Math.acos(x) * (180 / Math.PI),
  atan: (x: number) => Math.atan(x) * (180 / Math.PI),
  sqrt: Math.sqrt,
  log: Math.log,
  lg: Math.log10,
  ln: Math.log,
  abs: Math.abs,
  factorial: factorialize,
  pi: Math.PI,
  e: Math.E,
};

export function addCustomFunction(name: string, func: mathFunctions) {
  functions[name] = func;
}

let currentAngleUnit: angleUnit = "radian";

export function setAngleUnit(_angleUnit: angleUnit = "radian"): void {
  currentAngleUnit = _angleUnit;
}

export function getAngleUnit(): angleUnit {
  return currentAngleUnit;
}

function factorialize(x: number): number {
  if (x === undefined) return 0;
  if (x < 0) return -1;
  if (x > 180) return Infinity;

  else if (x === 0) return 1;
  else return (x * factorialize(x - 1));
}

function toCurrentAngle(angle: number): number {
  switch (currentAngleUnit) {
    case "degree":
      return angle * (Math.PI / 180);
    case "gradian":
      return angle * (Math.PI / 200);
    case "radian":
    default:
      return angle;
  }
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

export function suggestMathFunctions(input: string): suggestionObject {
  const functionMatch = input.match(/([a-z]+)\(?$/i);

  if (functionMatch) {
    const partialFunciton = functionMatch[1];
    const regex = new RegExp(partialFunciton, "i");

    return {
      attemptString: partialFunciton,
      suggestions: Object.keys(functions).filter(func => regex.test(func)),
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