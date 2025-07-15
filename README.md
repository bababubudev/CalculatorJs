# Calculator

A modern, feature-rich calculator web application built with React and TypeScript. This calculator handles arithmetic, trigonometric, and advanced mathematical operations while maintaining proper order of operations using the Shunting Yard algorithm.

<img
  src="https://github.com/user-attachments/assets/65f65a65-0f6a-4cb7-8d62-74b6a11dd83e"
  alt="calculatorjs demo screenshot"
  width="600"
  style="display: block; margin: 0 auto"
  />

## Features

### Core Functionality
- **Basic Operations**: Addition, subtraction, multiplication, division
- **Trigonometric Functions**: sin, cos, tan, asin, acos, atan, atan2
- **Advanced Math**: Square root, cube root, nth root, logarithms, factorials
- **Statistical Functions**: mean, standard deviation, combinations (nCr), permutations (nPr)
- **Mathematical Constants**: π (pi), φ (phi), e (Euler's number), infinity
- **Comparison Operators**: Supports mathematical comparisons (<, >, ≤, ≥, =, ≠)

### Smart Features
- **Intelligent Input**: Auto-completion of parentheses and mathematical expressions
- **Function Suggestions**: Real-time suggestions with fuzzy search for mathematical functions
- **Bracket Preview**: Visual preview of auto-completed brackets

### User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Theme Support**: Three beautiful themes - Jade (default), Night (dark), and Earth (light)
- **Interactive Keypad**: Optional on-screen keypad for easy input
- **History Management**: Persistent calculation history with animations
- **Precision Control**: Adjustable decimal precision (2-15 decimal places)

### Customization
- **Angle Units**: Support for degrees, radians, and gradians
- **Precision Settings**: Configurable result precision
- **Theme Selection**: Multiple color themes to choose from
- **Keypad Toggle**: Show/hide the virtual keypad
- **Local Storage**: All settings and history are automatically saved

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bababubudev/calculator.git
cd calculator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## Usage Examples

### Basic Arithmetic
```
2 + 3 * 4        // Result: 14
(2 + 3) * 4      // Result: 20
2^3              // Result: 8
sqrt(16)         // Result: 4
```

### Trigonometric Functions
```
sin(30)          // Result: 0.5 (in degree mode)
cos(pi/4)        // Result: 0.7071... (in radian mode)
tan(45)          // Result: 1 (in degree mode)
```

### Advanced Functions
```
fact(5)          // Result: 120
nCr(10, 3)       // Result: 120
log(2, 8)        // Result: 3 (log base 2 of 8)
root(27, 3)      // Result: 3 (cube root of 27)
mean(1,2,3,4,5)  // Result: 3
```

### Using History
```
ans(1)           // Returns the result of the most recent calculation
ans(2)           // Returns the result of the second most recent calculation
```

### Comparisons
```
5 > 3            // Result: true
2^3 = 8          // Result: true
sin(30) < 0.6    // Result: true
```

## Project Structure

```
src/
├── components/           # React components
│   ├── calculator/      # Calculator-specific components
│   ├── header/          # Header components
│   ├── history/         # History management components
│   └── ui/              # Reusable UI components
├── context/             # React context providers
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── styles/              # SCSS stylesheets
├── types/               # TypeScript type definitions
└── utils/               # Utility functions and evaluator
```

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: SCSS with CSS custom properties
- **State Management**: React Context + useReducer
- **Icons**: React Icons
- **Math Engine**: Custom evaluator using Shunting Yard algorithm

## Mathematical Engine

The calculator uses a custom mathematical expression evaluator built with:

- **Tokenization**: Breaks down input into mathematical tokens
- **Shunting Yard Algorithm**: Converts infix notation to postfix (RPN)
- **RPN Evaluation**: Evaluates the postfix expression
- **Function Support**: Handles mathematical functions with variable arguments

## Configuration

The calculator supports various configuration options:

- **Angle Unit**: Choose between degrees, radians, or gradians
- **Precision**: Set decimal precision from 2 to 15 places
- **Theme**: Select from three beautiful themes
- **Keypad**: Toggle the virtual keypad on/off

All settings are automatically saved to localStorage and persist between sessions.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with React and modern web technologies
- Mathematical engine inspired by the Shunting Yard algorithm
- Icons provided by React Icons
- Typography using the Fira Sans font family

## Bug Reports

If you encounter any issues, please [create an issue](https://github.com/bababubudev/calculator/issues) with:
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Browser and device information

## Links

- [Live Demo](https://calculab.pareki.xyz/)
- [Repository](https://github.com/bababubudev/calculator)
- [Issues](https://github.com/bababubudev/calculator/issues)
