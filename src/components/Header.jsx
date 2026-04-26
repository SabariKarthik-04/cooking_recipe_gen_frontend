export default function Header({ status }) {
  return (
    <div
      className="px-5 py-4 flex-shrink-0 bg-gradient-to-r from-amber-600 to-orange-600"
      style={{ background: "linear-gradient(135deg, #92400e 0%, #b45309 100%)" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-300 flex items-center justify-center text-2xl shadow">
            🍳
          </div>
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-white font-bold text-base leading-tight">
              Recipe Generator
            </p>
            <p className="text-amber-300 text-xs mt-0.5">Tell me what's in your kitchen</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <span className={`w-2 h-2 rounded-full ${
            status === "idle" ? "bg-green-400" :
            status === "streaming" ? "bg-amber-300 animate-pulse" :
            status === "connecting" ? "bg-yellow-300 animate-pulse" :
            "bg-red-400"
          }`} />
          <span className="text-amber-200">
            {status === "idle" ? "Ready" : status === "connecting" ? "Connecting…" : status === "streaming" ? "Cooking…" : "Error"}
          </span>
        </div>
      </div>
    </div>
  );
}