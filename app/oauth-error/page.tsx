import { Suspense } from "react";
import OAuthErrorClient from "./OAuthErrorClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <OAuthErrorClient />
    </Suspense>
  );
}