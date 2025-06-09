import { v4 as uuidv4 } from "uuid";
import { historyObject } from "../types/calculator";
import { autoCompleteBrackets, calculate, roundNumbers } from "../utils/utilityFunctions";
import { optionObject } from "../types/options";
import { useCallback, useEffect, useReducer, useRef } from "react";

interface CalculatorState {
  inputValue: string;
  topDisplay: string;
  bracketPreview: string;
  isSubmitted: boolean;
  currentCalc: historyObject | undefined;
  error: string | null;
  isLoading: boolean;
}

type CalculatorAction =
  | { type: "SET_INPUT", payload: string }
  | { type: "SET_DISPLAY", payload: string }
  | { type: "SET_BRACKET_DISPLAY", payload: string }
  | { type: "SET_SUBMITTED", payload: boolean }
  | { type: "SET_CURRENT_CALCULATION", payload: historyObject | undefined }
  | { type: "SET_ERROR", payload: string | null }
  | { type: "SET_LOADING", payload: boolean }
  | { type: "UPDATE_INPUT_AND_DISPLAY", payload: { input: string, display: string, preview: string } }
  | { type: "SUBMIT_CALCULATION", payload: { input: string, preview: string, result: string, needsRounding: boolean, angleUnit?: string } }
  | { type: "RESET_CALCULATOR" }
  | { type: "LOAD_FROM_HISTORY", payload: { operation: string, displayOperation?: string, result: string } }
  | { type: "UPDATE_FROM_OPTIONS", payload: { display: string, input?: string } };

const initialState: CalculatorState = {
  inputValue: "",
  topDisplay: "",
  bracketPreview: "",
  isSubmitted: false,
  currentCalc: undefined,
  error: null,
  isLoading: false,
};

function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case "SET_INPUT":
      return { ...state, inputValue: action.payload };

    case "SET_BRACKET_DISPLAY":
      return { ...state, topDisplay: action.payload };

    case "SET_DISPLAY":
      return { ...state, bracketPreview: action.payload };

    case "SET_SUBMITTED":
      return { ...state, isSubmitted: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "UPDATE_INPUT_AND_DISPLAY":
      return {
        ...state,
        inputValue: action.payload.input,
        topDisplay: action.payload.display,
        bracketPreview: action.payload.preview,
        isSubmitted: false,
        currentCalc: undefined,
        error: null
      };

    case "SUBMIT_CALCULATION":
      const historyItem: historyObject = {
        key: uuidv4(),
        operation: action.payload.input,
        displayOperation: action.payload.preview,
        result: action.payload.result,
        needsRounding: action.payload.needsRounding,
        angleUnit: action.payload.angleUnit as any,
      };

      return {
        ...state,
        topDisplay: action.payload.preview,
        inputValue: action.payload.result,
        isSubmitted: true,
        currentCalc: historyItem,
        error: null,
      };

    case "RESET_CALCULATOR":
      return {
        ...initialState,
        isLoading: state.isLoading,
      };

    case "LOAD_FROM_HISTORY":
      return {
        ...state,
        inputValue: action.payload.operation,
        topDisplay: action.payload.result,
        bracketPreview: autoCompleteBrackets(action.payload.operation),
        isSubmitted: false,
        currentCalc: undefined,
        error: null
      };

    case "UPDATE_FROM_OPTIONS":
      return {
        ...state,
        topDisplay: action.payload.display,
        ...(action.payload.input && { inputValue: action.payload.input }),
      };

    default:
      return state;
  }
}

interface UseCalculatorStateProp {
  options: optionObject;
  askForAnswer: (x: number) => string;
  passedInput: string;
  removePassedInput: () => void;
  addToHistory: (info: historyObject) => void;
}

