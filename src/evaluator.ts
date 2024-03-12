type SeperatedInput = [string[], string | null, string[]];

function evaluateExpression(input: string) {
  const tokens: string[] | null = tokenize(input);
  const [leftInput, comparator, rightInput] = seperateInput(tokens);

  if (tokens.length === 0) return "";

  if (!comparator) {
    const postfix = leftInput ? infixtoPostfix([...leftInput]) : [];
    return evaluatePostfix(postfix);
  }

  const leftResult = evaluatePostfix(infixtoPostfix([...leftInput]));
  const rightResult = evaluatePostfix(infixtoPostfix([...rightInput]));

  switch (comparator) {
    case '=':
      return (leftResult === rightResult).toString();
    case '>':
      return (leftResult > rightResult).toString();
    case '<':
      return (leftResult < rightResult).toString();
    default:
      return "false";
  }
}

function tokenize(input: string): string[] {
  input = input.replace(/ /g, '');

  const tokens = [];
  const size = input.length;
  const operators = ['+', '-', '*', '/', '^', '(', ')'];
  const comparators = ['=', '<', '>'];

  const allowedSigns = [...operators, ...comparators];

  let currentToken = "";

  for (let i = 0; i < size; i++) {
    const char = input[i];

    if (!isNaN(parseFloat(char)) || char === '.' || char === ',') {
      currentToken += (char === ',') ? '.' : char;

      if (i + 1 < size && !isNaN(parseFloat(input[i + 1]))) {
        continue;
      }
    }
    else if ((char === '-' || char === '+') && (i === 0 || input[i - 1] === '(' || comparators.includes(input[i - 1]))) {
      currentToken += char;
      if (i + 1 < size && !isNaN(parseFloat(input[i + 1]))) {
        continue;
      }
    }
    else if (allowedSigns.includes(char)) {
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
    else if (char === " ") {
      continue;
    }
    else {
      throw new Error(`Unexpected character: ${char}`);
    }
  }

  if (currentToken) tokens.push(currentToken);
  return tokens;
}

function seperateInput(tokens: string[]): SeperatedInput {
  const tokensToFind = ['=', '>', '<', '>=', '<=']
  const comparatorIndex = tokens.findIndex(token => tokensToFind.includes(token));

  if (comparatorIndex === -1) return [tokens, null, []];
  const leftInput = tokens.slice(0, comparatorIndex);
  const comparator = tokens[comparatorIndex];
  const rightInput = tokens.slice(comparatorIndex + 1);

  return [leftInput, comparator, rightInput];
}

function infixtoPostfix(infix: string[]): string[] {
  const precedence: Record<string, number> = {
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
    if (!isNaN(parseFloat(token)))
      stack.push(parseFloat(token));
    else {
      const num2 = stack.pop();
      const num1 = stack.pop();

      if (!num2 || !num1) return NaN;

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