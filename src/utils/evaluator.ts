import { angleUnit } from "./types";

const CONSTANTS = new Set(["pi", "e", "π", "phi", "ϕ", "∞", "true", "false"]);

const factorial = (n: number): number => n <= 1 ? 1 : n * factorial(n - 1);

const phiVal = (1 + Math.sqrt(5)) / 2;

const sum = (...args: number[]) => args.reduce((acc, val) => acc + val, 0);

const mean = (...args: number[]) => sum(...args) / args.length;

const stdev = (...args: number[]) => {
  const m = mean(...args);
  return Math.sqrt(args.reduce((acc, val) => acc + (val - m) ** 2, 0) / args.length);
};

let currentAngle: angleUnit = "radian";

const toAngle: { [key: string]: number } = {
  degree: Math.PI / 180,
  gradian: Math.PI / 200,
  radian: 1,
};

const toValue: { [key: string]: number } = {
  degree: 180 / Math.PI,
  gradian: 200 / Math.PI,
  radian: 1,
};

const angle = (x: number): number => x * (toAngle[currentAngle] || 1);

const setAngleUnit = (_angleUnit: angleUnit = "radian"): void => { currentAngle = _angleUnit; }

const getAngleUnit = (): angleUnit => currentAngle;

const functions: { [key: string]: ((...args: number[]) => number) | number } = {
  //* INFO: Trig functions
  sin: (x: number) => Math.sin(angle(x)),
  cos: (x: number) => Math.cos(angle(x)),
  tan: (x: number) => Math.tan(angle(x)),
  asin: (x: number) => Math.asin(x) * toValue[currentAngle],
  acos: (x: number) => Math.acos(x) * toValue[currentAngle],
  atan: (x: number) => Math.atan(x) * toValue[currentAngle],
  attan: (y: number, x: number) => Math.atan2(y, x) * toValue[currentAngle],

  //* INFO: Algebraic functions
  sqrt: (x: number) => Math.sqrt(x),
  cbrt: (x: number) => Math.cbrt(x),
  lg: (x: number) => Math.log10(x),
  ln: (x: number) => Math.log(x),
  abs: (x: number) => Math.abs(x),

  //* INFO: Custom functions
  fact: (x: number) => factorial(x),
  root: (x: number, n: number) => Math.pow(x, 1 / n),
  log: (x: number, n: number) => Math.log(n) / Math.log(x),
  nPr: (n: number, r: number) => factorial(n) / factorial(n - r),
  nCr: (n: number, r: number) => factorial(n) / (factorial(r) * factorial(n - r)),
  ceil: (x: number) => Math.ceil(x),
  floor: (x: number) => Math.floor(x),
  mod: (x: number, y: number) => x % y,
  mean: (...args: number[]) => mean(...args),
  stddev: (...args: number[]) => stdev(...args),
  add: (...args: number[]) => sum(...args),
  high: (...args: number[]) => Math.max(...args),

  //* INFO: Mathematical Constants
  pi: Math.PI,
  phi: phiVal,
  '∞': Infinity,
  ϕ: phiVal,
  π: Math.PI,
  e: Math.E,
  false: Number(false),
  true: Number(true),
};

function evaluateExpression(input: string): boolean | number {
  input = autoCompleteParentheses(input);
  const comparisonMatch = input.match(/(<=|>=|<|>|=|!=)/);

  if (comparisonMatch) {
    const operator = comparisonMatch[0];
    return evaluateComparison(input, operator) as boolean;
  }

  return evaluateInput(input) as number;
}

function evaluateComparison(input: string, operator: string): boolean | number {
  const [left, right] = input.split(operator).map(part => part.trim());

  const leftValue = evaluateInput(left) as number;
  const rightValue = evaluateInput(right) as number;

  if (isNaN(leftValue) || isNaN(rightValue)) return NaN;

  switch (operator) {
    case "<": return leftValue < rightValue;
    case ">": return leftValue > rightValue;
    case "<=": return leftValue <= rightValue;
    case ">=": return leftValue >= rightValue;
    case "=": return leftValue === rightValue;
    case "!=": return leftValue !== rightValue;
    default: return NaN;
  }
}

function evaluateInput(input: string): number {
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
  const operators = new Set(['+', '-', '*', '/', '^', '(', ')', ',']);
  const comparators = new Set(['=', '<', '>']);
  const functionSet = new Set(Object.keys(functions));

  let currentToken = "";

  for (let i = 0; i < size; i++) {
    const char = input[i];

    //* INFO: Accumulates numbers (3.14 as one)
    if (!isNaN(parseFloat(char)) || char === '.') {
      currentToken += char;

      if (i + 1 < size && /[a-zA-Z]/.test(input[i + 1]) || CONSTANTS.has(input[i + 1])) {
        tokens.push(currentToken);
        tokens.push('*');

        currentToken = "";
      }

      if (i + 1 < size && !isNaN(parseFloat(input[i + 1]))) {
        continue;
      }
    }
    //* INFO: Handles unary operators (-3 or +3)
    else if (
      (char === '-' || char === '+') &&
      (
        i === 0 ||
        input[i - 1] === '(' ||
        input[i - 1] === ',' ||
        comparators.has(input[i - 1])
      )
    ) {
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
    '(': 1,
    ',': 0
  };

  const rightAssociative = new Set(['^']);
  const operators = new Set(['+', '-', '*', '/', '^']);
  const functionSet = new Set(Object.keys(functions));

  const outputQueue: string[] = [];
  const operatorStack: string[] = [];

  tokens.forEach(token => {
    if (!isNaN(parseFloat(token))) {
      outputQueue.push(token);
    }
    else if (CONSTANTS.has(token)) {
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
    else if (token === ',') {
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
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
      const valOrFunc = functions[token];

      if (typeof valOrFunc === "number") {
        stack.push(valOrFunc);
      }
      else if (typeof valOrFunc === "function") {
        const func = valOrFunc;

        const isVariadic = func.length === 0;
        const args = [];

        if (isVariadic) {
          while (stack.length > 0 && typeof stack[stack.length - 1] === "number") {
            args.push(stack.pop() as number);
          }

          stack.push(func(...args.reverse()));
        }
        else {
          const argCount = func.length;
          for (let i = 0; i < argCount; i++) {
            args.push(stack.pop() as number);
          }

          stack.push(func(...args.reverse()));
        }
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

  return stack[0] !== undefined ? stack[0] : NaN;
}

export {
  functions,
  setAngleUnit, getAngleUnit,
  evaluateExpression
};