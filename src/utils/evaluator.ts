import { angleUnit, mathFunctions } from "./types";
// type SeperatedInput = [string[], string | null, string[]]

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
  π: Math.PI,
  τ: Math.PI * 2,
  e: Math.E
};

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

function evaluateExpression(input: string): number {
  input = autoCompleteParentheses(input);
  const tokens: string[] | null = tokenize(input);
  const rpn = shuntingYard(tokens);
  return evaluateRPN(rpn);
}

function autoCompleteParentheses(input: string): string {
  let openParenthesesCount = 0;
  let closeParenthesesCount = 0;

  for (const char of input) {
    if (char === '(') openParenthesesCount++;
    if (char === ')') closeParenthesesCount++;
  }

  while (closeParenthesesCount < openParenthesesCount) {
    input += ')';
    closeParenthesesCount++;
  }

  return input;
}

function tokenize(input: string): string[] {
  input = input.replace(/ /g, '');
  input = input.replace(/÷/g, '/');
  input = input.replace(/x/g, '*');
  input = input.replace(/⋅/g, '*');
  input = input.replace(/^/g, '');

  const tokens = [];
  const size = input.length;
  const operators = new Set(['+', '-', '*', '/', '^', '(', ')']);
  const comparators = new Set(['=', '<', '>']);
  const functionSet = new Set(Object.keys(functions));

  let currentToken = "";

  for (let i = 0; i < size; i++) {
    const char = input[i];

    //* INFO: Accumulates numbers (3.14 as one)
    if (!isNaN(parseFloat(char)) || char === '.' || char === ',') {
      currentToken += (char === ',') ? '.' : char;

      if (i + 1 < size && !isNaN(parseFloat(input[i + 1]))) {
        continue;
      }
    }
    //* INFO: Handles unary operators (-3 or +3)
    else if ((char === '-' || char === '+') && (i === 0 || input[i - 1] === '(' || comparators.has(input[i - 1]))) {
      currentToken += char;
      if (i + 1 < size && !isNaN(parseFloat(input[i + 1]))) {
        continue;
      }
    }
    //* INFO: Accumulates operators and comparators (3=3/3*3 as seperate)
    else if (operators.has(char) || comparators.has(char) || char === " ") {
      if (currentToken) {
        tokens.push(currentToken);
        currentToken = "";
      }

      if (char === '(' && i > 0 && !isNaN(parseFloat(input[i - 1]))) {
        tokens.push('*');
      }

      tokens.push(char);

      if (char === ')' && (i + 1) < size && !isNaN(parseFloat(input[i + 1]))) {
        tokens.push('*');
      }
    }
    //* INFO: Handles mathematical functions (sin, cos)
    else {
      currentToken += char;

      if (functionSet.has(currentToken)) {
        tokens.push(currentToken);
        currentToken = "";
      }
    }
  }

  if (currentToken) tokens.push(currentToken);
  return tokens;
}

function shuntingYard(tokens: string[]): string[] {
  const precedence: { [key: string]: number } = {
    '^': 4,
    '*': 3,
    '/': 3,
    '+': 2,
    '-': 2,
    '(': 1
  };

  const rightAssociative = new Set(['^']);
  const operators = new Set(['+', '-', '*', '/', '^']);
  const functionSet = new Set(Object.keys(functions));
  const constantSet = new Set(["pi", "tau", "e", "π", "τ"]);

  const outputQueue: string[] = [];
  const operatorStack: string[] = [];

  tokens.forEach(token => {
    if (!isNaN(parseFloat(token))) {
      outputQueue.push(token);
    }
    else if (constantSet.has(token)) {
      outputQueue.push(token);
    }
    else if (functionSet.has(token)) {
      operatorStack.push(token);
    }
    else if (operators.has(token)) {
      //* NOTE: Checks whether an operator is right associative
      while (operatorStack.length > 0 && operators.has(operatorStack[operatorStack.length - 1])) {
        const topOperator = operatorStack[operatorStack.length - 1];
        const isRightAssociative = rightAssociative.has(token);
        const topOperatorPrecedence = precedence[topOperator];
        const tokenPrecedence = precedence[token];

        const shouldPopOperator = isRightAssociative
          ? topOperatorPrecedence > tokenPrecedence
          : topOperatorPrecedence >= tokenPrecedence

        if (!shouldPopOperator) break;

        outputQueue.push(operatorStack.pop() as string);
      }

      operatorStack.push(token);
    }
    else if (token === '(') {
      operatorStack.push(token);
    }
    else if (token === ')') {
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
        outputQueue.push(operatorStack.pop() as string);
      }

      operatorStack.pop();

      if (functionSet.has(operatorStack[operatorStack.length - 1])) {
        outputQueue.push(operatorStack.pop() as string);
      }
    }
  });

  while (operatorStack.length > 0) {
    outputQueue.push(operatorStack.pop() as string);
  }

  return outputQueue;
}

function evaluateRPN(rpn: string[]): number {
  const stack: number[] = [];

  rpn.forEach(token => {
    if (!isNaN(parseFloat(token))) {
      stack.push(parseFloat(token));
    }
    else if (token in functions) {
      const valueOrFunction = functions[token];
      switch (typeof valueOrFunction) {
        case "number":
          stack.push(valueOrFunction);
          break;
        case "function":
          stack.push((valueOrFunction)(stack.pop() as number));
          break;
        default:
          break;

      }
    }
    else {
      const b = stack.pop() as number;
      const a = stack.pop() as number;

      if (a === undefined || b === undefined) {
        return NaN;
      }

      switch (token) {
        case '+':
          stack.push(a + b);
          break;
        case '-':
          stack.push(a - b);
          break;
        case '*':
          stack.push(a * b);
          break;
        case '/':
          stack.push(a / b);
          break;
        case '^':
          stack.push(Math.pow(a, b));
          break;
        default:
          stack.push(NaN);
      }
    }
  });

  return stack[0];
}

export default evaluateExpression;