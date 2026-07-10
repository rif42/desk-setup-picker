"use client";

import dynamic from "next/dynamic";

const OpeningExperience = dynamic(
  () =>
    import("./OpeningExperience").then((mod) => mod.OpeningExperience),
  {
    ssr: false,
    loading: () => <div className="min-h-[100svh] bg-background" />,
  },
);

export function OpeningLoader() {
  return <OpeningExperience />;
}
