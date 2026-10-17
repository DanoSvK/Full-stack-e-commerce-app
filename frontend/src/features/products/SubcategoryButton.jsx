function SubcategoryButton({ label, active, onUpdateFilter, onSubcategory }) {
  return (
    <button
      type="button"
      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-color ${active ? "bg-white/10 text-header font-bold" : "hover:bg-zinc-900 text-main"}`}
      onClick={() => {
        onUpdateFilter("subcategory", label.toLowerCase());
        onSubcategory(label.toLowerCase());
      }}
    >
      {label}
    </button>
  );
}

export default SubcategoryButton;
