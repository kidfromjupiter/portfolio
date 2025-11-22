import { Suspense } from "react";
import dynamic from "next/dynamic";
const SpinningObjects = dynamic(() => import("./CenterSpinningObj"));
export default function TopLevelObjectSuspenseBoundary({}) {
  return (
    <Suspense fallback={null}>
      <SpinningObjects />
    </Suspense>
  );
}
