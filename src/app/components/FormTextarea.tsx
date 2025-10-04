interface FormTextareaProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
}

export default function FormTextarea({
  label,
  name,
  placeholder,
  required = false,
  disabled = false,
  rows = 5,
}: FormTextareaProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-4xl tracking-[0.015em] font-hardbop mb-2"
      >
        {label}
        {required && <span className="text-secondary font-sans">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        placeholder={placeholder || label}
        rows={rows}
        required={required}
        disabled={disabled}
        className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary resize-none disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}

