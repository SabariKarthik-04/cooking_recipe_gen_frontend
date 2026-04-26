const COLORS = [
  "bg-orange-100 text-orange-700 border-orange-300",
  "bg-yellow-100 text-yellow-700 border-yellow-300",
  "bg-lime-100 text-lime-700 border-lime-300",
  "bg-red-100 text-red-700 border-red-300",
  "bg-amber-100 text-amber-700 border-amber-300",
  "bg-emerald-100 text-emerald-700 border-emerald-300",
];
const tagColor = (i) => COLORS[i % COLORS.length];

export default function IngredientTag({ label, index, onRemove }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${tagColor(index)} select-none`}
    >
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 hover:opacity-60 transition text-base leading-none"
      >
        ×
      </button>
    </span>
  );
}