export function useCalculatorState({
  options,
  askForAnswer,
  passedInput,
  addToHistory,
  removePassedInput
}: UseCalculatorStateProp) {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);
  const inputRef = useRef<HTMLInputElement>(null);
  const bracketPrevRef = useRef<HTMLDivElement>(null);

  const formatResults = useCallback((result: string, precision: number = 5): [string, boolean] => {
    if (!isNaN(Number(result))) return [result, false];

    const roundedResult = roundNumbers(Number(result), precision);
    return roundedResult.requires ? [roundedResult.rounded, true] : [result, false];
  }, []);

  const handleAnswerRequest = useCallback((currentValue: string) => {
    const ansPattern = /ans\((\d+)([^)]*)/g;
    return currentValue.replace(ansPattern, (_, index) => {
      const ansValue = askForAnswer(Number(index));
      return ansValue.toString();
    })

  }, [askForAnswer]);

  const inputFocus = useCallback((focus = true) => {
    if (!inputRef.current) return;

    if (focus) {
      inputRef.current.focus();
      inputRef.current.scrollLeft = inputRef.current.scrollWidth;
    } else {
      inputRef.current.blur();
    }
  }, []);

  const syncBracketPreview = useCallback(() => {
    if (inputRef.current && bracketPrevRef.current) {
      const scrollOffset = inputRef.current.scrollLeft;
      bracketPrevRef.current.style.transform = `translateX(${-scrollOffset}px)`;
    }
  }, []);

  const handleInputChange = useCallback((newValue: string) => {
    removePassedInput();

    const processedValue = handleAnswerRequest(newValue);
    const completedBracket = autoCompleteBrackets(processedValue);

    const { result } = calculate(processedValue, options.angleUnit);
    const [displayResult] = formatResults(result, options.precision || 5);

    dispatch({
      type: "UPDATE_INPUT_AND_DISPLAY",
      payload: {
        input: processedValue,
        display: displayResult,
        preview: completedBracket
      }
    });

    if (inputRef.current) {
      const shouldShowPadding = processedValue.includes("(") && !state.isSubmitted;
      inputRef.current.style.paddingRight = shouldShowPadding ? "1rem" : "unset";
    }
  }, [handleAnswerRequest, options.angleUnit, options.precision, formatResults, removePassedInput, state.isSubmitted]);

  const handleSubmit = useCallback(() => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const output = calculate(state.inputValue, options.angleUnit);
      const [displayResult, needsRounding] = formatResults(output.result, options.precision || 5)

      if (output.result !== "") {
        dispatch({
          type: "SUBMIT_CALCULATION",
          payload: {
            input: state.inputValue,
            preview: state.bracketPreview,
            result: displayResult,
            needsRounding,
            angleUnit: options.angleUnit
          }
        });

        if (state.currentCalc) {
          addToHistory(state.currentCalc);
        }
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error instanceof Error ? error.message : "Calculation Error"
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.inputValue, state.bracketPreview, state.currentCalc, options.angleUnit, options.precision, formatResults, addToHistory]);

  const resetCalculator = useCallback(() => {
    dispatch({ type: "RESET_CALCULATOR" });
    inputFocus(true);
  }, [inputFocus]);

  useEffect(() => {
    if (!passedInput) return;

    inputFocus(true);
    dispatch({
      type: "LOAD_FROM_HISTORY",
      payload: {
        operation: passedInput,
        result: "",
      }
    });

    handleInputChange(passedInput);
  }, [passedInput, handleInputChange, inputFocus]);


  useEffect(() => {
    if (state.currentCalc && !passedInput) {
      const { operation, displayOperation } = state.currentCalc;
      const output = calculate(operation, options.angleUnit);
      const [displayResult] = formatResults(output.result, options.precision || 5);

      dispatch({
        type: "UPDATE_FROM_OPTIONS",
        payload: {
          display: displayOperation || operation,
          input: displayResult
        }
      });
    }
    else if (!state.currentCalc && !passedInput && state.inputValue) {
      const { result } = calculate(state.inputValue, options.angleUnit);
      const [displayResult] = formatResults(result, options.precision || 5);

      dispatch({
        type: "UPDATE_FROM_OPTIONS",
        payload: {
          display: displayResult
        }
      });
    }
  }, [options.angleUnit, options.precision, state.currentCalc, state.inputValue, passedInput, formatResults]);

  useEffect(() => {
    const inputElement = inputRef.current;
    if (!inputElement) return;

    inputElement.addEventListener("scroll", syncBracketPreview);
    return () => inputElement.removeEventListener("scroll", syncBracketPreview);
  }, [syncBracketPreview]);

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (!inputRef.current) return;

      const validOptions = /^[a-zA-Z0-9+\-*/.=]$/;
      const validKeys = event.key === "Backspace" || validOptions.test(event.key);
      const isControlKey = event.ctrlKey || event.metaKey;
      const isSupportedKeyCombo = isControlKey && ["c", "v", "x"].includes(event.key);

      if (validKeys && !isSupportedKeyCombo) {
        inputRef.current.focus();
        if (event.key === "Backspace" && state.currentCalc) {
          event.preventDefault();
          const { operation, result } = state.currentCalc;

          dispatch({
            type: 'LOAD_FROM_HISTORY',
            payload: {
              operation,
              result
            }
          });
        }
      } else if (event.key === "Escape") {
        inputFocus(false);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [state.currentCalc, inputFocus]);

  return {
    ...state,

    inputRef,
    bracketPrevRef,

    handleInputChange,
    handleSubmit,
    //handleKeyDown
    resetCalculator,
    inputFocus,

    dispatch,
  }
}