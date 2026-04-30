import { Suspense, lazy } from "react";

const Inner = lazy(() => import("./NeuralFieldInner"));

export function NeuralField() {
  return (
    <div className="absolute inset-0">
      <Suspense fallback={null}>
        <Inner />
      </Suspense>
    </div>
  );
}
