export function iconeEmoji(icone: string | null): string {
  const map: Record<string, string> = {
    Car: "🚗",
    Home: "🏠",
    Monitor: "💻",
    Shirt: "👕",
    Sofa: "🛋️",
    Gamepad2: "🎮",
    Briefcase: "💼",
    Wrench: "🔧",
  }
  return icone ? (map[icone] ?? "📦") : "📦"
}