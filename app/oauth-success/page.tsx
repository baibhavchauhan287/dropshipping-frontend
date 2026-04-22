import { Suspense } from "react";
import OAuthSuccessClient from "./OAuthSuccessClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <OAuthSuccessClient />
    </Suspense>
  );
}