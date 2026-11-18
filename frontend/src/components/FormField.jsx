import { AlertCircle } from "lucide-react";

function FormField({
  id,
  register,
  errors,
  name,
  rules,
  label,
  className = "",
}) {
  const error = name.split(".").reduce((obj, key) => obj?.[key], errors);

  return (
    <div className={`flex flex-col ${className}`}>
      <label
        htmlFor={id}
        className="text-main text-[10px] uppercase font-bold tracking-widest block mb-1"
      >
        {label}
      </label>
      <input
        {...register(name, rules)}
        id={id}
        type="text"
        className="input-field w-full text-sm"
      />
      {error && (
        <p className="flex items-center gap-1 text-red-500 text-xs">
          <AlertCircle size={14} />
          {error.message}
        </p>
      )}
    </div>
  );
}

export default FormField;
