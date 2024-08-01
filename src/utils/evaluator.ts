// type SeperatedInput = [string[], string | null, string[]];
export type ComparisonObject = {
  comparison: boolean,
  leftInput: string[],
  rightInput: string[],
  leftResult: string,
  rightResult: string,
  comparator: string
}

export type FunctionKeys = "sin" | "cos" | "tan" |
  "asin" | "acos" | "atan" |
  "sqrt" | "log" | "lg" | "ln" | "abs" | "!" | "factorial";

export const mathFunctions: { [key in FunctionKeys]: (x: number) => number } = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  asin: Math.asin,
  acos: Math.acos,
  atan: Math.atan,
  sqrt: Math.sqrt,
  log: Math.log,
  lg: Math.log10,
  ln: Math.log,
  abs: Math.abs,
  "!": factorialize,
  factorial: factorialize,
};

function factorialize(x: number): number {
  if (x === undefined) return 0;
  if (x < 0) return -1;
  if (x > 180) return Infinity;

  else if (x === 0) return 1;
  else return (x * factorialize(x - 1));
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
  const functions = new Set(Object.keys(mathFunctions))
  let currentToken = "";

  for (let i = 0; i < size; i++) {
    const char = input[i];

    if (!isNaN(parseFloat(char)) || char === '.' || char === ',') {
      currentToken += (char === ',') ? '.' : char;

      if (i + 1 < size && !isNaN(parseFloat(input[i + 1]))) {
        continue;
      }
    }
    else if ((char === '-' || char === '+') && (i === 0 || input[i - 1] === '(' || comparators.has(input[i - 1]))) {
      currentToken += char;
      if (i + 1 < size && !isNaN(parseFloat(input[i + 1]))) {
        continue;
      }
    }
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
    else {
      currentToken += char;
      if (functions.has(currentToken)) {
        tokens.push(currentToken);
        currentToken = "";
      }
    }
  }

  if (currentToken) tokens.push(currentToken);
  return tokens;
}

//#region FIXME: Comparison operation after new algorithm
// function evaluateAndCompareToken(tokens: string[]): number {
//   let comparison: boolean = false;
//   const [leftInput, comparator, rightInput] = seperateInput(tokens);

//   if (!comparator) {
//     return evaluateTokens(tokens);
//   }

//   const leftResult = evaluateTokens(leftInput).toFixed(2);
//   if (comparator && rightInput.length === 0) Number(leftResult);
//   const rightResult = evaluateTokens(rightInput).toFixed(2);

//   switch (comparator) {
//     case '=':
//       comparison = (leftResult === rightResult);
//       break;
//     case '>':
//       comparison = (leftResult > rightResult);
//       break;
//     case '<':
//       comparison = (leftResult < rightResult);
//       break
//     default:
//       comparison = false;
//       break;
//   }

//   return comparison ? 1 : 0;
// }

// function seperateInput(tokens: string[]): SeperatedInput {
//   const tokensToFind = ['=', '>', '<'];
//   const comparatorIndex = tokens.findIndex(token => tokensToFind.includes(token));

//   if (comparatorIndex === -1) return [tokens, null, []];
//   const leftInput = tokens.slice(0, comparatorIndex);
//   const comparator = tokens[comparatorIndex];
//   const rightInput = tokens.slice(comparatorIndex + 1);

//   return [leftInput, comparator, rightInput];
// }
//#endregion

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
  const functions = new Set(Object.keys(mathFunctions));

  const outputQueue: string[] = [];
  const operatorStack: string[] = [];

  tokens.forEach(token => {
    if (!isNaN(parseFloat(token))) {
      outputQueue.push(token);
    }
    else if (functions.has(token)) {
      operatorStack.push(token);
    }
    else if (operators.has(token)) {
      /* NOTE: Checks whether an operator is right associative */
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

      if (functions.has(operatorStack[operatorStack.length - 1])) {
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
    else {
      if (mathFunctions[token as FunctionKeys]) {
        const a = stack.pop() as number;
        stack.push(mathFunctions[token as FunctionKeys](a));
      }
      else {
        const b = stack.pop() as number;
        const a = stack.pop() as number;

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
    }
  });

  return stack[0];
}

export default evaluateExpression;