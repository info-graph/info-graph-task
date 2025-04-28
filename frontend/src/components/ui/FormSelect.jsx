const FormSelect = ({
  label,
  id,
  name,
  value,
  onChange,
  options,
  required = false,
  error,
  ...props
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 py-2 border rounded-md appearance-none bg-white focus:outline-none focus:ring-2
          ${error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-teal-500 focus:border-teal-500'
          }
        `}
        required={required}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormSelect;