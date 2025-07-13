import { v4 as uuidv4 } from "uuid";
import { historyObject } from "../types/calculator";
import { autoCompleteBrackets, calculate, roundNumbers } from "../utils/utilityFunctions";
import { optionObject } from "../types/options";
import { useCallback, useEffect, useReducer, useRef } from "react";
import { angleUnit } from "../types";

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
  | { type: "SUBMIT_CALCULATION", payload: { input: string, preview: string, result: string, needsRounding: boolean, angleUnit?: angleUnit } }
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
      return {
        ...state,
        topDisplay: action.payload.preview,
        inputValue: action.payload.result,
        isSubmitted: true,
        currentCalc: {
          key: uuidv4(),
          operation: action.payload.input,
          displayOperation: action.payload.preview,
          result: action.payload.result,
          needsRounding: action.payload.needsRounding,
          angleUnit: action.payload.angleUnit,
        },
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
  const lastCursorPosition = useRef<number>(0);

  const formatResults = useCallback((result: string, precision: number = 5): [string, boolean] => {
    if (result === "true" || result === "false") return [result, false];
    if (!isNaN(Number(result))) return [result, false];

    const roundedResult = roundNumbers(Number(result), precision);
    return roundedResult.requires ? [roundedResult.rounded, true] : [result, false];
  }, []);

  const handleAnswerRequest = useCallback((currentValue: string) => {
    const ansPattern = /ans\((\d+)([^)]*)/g;
    return currentValue.replace(ansPattern, (_, index) => {
      const ansValue = askForAnswer(Number(index));
      return ansValue.toString();
    });
  }, [askForAnswer]);

  const inputFocus = useCallback((focus = true, forceEndPosition = false) => {
    if (!inputRef.current) return;

    if (focus) {
      inputRef.current.focus();

      if (forceEndPosition) {
        const endPosition = inputRef.current.value.length;
        inputRef.current.setSelectionRange(endPosition, endPosition);
        inputRef.current.scrollLeft = inputRef.current.scrollWidth;
        lastCursorPosition.current = endPosition;
      } else {
        const currentLength = inputRef.current.value.length;
        const targetPosition = Math.min(lastCursorPosition.current, currentLength);

        const safePosition = Math.max(0, targetPosition);
        inputRef.current.setSelectionRange(safePosition, safePosition);

        const charWidth = 8;
        const visibleWidth = inputRef.current.clientWidth;
        const cursorPixelPosition = safePosition * charWidth;

        if (cursorPixelPosition > inputRef.current.scrollLeft + visibleWidth - 20) {
          inputRef.current.scrollLeft = cursorPixelPosition - visibleWidth + 20;
        } else if (cursorPixelPosition < inputRef.current.scrollLeft + 20) {
          inputRef.current.scrollLeft = Math.max(0, cursorPixelPosition - 20);
        }

        lastCursorPosition.current = safePosition;
      }
    } else {
      lastCursorPosition.current = inputRef.current.selectionStart || inputRef.current.value.length;
      inputRef.current.blur();
    }
  }, []);

  const syncBracketPreview = useCallback(() => {
    if (inputRef.current && bracketPrevRef.current) {
      const scrollOffset = inputRef.current.scrollLeft;
      bracketPrevRef.current.style.transform = `translateX(${-scrollOffset}px)`;
    }
  }, []);

  const handleInputChange = useCallback((newValue: string, cursorPosition?: number) => {
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

      if (cursorPosition !== undefined) {
        setTimeout(() => {
          if (inputRef.current) {
            const safePosition = Math.min(cursorPosition, processedValue.length);
            inputRef.current.setSelectionRange(safePosition, safePosition);
            lastCursorPosition.current = safePosition;
          }
        }, 0);
      }
    }
  }, [handleAnswerRequest, options.angleUnit, options.precision, formatResults, removePassedInput, state.isSubmitted]);

  const handleSubmit = useCallback(() => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const output = calculate(state.inputValue, options.angleUnit);
      const [displayResult, needsRounding] = formatResults(output.result, options.precision || 5);

      if (output.result !== "") {
        const historyItem: historyObject = {
          key: uuidv4(),
          operation: state.inputValue,
          displayOperation: state.bracketPreview,
          result: displayResult,
          needsRounding,
          angleUnit: options.angleUnit,
        };

        addToHistory(historyItem);
        dispatch({
          type: "SET_CURRENT_CALCULATION",
          payload: historyItem
        });

        dispatch({ type: "SET_SUBMITTED", payload: true });
        dispatch({ type: "SET_DISPLAY", payload: state.bracketPreview });
        dispatch({ type: "SET_INPUT", payload: displayResult });


        setTimeout(() => inputFocus(true, true), 0);
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error instanceof Error ? error.message : "Calculation Error"
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.inputValue, state.bracketPreview, options.angleUnit, options.precision, formatResults, addToHistory, inputFocus]);

  const resetCalculator = useCallback(() => {
    dispatch({ type: "RESET_CALCULATOR" });
    inputFocus(true, true);
  }, [inputFocus]);

  const handleKeyDown = useCallback((_: React.KeyboardEvent<HTMLInputElement>) => {
    // This will be handled by preview hook if needed
  }, []);

  const insertAtCursor = useCallback((textToInsert: string) => {
    removePassedInput();

    const currentValue = state.inputValue;
    const cursorPos = lastCursorPosition.current;

    const newValue = currentValue.slice(0, cursorPos) + textToInsert + currentValue.slice(cursorPos);
    const newCursorPos = cursorPos + textToInsert.length;

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

      setTimeout(() => {
        if (inputRef.current) {
          const safePosition = Math.min(newCursorPos, processedValue.length);
          inputRef.current.setSelectionRange(safePosition, safePosition);
          lastCursorPosition.current = safePosition;
        }
      }, 0);
    }
  }, [formatResults, handleAnswerRequest, options.angleUnit, options.precision, removePassedInput, state.inputValue, state.isSubmitted]);

  useEffect(() => {
    if (!passedInput) return;

    inputFocus(true, true);
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
      const validKeys = event.key === "Backspace" || event.key === "Delete" || validOptions.test(event.key);
      const isControlKey = event.ctrlKey || event.metaKey;
      const isSupportedKeyCombo = isControlKey && ["c", "v", "x"].includes(event.key);

      if (validKeys && !isSupportedKeyCombo) {
        if (document.activeElement !== inputRef.current) {
          inputFocus(true);
        }

        if ((event.key === "Backspace" || event.key === "Delete") && state.currentCalc) {
          event.preventDefault();
          const { operation, result } = state.currentCalc;

          dispatch({
            type: "LOAD_FROM_HISTORY",
            payload: { operation, result }
          });

          setTimeout(() => inputFocus(true, true), 0);
        }
      } else if (event.key === "Escape") {
        inputFocus(false);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [state.currentCalc, inputFocus]);

  useEffect(() => {
    const inputElement = inputRef.current;
    if (!inputElement) return;

    const handleCursorMove = () => {
      if (document.activeElement === inputElement) {
        lastCursorPosition.current = inputElement.selectionStart || 0;
      }
    };

    inputElement.addEventListener("click", handleCursorMove);
    inputElement.addEventListener("keyup", handleCursorMove);
    inputElement.addEventListener("mouseup", handleCursorMove);

    return () => {
      inputElement.removeEventListener("click", handleCursorMove);
      inputElement.removeEventListener("keyup", handleCursorMove);
      inputElement.removeEventListener("mouseup", handleCursorMove);
    };

  }, []);

  return {
    ...state,

    inputRef,
    bracketPrevRef,
    lastCursorPosition,

    handleInputChange,
    handleSubmit,
    handleKeyDown,
    resetCalculator,
    inputFocus,
    insertAtCursor,

    dispatch,
  }
}