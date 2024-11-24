import katex, { KatexOptions } from "katex";
import "katex/dist/katex.min.css";
import { useEffect, useMemo, useRef } from "react";

interface LatexRendererProps {
  expression: string;
  onError?: (error: Error) => void;
}

function LatexRenderer({ expression, onError }: LatexRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const katexOptions: KatexOptions = useMemo(() => ({
    throwOnError: true,
    displayMode: true,
  }), []);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(expression, containerRef.current, katexOptions);
      } catch (error) {
        onError?.(error as Error ?? new Error("Don't know what happened"));
      }
    }
  }, [expression, onError, katexOptions]);


  return (
    <div
      className="latex-container"
      ref={containerRef}
    >
    </div>
  );
}

export default LatexRenderer;