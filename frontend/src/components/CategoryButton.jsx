function CategoryButton({ label, active, onUpdateFilter }) {
  return (
    <button
      type="button"
      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors   ${active ? "bg-accent text-zinc-950 font-bold pointer-events-none" : "hover:bg-zinc-900 text-zinc-400"}`}
      onClick={() => {
        onUpdateFilter("category", label.toLowerCase());
      }}
    >
      {label}
    </button>
  );
}

export default CategoryButton;
