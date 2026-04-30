import { Suspense, lazy } from "react";
import type { NeuralPhase } from "./NeuralLinkInner";

const Inner = lazy(() => import("./NeuralLinkInner"));

export function NeuralLink({ phase }: { phase: NeuralPhase }) {
  return (
    <div className="absolute inset-0">
      <Suspense fallback={null}>
        <Inner phase={phase} />
      </Suspense>
    </div>
  );
}

export type { NeuralPhase };
