export async function preloadOpeningAssets(
  sources: string[],
  timeoutMs = 2500,
): Promise<void> {
  if (typeof window === "undefined") return;
  if (!sources || sources.length === 0) return;

  const unique = Array.from(new Set(sources.filter(Boolean)));
  if (unique.length === 0) return;

  const loads = unique.map(
    (src) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      }),
  );

  const timeout = new Promise<void>((resolve) => {
    window.setTimeout(resolve, timeoutMs);
  });

  await Promise.race([Promise.all(loads), timeout]);
}
