function evaluateExpression(input: string) {
  const tokens: RegExpMatchArray | null = tokenize(input);
  const postfix: string[] = tokens ? infixtoPostfix([...tokens]) : [];
  console.log(`tokenize: ${tokens}\npostfix: ${postfix}`);

  return evaluatePostfix(postfix);
}

function tokenize(input: string) {
  input = input.replace(/,/g, '.');
  input = input.replace(/(\d+)\s*(\()/g, '$1*$2');
  input = input.replace(/(\))\s*(\d+)/g, '$1*$2');

  return input.match(/\d*\.?\d+|\+|-|\*|\/|\^|\(|\)/g);
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