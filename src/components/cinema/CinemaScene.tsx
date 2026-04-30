import { Suspense, lazy } from "react";

const Inner = lazy(() => import("./CinemaSceneInner"));

export function CinemaScene() {
  return (
    <div className="absolute inset-0">
      <Suspense fallback={null}>
        <Inner />
      </Suspense>
    </div>
  );
}
