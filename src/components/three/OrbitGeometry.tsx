import { Suspense, lazy } from "react";

const Inner = lazy(() => import("./OrbitGeometryInner"));

export function OrbitGeometry() {
  return (
    <div className="absolute inset-0">
      <Suspense fallback={null}>
        <Inner />
      </Suspense>
    </div>
  );
}
