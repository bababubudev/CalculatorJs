import { evaluateExpression, getAngleUnit, getCurrentRPN, setAngleUnit } from "./evaluator";
import type { angleUnit, calculationInfo, functionValue, suggestionObject } from "./types.ts";

export const functionKeys: Record<string, functionValue> = {
  "sin": {
    displayAs: "sin(n)",
    pasteAs: "sin(",
    description: "Sine of an angle 'n'",
  },
  "cos": {
    displayAs: "cos(n)",
    pasteAs: "cos(",
    description: "Cosine of an angle 'n'",
  },
  "tan": {
    displayAs: "tan(n)",
    pasteAs: "tan(",
    description: "Tangent of an angle 'n'"
  },
  "asin": {
    displayAs: "asin(n)",
    pasteAs: "asin(",
    description: "Inverse sine of a value 'n' (arc sine)"
  },
  "acos": {
    displayAs: "acos(n)",
    pasteAs: "acos(",
    description: "Inverse cosine of a value 'n' (arc cosine)"
  },
  "atan": {
    displayAs: "atan(n)",
    pasteAs: "atan(",
    description: "Inverse tangent of a value 'n' (arc tangent)"
  },

  "sqrt": {
    displayAs: "sqrt(n)",
    pasteAs: "sqrt(",
    description: "Square root of a value 'n'",
  },
  "cbrt": {
    displayAs: "cbrt(n)",
    pasteAs: "cbrt(",
    description: "Cube root of a value 'n'"
  },
  "lg": {
    displayAs: "lg(n)",
    pasteAs: "lg(",
    description: "Logarithm to base 10 of a number 'n'"
  },
  "ln": {
    displayAs: "ln(n)",
    pasteAs: "ln(",
    description: "Natural logarithm of a number 'n'"
  },
  "abs": {
    displayAs: "abs(n)",
    pasteAs: "abs(",
    description: "Absolute value of a number 'n'"
  },
  "attan": {
    displayAs: "attan(y, x)",
    pasteAs: "attan(",
    description: "Returns the angle in the plane between the positive x-axis and the ray from (0,0) to the point ('y', 'x')"
  },

  "ans": {
    displayAs: "ans(n)",
    pasteAs: "ans(",
    description: "Returns answer from history with a given number 'n'"
  },
  "fact": {
    displayAs: "fact(n)",
    pasteAs: "fact(",
    description: "Factorial of a number 'n'. Alternative input: n!"
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
    description: "Calculates the 'n':th root of a number 'm' (ex. root(3, 8) = 2)"
  },
  "log": {
    displayAs: "log(m, n)",
    pasteAs: "log(",
    description: "Calculates the log 'n' with a base number 'm' (ex. log(2, 8) = 3)"
  },
  "nCr": {
    displayAs: "nCr(n, r)",
    pasteAs: "nCr(",
    description: "Represents the combination formula used to calculate the number of ways to choose 'r' items from 'n' items where order does not matter"
  },
  "nPr": {
    displayAs: "nPr(n, r)",
    pasteAs: "nPr(",
    description: "Represents the permutation formula used to calculate the number of ways to arrange 'r' items from 'n' items where order matters"
  },
  "mod": {
    displayAs: "mod(n, m)",
    pasteAs: "mod(",
    description: "Returns the remainder of the division of 'n' by 'm'"
  },
  "ceil": {
    displayAs: "ceil(n)",
    pasteAs: "ceil(",
    description: "Rounds a number 'n' upwards to the nearest integer"
  },
  "floor": {
    displayAs: "floor(n)",
    pasteAs: "floor(",
    description: "Rounds a number 'n' downwards to the nearest integer"
  },
  "mean": {
    displayAs: "mean(n₁, n₂, ...)",
    pasteAs: "mean(",
    description: "Returns the average of 'n' numbers"
  },
  "stdev": {
    displayAs: "stdev(n₁, n₂, ...)",
    pasteAs: "stdev(",
    description: "Returns the standard deviation of 'n' numbers"
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

export function processInputToLatex(currentInput: string): string {
  const RPN: string[] = getCurrentRPN();
  const stack: string[] = [];

  function renderOperator(operator: string, a: string, b: string) {
    switch (operator) {
      case "+":
        return `${a} + ${b}`;
      case "-":
        return `${a} - ${b}`;
      case "*":
        return `${a} \\cdot ${b}`;
      case "/":
        return `\\cfrac{${a}}{${b}}`;
      case "^":
        return `${a}^{${b}}`;
      case "!":
        return `${b}!`;
      default:
        return `${a} ${operator} ${b}`;
    }
  }

  function formatLatexFunction(token: string, args: string[]) {
    const constants = ["pi", "phi", "infinity", "e", "true", "false"];

    switch (token) {
      case "sqrt":
        return `\\sqrt{${args[0] || ""}}`;
      case "cbrt":
        return `\\sqrt[3]{${args[0] || ""}}`;
      case "root":
        return `\\sqrt[${args[0] || ""}]{${args[1] || ""}}`;
      case "nCr":
        return `\\binom{${args[0] || ""}}{${args[1] || ""}}`;
      default:
        if (constants.includes(token)) {
          console.log(token);
          return `\\${token}`;
        }
        return `\\text{${token}}(${args.join(", ")})`;
    }
  }

  RPN.forEach(token => {
    if (!isNaN(parseFloat(token))) {
      stack.push(token);
    }
    else if (token in functionKeys) {
      const args = stack.splice(-stack.length);
      stack.push(formatLatexFunction(token, args));
    }
    else {
      const b = stack.pop() || "";
      const a = stack.pop() || "";

      const render = a === "" ?
        renderOperator(token, b, a) :
        renderOperator(token, a, b);
      stack.push(render);
    }
  });

  return stack[0];
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

export function suggestMathFunctions(input: string): suggestionObject {
  const functionMatch = input.toLowerCase().match(/([a-z]+)\(?$/i);

  if (functionMatch) {
    const partialFunciton = functionMatch[1];
    const priorityMatches = FILTER_KEYS.filter(func => func.toLowerCase().startsWith(partialFunciton));

    return {
      attemptString: partialFunciton,
      suggestions: priorityMatches,
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
      angleUnit: getAngleUnit(),
    }
  } catch (error) {
    return { operation: input, result: (error as Error).message };
  }
}