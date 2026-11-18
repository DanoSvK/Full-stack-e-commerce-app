function Checkbox({ checked, setChecked, label, id }) {
  return (
    <div>
      <input
        type="checkbox"
        name={id}
        id={id}
        className="peer sr-only"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />

      <label
        htmlFor={id}
        className="
      flex items-center gap-2
      cursor-pointer select-none
      text-sm font-medium text-header

      before:content-['']
      before:w-5 before:h-5
      before:border-[0.1px] before:border-zinc-700
      before:rounded
      before:flex before:items-center before:justify-center
      
      hover:before:border-accent

      peer-checked:before:content-['✔']
      peer-checked:before:bg-accent
      peer-checked:before:border-accent
      peer-checked:before:text-black
    "
      >
        {" "}
        {label}
      </label>
    </div>
  );
}

export default Checkbox;
