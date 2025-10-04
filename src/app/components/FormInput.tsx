interface FormInputProps {
  label: string;
  name: string;
  type?: "text" | "email" | "tel";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  disabled = false,
}: FormInputProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-4xl tracking-[0.015em] font-hardbop mb-2"
      >
        {label}
        {required && <span className="text-secondary font-sans">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder || label}
        required={required}
        disabled={disabled}
        className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}

