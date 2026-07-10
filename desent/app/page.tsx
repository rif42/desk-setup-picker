import { WorkspaceDesigner } from "@/components/workspace/WorkspaceDesigner";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 lg:py-14">
      <header className="mb-8 max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-foreground/50">
          monis.rent · Bali
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Design your dream workspace.
        </h1>
        <p className="mt-3 text-lg text-foreground/70">
          Pick a desk, choose a chair, throw on the extras — watch your setup
          come to life, then rent it for as long as you need.
        </p>
      </header>

      <WorkspaceDesigner />
    </main>
  );
}
