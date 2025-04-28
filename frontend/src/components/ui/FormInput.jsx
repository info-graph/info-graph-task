import { useState } from 'react';

const FormInput = ({ 
  label, 
  id, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false,
  icon,
  error,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="transition-all duration-300 ease-in-out">
      <label 
        htmlFor={id} 
        className={`block text-sm font-medium mb-1 transition-colors duration-200 ${isFocused ? 'text-primary' : 'text-gray-700'}`}
      >
        {label} {required && <span className="text-danger">*</span>}
      </label>
      
      <div className="relative">
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-2 border rounded-md transition-all duration-200 ease-in-out
            ${error 
              ? 'border-danger focus:ring-danger focus:border-danger' 
              : `border-gray-300 focus:ring-primary focus:border-primary ${isFocused ? 'shadow-md' : ''}`
            }
            ${icon ? 'pl-10' : ''}
          `}
          {...props}
        />
        
        {icon && (
          <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${isFocused ? 'text-primary' : ''}`}>
            {icon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-danger animate-pulse">{error}</p>
      )}
    </div>
  );
};

export default FormInput;