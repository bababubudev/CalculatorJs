import { useCallback, useEffect, useMemo, useState } from "react";
import { suggestionObject } from "../types/calculator";
import { functionKeys, suggestMathFunctions } from "../utils/utilityFunctions";

interface UsePreviewProp {
  inputValue: string;
  isSubmitted: boolean;
  onInputChange: (value: string) => void;
  insertAtCursor?: (text: string) => void;
  lastCursorPosition?: React.MutableRefObject<number>;
}

export function usePreview({ inputValue, isSubmitted, onInputChange, insertAtCursor, lastCursorPosition }: UsePreviewProp) {
  const [selectedPreview, setSelectedPreview] = useState<number>(0);
  const [functionPreview, setFunctionPreview] = useState<suggestionObject>({
    attemptString: "",
    suggestions: [],
  });

  const calculatedPreview = useMemo(() => {
    const preview = suggestMathFunctions(inputValue);
    return {
      ...preview,
      suggestionsUsed: false
    };
  }, [inputValue]);

  useEffect(() => {
    if (
      calculatedPreview.attemptString !== functionPreview.attemptString ||
      JSON.stringify(calculatedPreview.suggestions) !== JSON.stringify(functionPreview.suggestions)
    ) {
      setFunctionPreview({
        ...calculatedPreview,
        suggestionUsed: false
      });

      setSelectedPreview(0);
    }
  }, [calculatedPreview, functionPreview.attemptString, functionPreview.suggestions]);

  const hidePreview = useMemo(() => {
    return isSubmitted || functionPreview.suggestions.length <= 0 || functionPreview.suggestionUsed;
  }, [isSubmitted, functionPreview.suggestions.length, functionPreview.suggestionUsed]);

  const autoFillPreview = useCallback((index: number) => {
    const suggestions = functionPreview.suggestions;
    const attempt = functionPreview.attemptString;

    if (index >= suggestions.length) return;

    setSelectedPreview(index);

    const selectedFunc = suggestions[index];
    const selectedAutofill = functionKeys[selectedFunc].pasteAs;

    if (insertAtCursor && lastCursorPosition) {
      const cursorPos = lastCursorPosition.current;

      const beforeCursor = inputValue.slice(0, cursorPos).toLowerCase();
      const lastIndex = beforeCursor.lastIndexOf(attempt);

      if (lastIndex !== -1) {
        const beforeAttempt = inputValue.slice(0, lastIndex);
        const afterAttempt = inputValue.slice(lastIndex + attempt.length);

        const newValue = beforeAttempt + selectedAutofill + afterAttempt;
        const newCursorPos = lastIndex + selectedAutofill.length;

        lastCursorPosition.current = newCursorPos;

        onInputChange(newValue);

        setFunctionPreview(prev => ({ ...prev, suggestionUsed: true }));
        return;
      }
    }

    const previousValue = inputValue.toLowerCase();
    const lastIndex = previousValue.lastIndexOf(attempt);

    if (lastIndex !== -1) {
      const before = inputValue.slice(0, lastIndex);
      const after = inputValue.slice(lastIndex + attempt.length);

      const newValue = before + selectedAutofill + after;
      onInputChange(newValue);
      setFunctionPreview(prev => ({ ...prev, suggestionUsed: true }));
    }

  }, [functionPreview.suggestions, functionPreview.attemptString, insertAtCursor, lastCursorPosition, inputValue, onInputChange]);

  const navigatePreview = useCallback((direction: 'next' | 'prev') => {
    const suggestionsLength = functionPreview.suggestions.length;
    if (suggestionsLength <= 1) return;

    setSelectedPreview(prev => {
      if (direction === 'next') {
        return (prev + 1) % suggestionsLength;
      } else {
        return (prev - 1 + suggestionsLength) % suggestionsLength;
      }
    });
  }, [functionPreview.suggestions.length]);

  const handlePreviewKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (hidePreview) return false;

    const suggestions = functionPreview.suggestions;

    if ((e.key === "Tab" || e.key === "Enter") && suggestions.length > 0) {
      e.preventDefault();
      autoFillPreview(selectedPreview);
      return true;
    }

    if (suggestions.length > 1) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        navigatePreview('next');
        return true;
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigatePreview('prev');
        return true;
      }
    }

    return false;
  }, [hidePreview, functionPreview.suggestions, selectedPreview, autoFillPreview, navigatePreview]);

  useEffect(() => {
    if (!inputValue.trim()) {
      setFunctionPreview({ attemptString: "", suggestions: [] });
      setSelectedPreview(0);
    }
  }, [inputValue]);

  return {
    functionPreview,
    selectedPreview,
    hidePreview,
    setSelectedPreview,
    autoFillPreview,
    handlePreviewKeyDown,
    navigatePreview
  };
}