import { useState, useEffect } from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  type = 'button',
  icon,
  className = '',
  ...props 
}) => {
  const [isPressed, setIsPressed] = useState(false);
  
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transform transition-all duration-200";
  
  const variantClasses = {
    primary: "border border-transparent text-white bg-primary hover:bg-dark-primary focus:ring-primary shadow-md hover:shadow-lg",
    secondary: "border border-primary text-primary bg-white hover:bg-light-primary focus:ring-primary",
    danger: "border border-transparent text-white bg-danger hover:bg-danger focus:ring-danger shadow-md hover:shadow-lg",
  };
  
  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${isPressed ? 'scale-95' : ''} ${className}`;
  
  return (
    <button 
      type={type} 
      className={buttonClasses} 
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      {...props}
    >
      {icon && <span className="mr-2 transition-transform group-hover:rotate-3">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;