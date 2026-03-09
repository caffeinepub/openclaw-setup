import { InteractiveWorldMap } from "../InteractiveWorldMap";

export function AvailableWorldwideSection() {
  return (
    <section className="py-16 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent mb-2">
            ClawPro Available Worldwide
          </h2>
          <p className="text-xs text-muted-foreground/50 mt-1">
            Interactive map — click any country to highlight, hover for details
          </p>
        </div>

        <InteractiveWorldMap />
      </div>
    </section>
  );
}
