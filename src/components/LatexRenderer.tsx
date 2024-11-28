import katex, { KatexOptions } from "katex";
import "katex/dist/katex.min.css";
import { useEffect, useMemo, useRef } from "react";

interface LatexRendererProps {
  expression: string;
  isError?: () => void;
}

function LatexRenderer({ expression, isError }: LatexRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const katexOptions: KatexOptions = useMemo(() => ({
    throwOnError: true,
    displayMode: false,
    output: "mathml",
    macros: {
      "\\true": "\\checkmark",
      "\\false": "\\neq",
      "\\infinity": "\\infty",
      "\\e": "\\text{e}",
    }
  }), []);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(expression, containerRef.current, katexOptions);
      } catch (_) {
        isError?.();
      }
    }
  }, [expression, katexOptions, isError]);


  return (
    <div
      className="latex-container"
      ref={containerRef}
    >
    </div>
  );
}

export default LatexRenderer;