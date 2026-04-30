import { Suspense, lazy } from "react";

const Inner = lazy(() => import("./EventSphereInner"));

export function EventSphere() {
  return (
    <div className="absolute inset-0">
      <Suspense fallback={null}>
        <Inner />
      </Suspense>
    </div>
  );
}
