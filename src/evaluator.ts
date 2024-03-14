type SeperatedInput = [string[], string | null, string[]];
export type ComparisonObject = {
  comparison: boolean,
  leftInput: string[],
  rightInput: string[],
  leftResult: string,
  rightResult: string,
  comparator: string
}

function evaluateExpression(input: string): [string[], number] | ComparisonObject {
  const tokens: string[] | null = tokenize(input);
  const trigSyntax: Set<string> = new Set(["sin", "cos", "tan", "asin", "acos", "atan"]);
  const trigTokens: RegExpMatchArray | null = input.match(/(\w+|\d+|[+\-*/()^]|\s+)/g);

  if (trigTokens) {
    for (const token of trigTokens) {
      if (trigSyntax.has(token.toLowerCase())) {
        evaluateTrig(trigTokens, token, tokens);
        return [trigTokens, NaN];
      }
    }
  }

  return evaluateAndCompareToken(tokens);
}

function tokenize(input: string): string[] {
  input = input.replace(/ /g, '');
  input = input.replace(/÷/g, '/');
  input = input.replace(/x/g, '*');

  const tokens = [];
  const size = input.length;
  const operators = new Set(['+', '-', '*', '/', '^', '(', ')']);
  const comparators = new Set(['=', '<', '>']);
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
  }

  if (currentToken) tokens.push(currentToken);
  return tokens;
}

function evaluateToken(tokens: string[]): number {
  const postfix = tokens ? infixtoPostfix(tokens) : [];
  return evaluatePostfix(postfix);
}

function evaluateAndCompareToken(tokens: string[]): [string[], number] | ComparisonObject {
  let comparison: boolean = false;
  const [leftInput, comparator, rightInput] = seperateInput(tokens);

  if (!comparator) {
    return [tokens, evaluateToken(tokens)];
  }

  const leftResult = evaluateToken(leftInput).toFixed(2);
  if (comparator && rightInput.length === 0) return [tokens, Number(leftResult)];
  const rightResult = evaluateToken(rightInput).toFixed(2);

  switch (comparator) {
    case '=':
      comparison = (leftResult === rightResult);
      break;
    case '>':
      comparison = (leftResult > rightResult);
      break;
    case '<':
      comparison = (leftResult < rightResult);
      break
    default:
      comparison = false;
      break;
  }

  return {
    comparison,
    leftInput,
    rightInput,
    leftResult,
    rightResult,
    comparator
  };
}


function evaluateTrig(trigToken: string[], token: string, tokens: string[]): number {
  const innerTokens = tokens.slice(tokens.findIndex((elem) => elem === "("), tokens.findIndex((elem) => elem === ")") + 1);
  const outerTokens = tokens.slice(0, tokens.findIndex(elem => elem === "(")).concat(tokens.slice(tokens.findIndex(elem => elem === ")") + 1));

  const inside: number = evaluateToken(innerTokens);
  let trig: number;
  const outside: number = evaluateToken(outerTokens);

  switch (token) {
    case "sin":
      trig = Math.sin(inside);
      break;
    case "cos":
      trig = Math.cos(inside);
      break;
    case "tan":
      trig = Math.tan(inside);
      break;
    case "asin":
      trig = Math.asin(inside);
      break;
    case "acos":
      trig = Math.acos(inside);
      break;
    case "atan":
      trig = Math.atan(inside);
      break;
    default:
      trig = NaN;
      break;
  }

  const trigPosition = outerTokens.findIndex(elem => trigToken === elem);
  console.log(trigToken);

  return NaN;
}

function seperateInput(tokens: string[]): SeperatedInput {
  const tokensToFind = ['=', '>', '<'];
  const comparatorIndex = tokens.findIndex(token => tokensToFind.includes(token));

  if (comparatorIndex === -1) return [tokens, null, []];
  const leftInput = tokens.slice(0, comparatorIndex);
  const comparator = tokens[comparatorIndex];
  const rightInput = tokens.slice(comparatorIndex + 1);

  return [leftInput, comparator, rightInput];
}

function infixtoPostfix(infix: string[]): string[] {
  const precedence: Record<string, number> = {
    '<': 0,
    '>': 0,
    '=': 0,
    '^': 3,
    '*': 2,
    '/': 2,
    '+': 1,
    '-': 1,
  }

  const output: string[] = [];
  const symbolStack: string[] = [];

  for (const token of infix) {
    if (!isNaN(parseFloat(token))) { output.push(token); }
    else if (token === '(') { symbolStack.push(token); }
    else if (token === ')') {
      while (symbolStack.length > 0 && symbolStack[symbolStack.length - 1] !== '(') {
        output.push(symbolStack.pop() as string);
      }

      symbolStack.pop();
    } else {
      while (symbolStack.length > 0 && precedence[symbolStack[symbolStack.length - 1]] >= precedence[token]) {
        output.push(symbolStack.pop() as string);
      }

      symbolStack.push(token);
    }
  }

  while (symbolStack.length > 0) {
    output.push(symbolStack.pop() as string);
  }

  return output;
}

function evaluatePostfix(postfix: string[]): number {
  const stack: number[] = [];

  for (const token of postfix) {
    if (!isNaN(parseFloat(token))) {
      stack.push(parseFloat(token));
    }
    else {
      const num2 = stack.pop();
      const num1 = stack.pop();

      if (num2 === undefined || num1 === undefined) return NaN;

      switch (token) {
        case '+':
          stack.push(num1 + num2);
          break;
        case '-':
          stack.push(num1 - num2);
          break;
        case '*':
          stack.push(num1 * num2);
          break;
        case '/':
          stack.push(num1 / num2);
          break;
        case '^':
          stack.push(Math.pow(num1, num2));
          break;
      }
    }
  }

  return stack.pop() as number;
}

export default evaluateExpression;